import React, {Component, PropTypes} from 'react';
import './Policy.scss';

const {Input} = LunchBadgerCore.components;

export default class Policy extends Component {
  static propTypes = {
    policy: PropTypes.object.isRequired,
    pipelineIndex: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {policy, pipelineIndex, index} = this.props;

    return (
      <div className="policy">
        <div className="policy__icon">
          <i className="fa fa-certificate"/>
        </div>
        <div className="policy__name">
          <span className="hide-while-edit">{policy.name}</span>

          <Input className="canvas-element__input canvas-element__input--property editable-only"
                 value={policy.name}
                 name={`pipelines[${pipelineIndex}][policies][${index}][name]`}/>
          <Input value={policy.id}
                 type="hidden"
                 name={`pipelines[${pipelineIndex}][policies][${index}][id]`}/>
          <Input value={policy.type}
                 type="hidden"
                 name={`pipelines[${pipelineIndex}][policies][${index}][type]`}/>

        </div>
      </div>
    );
  }
}
