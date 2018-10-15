import React, {Component} from 'react';
import PropTypes from 'prop-types';
import dataSources from './Subelements/DataSources';
import './Rest.scss';

const {components: {CanvasElement, Port}} = LunchBadgerCore;

class DataSource extends Component {
  static contextTypes = {
    paper: PropTypes.object,
  };

  processModel = model => this.props.entity.processModel(model);

  onRemove = () => this.props.entity.beforeRemove(this.context.paper.getInstance());

  discardChanges = callback => this.compRef && this.compRef.onPropsUpdate
    ? this.compRef.onPropsUpdate(callback)
    : callback();

  render() {
    const {entity, validations} = this.props;
    const {ports, connector, gaType, connector: {type}} = entity;
    const DataSourceComponent = dataSources[connector];
    return (
      <div>
        {ports.map(({id, portType, portGroup}) => (
          <Port
            key={`port-${portType}-${id}`}
            way={portType}
            elementId={id}
            scope={portGroup}
            className={`port-${type} port-${portGroup}`}
            gaType={gaType}
          />
        ))}
        <DataSourceComponent
          ref={r => this.compRef = r}
          entity={entity}
          plain
          validations={validations}
        />
      </div>
    );
  }
}

export default CanvasElement(DataSource);
