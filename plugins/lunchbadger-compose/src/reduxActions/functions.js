import {actions} from './actions';
import {ModelService} from '../services';
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
  const index = state.multiEnvironments.selected;
  let updatedEntity;
  if (index > 0) {
    updatedEntity = Function_.create({...entity.toJSON(), ...model});
    dispatch(actionsCore.multiEnvironmentsUpdateEntity({index, entity: updatedEntity}));
    return updatedEntity;
  }
  const isDifferent = entity.loaded && model.name !== state.entities.functions[entity.id].name;
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
    updatedEntity = Function_.create(body);
    dispatch(actions.updateFunction(updatedEntity));
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
