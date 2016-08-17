import React, {Component, PropTypes} from 'react';
import update from 'react-addons-update';
import redeployGateway from 'actions/CanvasElements/Gateway/redeploy';
import Pipeline from 'models/Pipeline';
import Policy from 'models/Policy';
import GatewayStore from 'stores/Gateway';
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

  constructor(props) {
    super(props);

    this.state = {
      pipelines: props.entity.pipelines.slice(),
      changed: false
    };

    this.onStoreUpdate = () => {
      this.setState({
        pipelines: this.props.entity.pipelines.slice(),
        changed: false
      });
    };
  }

  componentDidMount() {
    GatewayStore.addChangeListener(this.onStoreUpdate);
  }

  componentWillUnmount() {
    GatewayStore.removeChangeListener(this.onStoreUpdate);
  }

  update(model) {
    let data = {
      pipelines: (model.pipelines || []).map(pipeline => {
        let policies = pipeline.policies || [];
        delete pipeline.policies;

        return Pipeline.create({
          ...pipeline,
          policies: policies.map(policy => Policy.create(policy))
        });
      })
    }
    redeployGateway(this.props.entity, _.merge(model, data));
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

  onRemovePipeline(pipeline, plIdx) {
    this._setPipelineState(update(this.state.pipelines, {
      $splice: [[plIdx, 1]]
    }));
  }

  onAddPolicy(pipeline, plIdx) {
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

  onRemovePolicy(pipeline, plIdx, policy, policyIdx) {
    this._setPipelineState(update(this.state.pipelines, {
      [plIdx]: {
        policies: {$splice: [[policyIdx, 1]]}
      }
    }));
  }

  renderPipelines() {
    return this.state.pipelines.map((pipeline, plIdx) => {
      const policies = pipeline.policies.map((policy, index) => {
        return <GatewayPolicyDetails key={`pipeline-${pipeline.id}-policy-${policy.id}`}
                                     pipelineIndex={plIdx}
                                     policy={policy}
                                     index={index}
                                     onRemove={this.onRemovePolicy.bind(this, pipeline, plIdx)} />;
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
               onClick={() => this.onRemovePipeline(pipeline, plIdx)}/>
          </div>
          <table className="details-panel__table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>
                  Details
                  <a onClick={() => this.onAddPolicy(pipeline, plIdx)} className="details-panel__add">
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

    return (
      <div>
        <CollapsableDetails title="Details">
          <InputField label="DNS prefix" propertyName="dnsPrefix" entity={entity} />
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

