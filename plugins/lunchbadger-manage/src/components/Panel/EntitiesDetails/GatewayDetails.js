import React, {Component} from 'react';
import PropTypes from 'prop-types';
import update from 'react-addons-update';
import Pipeline from '../../../models/Pipeline';
import Policy from '../../../models/Policy';
import GatewayPolicyDetails from './GatewayPolicyDetails';
import _ from 'lodash';

const BaseDetails = LunchBadgerCore.components.BaseDetails;
const CollapsableDetails = LunchBadgerCore.components.CollapsableDetails;
const Input = LunchBadgerCore.components.Input;

const InputField = LunchBadgerCore.components.InputField;

class GatewayDetails extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  static contextTypes = {
    store: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      dnsPrefix: props.entity.dnsPrefix,
      pipelines: props.entity.pipelines.slice(),
      changed: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.entity !== nextProps.entity) {
      this.setState({
        dnsPrefix: nextProps.entity.dnsPrefix,
        pipelines: nextProps.entity.pipelines.slice(),
        changed: false,
      });
    }
  }

  // update(model) {
  //   let data = {
  //     pipelines: (model.pipelines || []).map(pipeline => {
  //       let policies = pipeline.policies || [];
  //       delete pipeline.policies;
  //
  //       return Pipeline.create({
  //         ...pipeline,
  //         policies: policies.map(policy => Policy.create(policy))
  //       });
  //     })
  //   }
  //   redeployGateway(this.props.entity, _.merge(model, data));
  // }

  update = async (model) => {
    const entity = _.merge({}, this.props.entity);
    const {store: {dispatch, getState}} = this.context;
    const plugins = getState().plugins;
    const onUpdate = plugins.onUpdate.Gateway;
    entity.pipelines = [];
    const updatedEntity = await dispatch(onUpdate(_.merge({}, entity, model)));
    const {coreActions} = LunchBadgerCore.utils;
    dispatch(coreActions.setCurrentElement(updatedEntity));
  }

  _setPipelineState(pipelines) {
    this.setState({
      pipelines: pipelines,
      changed: !_.isEqual(pipelines, this.props.entity.pipelines)
    }, () => {
      this.props.parent.checkPristine();
    });
  }

  onAddPipeline() {
    this._setPipelineState([...this.state.pipelines, Pipeline.create({
      name: 'Pipeline'
    })]);
  }

  onRemovePipeline(plIdx) {
    this._setPipelineState(update(this.state.pipelines, {
      $splice: [[plIdx, 1]]
    }));
  }

  onAddPolicy(plIdx) {
    this._setPipelineState(update(this.state.pipelines, {
      [plIdx]: {
        policies: {
          $push: [Policy.create({
            name: 'New policy',
            type: 'Rate limit'
          })]
        }
      }
    }));
  }

  onRemovePolicy(plIdx, policyIdx) {
    this._setPipelineState(update(this.state.pipelines, {
      [plIdx]: {
        policies: {$splice: [[policyIdx, 1]]}
      }
    }));
  }

  onPrefixChange = (event) => {
    this.setState({
      dnsPrefix: event.target.value
    });
  }

  renderPipelines() {
    return this.state.pipelines.map((pipeline, plIdx) => {
      const policies = pipeline.policies.map((policy, index) => {
        return <GatewayPolicyDetails key={`pipeline-${pipeline.id}-policy-${policy.id}`}
                                     pipelineIndex={plIdx}
                                     policy={policy}
                                     index={index}
                                     onRemove={this.onRemovePolicy.bind(this, plIdx)} />;
      });

      return (
        <div key={`pipeline-${pipeline.id}`}>
          <div className="details-panel__section-name">
            <Input value={pipeline.id}
                   type="hidden"
                   name={`pipelines[${plIdx}][id]`}/>
            <Input className="details-panel__input"
                   value={pipeline.name}
                   name={`pipelines[${plIdx}][name]`}/>
            <i className="fa fa-remove details-panel__action"
               onClick={() => this.onRemovePipeline(plIdx)}/>
          </div>
          <table className="details-panel__table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>
                  Details
                  <a onClick={() => this.onAddPolicy(plIdx)} className="details-panel__add">
                    <i className="fa fa-plus"/>
                    Add policy
                  </a>
                </th>
                <th className="details-panel__table__cell details-panel__table__cell--empty"/>
              </tr>
            </thead>
            <tbody>
              {policies}
            </tbody>
          </table>

        </div>
      );
    });
  }

  render() {
    const entity = this.props.entity;
    const url = `http://${this.state.dnsPrefix}.customer.lunchbadger.com`;

    return (
      <div>
        <CollapsableDetails title="Details" class="details-panel__columns">
          <InputField label="DNS prefix"
                      propertyName="dnsPrefix"
                      entity={entity}
                      handleChange={this.onPrefixChange}/>
          <div className="details-panel__fieldset">
            <label className="details-panel__label">
              Root URL
            </label>
            <div className="details-panel__static-field">
              <a href="{url}" target="_blank">{url}</a>
            </div>
          </div>
        </CollapsableDetails>
        <CollapsableDetails title="Pipelines">
          {this.renderPipelines()}
          <a onClick={() => this.onAddPipeline()} className="details-panel__add-section">
            <i className="fa fa-plus"/>
            Add pipeline
          </a>
        </CollapsableDetails>
      </div>
    )
  }
}

export default BaseDetails(GatewayDetails);
