import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

const BaseDetails = LunchBadgerCore.components.BaseDetails;

class APIDetails extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
  };

  static contextTypes = {
    store: PropTypes.object,
  };

  update = async (model) => {
    const {entity} = this.props;
    const {store: {dispatch, getState}} = this.context;
    const plugins = getState().plugins;
    const onUpdate = plugins.onUpdate.API;
    const updatedEntity = await dispatch(onUpdate(_.merge({}, entity, model)));
    const {coreActions} = LunchBadgerCore.utils;
    dispatch(coreActions.setCurrentElement(updatedEntity));
  }

  render() {
    return null;
  }
}

export default BaseDetails(APIDetails);
