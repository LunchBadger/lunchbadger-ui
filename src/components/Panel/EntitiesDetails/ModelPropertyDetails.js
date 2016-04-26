import React, {Component, PropTypes} from 'react';

export default class ModelPropertyDetails extends Component {
  static propTypes = {
    property: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      propertyKey: this.props.property.propertyKey,
      propertyValue: this.props.property.propertyValue,
      propertyType: this.props.property.propertyType,
      propertyIsRequired: this.props.property.propertyIsRequired,
      propertyIsIndex: this.props.property.propertyIsIndex,
      propertyNotes: this.props.property.propertyNotes
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      propertyKey: props.property.propertyKey,
      propertyValue: props.property.propertyValue,
      propertyType: props.property.propertyType,
      propertyIsRequired: props.property.propertyIsRequired,
      propertyIsIndex: props.property.propertyIsIndex,
      propertyNotes: props.property.propertyNotes
    });
  }

  updatePropertyKey(evt) {
    this.setState({propertyKey: evt.target.value});
    this.props.property.update({propertyKey: evt.target.value});
  }

  updatePropertyValue(evt) {
    this.setState({propertyValue: evt.target.value});
    this.props.property.update({propertyValue: evt.target.value});
  }

  updatePropertyType(evt) {
    this.setState({propertyType: evt.target.value});
    this.props.property.update({propertyType: evt.target.value});
  }

  updatePropertyIsRequired(evt) {
    this.setState({propertyIsRequired: evt.target.value});
    this.props.property.update({propertyIsRequired: evt.target.value});
  }

  updatePropertyIsIndex(evt) {
    this.setState({propertyIsIndex: evt.target.value});
    this.props.property.update({propertyIsIndex: evt.target.value});
  }

  updatePropertyNotes(evt) {
    this.setState({propertyNotes: evt.target.value});
    this.props.property.update({propertyNotes: evt.target.value});
  }

  render() {
    return (
      <tr>
        <td>
          <input className="details-panel__input"
                 value={this.state.propertyKey}
                 type="text"
                 onChange={this.updatePropertyKey.bind(this)}
          />
        </td>
        <td>
          <input className="details-panel__input"
                 value={this.state.propertyType}
                 type="text"
                 onChange={this.updatePropertyType.bind(this)}
          />
        </td>
        <td>
          <input className="details-panel__input"
                 value={this.state.propertyValue}
                 type="text"
                 onChange={this.updatePropertyValue.bind(this)}
          />
        </td>
        <td>
          <input className="model-property__input"
                 value={this.state.propertyIsRequired}
                 checked={this.state.propertyIsRequired}
                 type="checkbox"
                 onChange={this.updatePropertyIsRequired.bind(this)}
          />
        </td>
        <td>
          <input className="model-property__input"
                 value={this.state.propertyIsIndex}
                 checked={this.state.propertyIsIndex}
                 type="checkbox"
                 onChange={this.updatePropertyIsIndex.bind(this)}
          />
        </td>
        <td>
          <input className="details-panel__input"
                 value={this.state.propertyNotes}
                 type="text"
                 onChange={this.updatePropertyNotes.bind(this)}
          />
        </td>
      </tr>
    );
  }
}
