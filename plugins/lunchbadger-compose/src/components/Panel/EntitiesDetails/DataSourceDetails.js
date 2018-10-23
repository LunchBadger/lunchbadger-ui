import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import dataSources from '../../CanvasElements/Subelements/DataSources';
import './Rest.scss';
import './Soap.scss';

const {components: {BaseDetails}} = LunchBadgerCore;

class DataSourceDetails extends Component {
  static contextTypes = {
    paper: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      changed: false,
    };
  }

  handleStateChange = (_, cb) => {
    this.setState({changed: true}, () => {
      this.props.parent.checkPristine();
      cb && cb();
    });
  };

  processModel = model => this.props.entity.processModel(model);

  onRemove = () => this.props.entity.beforeRemove(this.context.paper.getInstance());

  discardChanges = callback => {
    if (this.compRef && this.compRef.onPropsUpdate) {
      this.compRef.onPropsUpdate(() => this.setState({changed: false}, callback));
    } else {
      callback();
    }
  };

  render() {
    const {entity} = this.props;
    const {connector} = entity;
    const DataSourceComponent = dataSources[connector];
    return (
      <div className={cs('panel__details', connector)}>
        <DataSourceComponent
          ref={r => this.compRef = r}
          entity={entity}
          onStateChange={this.handleStateChange}
        />
      </div>
    );
  }
}

export default BaseDetails(DataSourceDetails);
