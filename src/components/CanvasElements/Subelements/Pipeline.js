import React, {Component, PropTypes} from 'react';
import Port from '../Port';
import Policy from './Policy';
import classNames from 'classnames';
import './Pipeline.scss';

export default class Pipeline extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      opened: false
    };
  }

  renderPolicies() {
    return this.props.entity.policies.map((policy) => {
      return <Policy key={policy.id} policy={policy}/>;
    });
  }

  toggleOpenState() {
    this.setState({opened: !this.state.opened});
  }

  render() {
    const pipelineClass = classNames({
      pipeline: true,
      'pipeline--opened': this.state.opened
    });

    return (
      <div className={pipelineClass}>
        <div className="pipeline__info" onClick={this.toggleOpenState.bind(this)}>
          <div className="pipeline__icon">
            <i className="fa fa-inbox"/>
          </div>
          <div className="pipeline__name">
            {this.props.entity.name}
          </div>

          <Port way="in" className="canvas-element__port canvas-element__port--in"/>
          <Port way="out" className="canvas-element__port canvas-element__port--out"/>
        </div>

        <div className="pipeline__details">
          <div className="pipeline__details__title">Policies</div>
          {this.renderPolicies()}
        </div>
      </div>
    );
  }
}
