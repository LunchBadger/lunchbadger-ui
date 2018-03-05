import {actions} from './actions';
import {ModelService, SLSService} from '../services';
import Function_ from '../models/Function';

const {coreActions, actions: actionsCore} = LunchBadgerCore.utils;

export const add = () => (dispatch, getState) => {
  const {entities, plugins: {quadrants}} = getState();
  const types = quadrants[1].entities;
  const itemOrder = types.reduce((map, type) => map + Object.keys(entities[type]).length, 0);
  const entity = Function_.create({name: 'myfunction', itemOrder, loaded: false});
  dispatch(actions.updateFunction(entity));
  return entity;
}

export const update = (entity, model) => async (dispatch, getState) => {
  const state = getState();
  const {loaded} = entity;
  const {name} = model;
  const index = state.multiEnvironments.selected;
  let updatedEntity;
  const isAutoSave = false;
  if (index > 0) {
    updatedEntity = Function_.create({...entity.toJSON(), ...model});
    dispatch(actionsCore.multiEnvironmentsUpdateEntity({index, entity: updatedEntity}));
    return updatedEntity;
  }
  const isDifferent = entity.loaded && name !== state.entities.functions[entity.id].name;
  updatedEntity = Function_.create({...entity.toJSON(), ...model, ready: false});
  dispatch(actions.updateFunction(updatedEntity));
  try {
    const {body} = await ModelService.upsert(updatedEntity.toJSON());
    if (isDifferent) {
      await ModelService.delete(entity.workspaceId);
      await ModelService.deleteModelConfig(entity.workspaceId);
      await ModelService.upsertModelConfig({
        name: updatedEntity.name,
        id: updatedEntity.workspaceId,
        facetName: 'server',
        dataSource: null,
        public: updatedEntity.public,
      });
    }
    if (!loaded) {
      const [env, version] = model.runtime.toLowerCase().split(' ');
      const slsCreate = await SLSService.create({name, env, version});
      body.service = slsCreate.body;
    } else {
      body.service = model.service;
      const slsDeploy = await SLSService.update(name, body.service);
      body.service = slsDeploy.body;
    }
    await SLSService.deploy(name);
    const list = await SLSService.list();
    dispatch(actions.updateSlsService(list.body));
    updatedEntity = Function_.create(body);
    dispatch(actions.updateFunction(updatedEntity));
    if (isAutoSave) {
      await dispatch(coreActions.saveToServer());
    }
    return updatedEntity;
  } catch (err) {
    dispatch(coreActions.addSystemDefcon1(err));
  }
};

export const remove = entity => async (dispatch) => {
  try {
    dispatch(actions.removeFunction(entity));
    if (entity.loaded) {
      await ModelService.delete(entity.workspaceId);
      await ModelService.deleteModelConfig(entity.workspaceId);
      await SLSService.remove(entity.name);
      const list = await SLSService.list();
      dispatch(actions.updateSlsService(list.body));
    }
  } catch (err) {
    dispatch(coreActions.addSystemDefcon1(err));
  }
};

export const saveOrder = orderedIds => async (dispatch, getState) => {
  const entities = getState().entities.functions;
  const reordered = [];
  orderedIds.forEach((id, idx) => {
    if (entities[id] && entities[id].itemOrder !== idx) {
      const entity = entities[id].recreate();
      entity.itemOrder = idx;
      reordered.push(entity);
    }
  });
  if (reordered.length > 0) {
    dispatch(actions.updateFunctions(reordered));
    try {
      await ModelService.upsert(reordered);
    } catch (err) {
      dispatch(coreActions.addSystemDefcon1(err));
    }
  }
};

export const loadService = entity => async (dispatch) => {
  const {body} = await SLSService.get(entity.name);
  const updatedEntity = entity.recreate();
  updatedEntity.service = body;
  dispatch(actions.updateFunction(updatedEntity));
};

export const loadFunctionServices = () => (dispatch, getState) => {
  const {functions} = getState().entities;
  Promise.all(Object.keys(functions).map(key =>
    dispatch(loadService(functions[key]))
  ));
  if (Object.keys(functions).length > 0) {
    dispatch(coreActions.clearCurrentElement());
  }
};

export const clearService = () => async (dispatch, getState) => {
  const {slsService} = getState().entities;
  await Promise.all(slsService.map(name => SLSService.remove(name)));
  dispatch(actions.updateSlsService([]));
};
