import React from 'react';
import slug from 'slug';
import {actions} from './actions';
import {SLSService} from '../services';
import Function_ from '../models/Function';
import {runtimeMapping} from '../utils';

const {storeUtils, coreActions, actions: actionsCore, userStorage} = LunchBadgerCore.utils;

export const add = () => (dispatch, getState) => {
  const {entities, plugins: {quadrants}} = getState();
  const types = quadrants[1].entities;
  const itemOrder = storeUtils.getNextItemOrder(types, entities);
  const name = storeUtils.uniqueName('myfunction', entities.functions);
  const entity = Function_.create({name, itemOrder, loaded: false});
  dispatch(actions.updateFunction(entity));
  return entity;
}

export const update = (entity, model) => async (dispatch, getState) => {
  const state = getState();
  const {loaded, id, itemOrder} = entity;
  const {name, runtime} = model;
  const index = state.multiEnvironments.selected;
  let updatedEntity;
  if (index > 0) {
    updatedEntity = Function_.create({...entity.toJSON(), ...model});
    dispatch(actionsCore.multiEnvironmentsUpdateEntity({index, entity: updatedEntity}));
    return updatedEntity;
  }
  const data = {
    ...entity.toJSON(),
    ...model,
    ready: false,
    running: null,
    error: null,
  };
  if (!data.service.serverless) {
    data.service.serverless = {provider: {runtime: runtimeMapping(runtime, true).sls}};
  }
  updatedEntity = Function_.create(data);
  dispatch(actions.updateFunction(updatedEntity));
  updatedEntity = updatedEntity.recreate();
  try {
    if (!loaded) {
      const [env, version] = runtime.split(':');
      const slsCreate = await SLSService.create({name, env, version, lunchbadger: {id, itemOrder}});
      updatedEntity.service = slsCreate.body;
    } else {
      updatedEntity.service = model.service;
    }
    const slsDeploy = await SLSService.update(name, updatedEntity.service);
    updatedEntity.service = slsDeploy.body;
    await dispatch(coreActions.saveToServer({saveProject: false}));
    SLSService.deploy(name); // 903: removed await here
    updatedEntity.running = null;
  } catch (error) {
    // in theory that should not happen, at least deploy call should be always 200
    updatedEntity.running = false;
    let errorMessage = (
      <div>
        <code>{updatedEntity.name}</code> {'failed to deploy.'}
        {' '}
        {'Another attempt will be made automatically. If it successful, this error will be resolved.'}
      </div>
    );
    if (
      error.request
      && error.request.url === '/deploy'
      && error.body
      && error.body.info === 'deploy failed'
    ) {
      errorMessage = (
        <div>
          {'Function deployment failed.'}
          <br />
          {'Please check if the function code you provided is valid and correct.'}
        </div>
      );
    }
    error.friendlyTitle = <div>Function <code>{updatedEntity.name}</code> deployment failed</div>;
    error.friendlyMessage = errorMessage;
    updatedEntity.error = error;
  }
  updatedEntity.ready = true;
  dispatch(actions.updateFunction(updatedEntity));
  return updatedEntity;
};

export const remove = (entity, cb) => async (dispatch) => {
  const updatedEntity = entity.recreate();
  updatedEntity.deleting = true;
  updatedEntity.error = null;
  const slugId = `${entity.id}-${slug(entity.name, {lower: true})}`;
  dispatch(actions.updateFunction(updatedEntity));
  if (entity.loaded) {
    userStorage.setObjectKey('function', slugId, updatedEntity.toJSON());
    try {
      SLSService.remove(entity.name);
    } catch (error) {}
    try {
      if (cb) {
        await dispatch(cb());
      }
      await dispatch(coreActions.saveToServer({saveProject: false}));
    } catch (error) {
      dispatch(coreActions.addSystemDefcon1({error}));
    }
  } else {
    dispatch(actions.removeFunction(entity));
  }
};

export const saveOrder = orderedIds => async (dispatch, getState) => {
  const entities = getState().entities.functions;
  const reordered = [];
  orderedIds.forEach((id, idx) => {
    if (entities[id] && entities[id].itemOrder !== idx) {
      const entity = entities[id].recreate();
      entity.itemOrder = idx;
      entity.service.serverless.lunchbadger.itemOrder = entity.itemOrder;
      reordered.push(entity);
    }
  });
  if (reordered.length > 0) {
    dispatch(actions.updateFunctions(reordered));
    try {
      await Promise.all(reordered.map(({name, service}) => SLSService.update(name, service)));
    } catch (error) {
      dispatch(coreActions.addSystemDefcon1({error}));
    }
  }
};

export const clearService = () => async () => {
  await SLSService.clear();
};

export const restart = entity => (dispatch) => {
  const {name} = entity;
  SLSService.deploy(name);
  setTimeout(() => {
    dispatch(actionsCore.addSystemInformationMessage({
      type: 'success',
      message: (
        <span>
          <strong>{name}</strong>
          {' '}
          {'was triggered to be restarted'}
        </span>
      ),
    }));
  }, 300);
};
