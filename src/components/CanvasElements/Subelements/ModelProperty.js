import React, {Component, PropTypes} from 'react';
//import './ModelProperty.scss';

export default class ModelProperty extends Component {
  static propTypes = {
    propertyKey: PropTypes.string.isRequired,
    propertyValue: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      propertyKey: this.props.propertyKey,
      propertyValue: this.props.propertyValue
    };
  }

  updatePropertyKey(evt) {
    this.setState({propertyKey: evt.target.value});
  }

  updatePropertyValue(evt) {
    this.setState({propertyValue: evt.target.value});
  }

  render() {
    return (
      <div className="canvas-element__properties__property">
        <div className="canvas-element__properties__property-value">
          <span className="canvas-element__span--property key hide-while-edit">{this.state.propertyKey}</span>
          <input className="canvas-element__input canvas-element__input--property editable-only"
                 value={this.state.propertyKey}
                 type="text"
                 onChange={this.updatePropertyKey.bind(this)}
          />
          <span className="canvas-element__span--property value hide-while-edit">{this.state.propertyValue}</span>
          <input className="canvas-element__input canvas-element__input--property editable-only"
                 value={this.state.propertyValue}
                 type="text"
                 onChange={this.updatePropertyValue.bind(this)}
          />
        </div>
      </div>
    );
  }
}
