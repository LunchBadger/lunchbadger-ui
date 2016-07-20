import React, {Component, PropTypes} from 'react';
import redeployGateway from 'actions/CanvasElements/Gateway/redeploy';
import Pipeline from 'models/Pipeline';
import Policy from 'models/Policy';
import GatewayStore from 'stores/Gateway';
import _ from 'lodash';

const BaseDetails = LunchBadgerCore.components.BaseDetails;
const CollapsableDetails = LunchBadgerCore.components.CollapsableDetails;
const Input = LunchBadgerCore.components.Input;
const Select = LunchBadgerCore.components.Select;
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

  update(gateway) {
    let data = {
      pipelines: gateway.pipelines.map(pipeline => {
        let policies = pipeline.policies || [];
        delete pipeline.policies;

        return Pipeline.create({
          ...pipeline,
          policies: policies.map(policy => Policy.create(policy))
        });
      })
    }
    redeployGateway(this.props.entity.id, _.merge(gateway, data));
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

  renderPipelines() {
    return this.state.pipelines.map((pipeline, plIdx) => {
      const policies = pipeline.policies.map((policy, index) => {
        return (
          <tr key={`pipeline-${pipeline.id}-policy-${policy.id}`}>
            <td>
              <Input value={policy.id}
                     type="hidden"
                     name={`pipelines[${plIdx}][policies][${index}][id]`}/>
              <Input className="details-panel__input"
                     value={policy.name}
                     name={`pipelines[${plIdx}][policies][${index}][name]`}/>
            </td>
            <td>
              <Select className="details-panel__input details-panel__select"
                      value={policy.type}
                      name={`pipelines[${plIdx}][policies][${index}][type]`}>
                <option value="OAuth2">OAuth2</option>
                <option value="Rate limit">Throttling</option>
                <option value="Logging">Logging</option>
                <option value="Redirect">Redirect</option>
                <option value="Reverse proxy">Reverse proxy</option>
              </Select>
            </td>
            <td>...</td>
          </tr>
        );
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
          {this.renderPipelines()}
          <a onClick={() => this.onAddPipeline()} className="details-panel__add">
            <i className="fa fa-plus"/>
            Add pipeline
          </a>
        </CollapsableDetails>
      </div>
    )
  }
}

export default BaseDetails(GatewayDetails);

