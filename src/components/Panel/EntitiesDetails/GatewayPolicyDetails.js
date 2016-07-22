import React, {Component, PropTypes} from 'react';

const Select = LunchBadgerCore.components.Select;
const Input = LunchBadgerCore.components.Input;

const POLICY_DUMMY_CONFIG = {
  'OAuth2': (
    <td>
      <span className="tag">Users</span>
      <span className="tag">Admins</span>
    </td>
  ),
  'Rate limit': (
    <td>
      1000 calls per hour <br />
      Inherit from API plans
    </td>
  ),
  'Logging': (
    <td>
      <span className="tag">Loggly</span>
      <span className="tag">LocalFile</span>
    </td>
  ),
  'Redirect': (
    <td>...</td>
  )
}

export default class GatewayPolicyDetails extends Component {
  static propTypes = {
    pipelineId: PropTypes.string.isRequired,
    pipelineIndex: PropTypes.number.isRequired,
    policy: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {type: props.policy.type};
  }

  onTypeChange(ev) {
    this.setState({type: ev.target.value});
  }

  render() {
    const {pipelineId, pipelineIndex, policy, index} = this.props;

    return (
      <tr key={`pipeline-${pipelineId}-policy-${policy.id}`}>
        <td>
          <Input value={policy.id}
                 type="hidden"
                 name={`pipelines[${pipelineIndex}][policies][${index}][id]`}/>
          <Input className="details-panel__input"
                 value={policy.name}
                 name={`pipelines[${pipelineIndex}][policies][${index}][name]`}/>
        </td>
        <td>
          <Select className="details-panel__input details-panel__select"
                  value={policy.type}
                  name={`pipelines[${pipelineIndex}][policies][${index}][type]`}
                  handleChange={this.onTypeChange.bind(this)}>
            <option value="OAuth2">OAuth2</option>
            <option value="Rate limit">Throttling</option>
            <option value="Logging">Logging</option>
            <option value="Redirect">Redirect</option>
          </Select>
        </td>
        {POLICY_DUMMY_CONFIG[this.state.type]}
      </tr>
    );
  }
}
