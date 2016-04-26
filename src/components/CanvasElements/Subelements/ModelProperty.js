import React, {Component, PropTypes} from 'react';
import './ModelProperty.scss';

export default class ModelProperty extends Component {
  static propTypes = {
    property: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      propertyKey: this.props.property.propertyKey,
      propertyValue: this.props.property.propertyValue
    };
  }

  updatePropertyKey(evt) {
    this.setState({propertyKey: evt.target.value});
    this.props.property.update({propertyKey: evt.target.value});
  }

  updatePropertyValue(evt) {
    this.setState({propertyValue: evt.target.value});
    this.props.property.update({propertyValue: evt.target.value});
  }

  componentWillReceiveProps(props) {
    this.setState({
      propertyKey: props.property.propertyKey,
      propertyValue: props.property.propertyValue
    });
  }

  render() {
    return (
      <div className="model-property">
        <div className="model-property__key-cell">
          <span className="model-property__value key hide-while-edit">
            {this.state.propertyKey}
          </span>
          <input className="model-property__input editable-only"
                 value={this.state.propertyKey}
                 type="text"
                 onChange={this.updatePropertyKey.bind(this)}
          />
        </div>
        <div className="model-property__value-cell">
          <span className="model-property__value value hide-while-edit">
            {this.state.propertyValue}
          </span>
          <input className="model-property__input editable-only"
                 value={this.state.propertyValue}
                 type="text"
                 onChange={this.updatePropertyValue.bind(this)}
          />
        </div>
      </div>
    );
  }
}
