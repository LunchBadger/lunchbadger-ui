import React, {Component, PropTypes} from 'react';
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

  onAddPipeline() {
    const pipelines = [...this.state.pipelines, Pipeline.create({
      name: 'Pipeline'
    })];

    this.setState({
      pipelines: pipelines,
      changed: !_.isEqual(pipelines, this.props.entity.pipelines)
    }, () => {
      this.props.parent.checkPristine();
    });
  }

  onRemovePipeline(pipeline) {
    const pipelines = _.filter(this.state.pipelines, pl => {
      return pl.id !== pipeline.id;
    });

    this.setState({
      pipelines: pipelines,
      changed: !_.isEqual(pipelines, this.props.entity.pipelines)
    }, () => {
      this.props.parent.checkPristine();
    });
  }

  renderPipelines() {
    return this.state.pipelines.map((pipeline, plIdx) => {
      const policies = pipeline.policies.map((policy, index) => {
        return <GatewayPolicyDetails pipelineId={pipeline.id}
                                     pipelineIndex={plIdx}
                                     policy={policy}
                                     index={index} />;
      });

      return (
        <div key={`pipeline-${pipeline.id}`}>
          <h3 className="details-panel__subtitle">
            <Input value={pipeline.id}
                   type="hidden"
                   name={`pipelines[${plIdx}][id]`}/>
            <Input className="details-panel__input"
                   value={pipeline.name}
                   name={`pipelines[${plIdx}][name]`}/>
            <i className="fa fa-remove details-panel__table__action"
               onClick={() => this.onRemovePipeline(pipeline)}/>
          </h3>
          <table className="details-panel__table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Details</th>
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
          <InputField label="Root URL" propertyName="rootPath" entity={entity} />
        </CollapsableDetails>
        <CollapsableDetails title="Pipelines">
          <a onClick={() => this.onAddPipeline()} className="details-panel__add">
            <i className="fa fa-plus"/>
            Add pipeline
          </a>
          {this.renderPipelines()}
        </CollapsableDetails>
      </div>
    )
  }
}

export default BaseDetails(GatewayDetails);

