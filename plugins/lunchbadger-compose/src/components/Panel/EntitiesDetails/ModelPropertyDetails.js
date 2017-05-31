import React, {Component} from 'react';
import PropTypes from 'prop-types';
const {Input, Select, Textarea} = LunchBadgerCore.components;
const {propertyTypes} = LunchBadgerCore.utils;
import {Checkbox} from '../../../../../lunchbadger-ui/src';

export default class ModelPropertyDetails extends Component {
  static propTypes = {
    property: PropTypes.object.isRequired,
    onRemove: PropTypes.func.isRequired,
    addAction: PropTypes.func.isRequired,
    propertiesCount: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      inputType: props.property.type === 'object' ? 'textarea' : 'input'
    };
  }

  onRemove(property) {
    this.props.onRemove(property);
  }

  _checkTabButton = (event) => {
    if ((event.which === 9 || event.keyCode === 9) && !event.shiftKey && this.props.propertiesCount === this.props.index + 1) {
      this.props.addAction();
    }
  }

  _changePropertyType = (value) => {
    if (value === 'object') {
      this.setState({inputType: 'textarea'});
    } else {
      this.setState({inputType: 'input'});
    }
  }

  renderInput() {
    const {property, index} = this.props;

    if (this.state.inputType === 'textarea') {
      return (
        <Textarea className="details-panel__textarea"
                  value={property.default_}
                  validations="isJSON"
                  name={`properties[${index}][default_]`}
        />
      );
    } else {
      return (
        <Input className="details-panel__input"
               value={property.default_}
               name={`properties[${index}][default_]`}
        />
      );
    }
  }

  render() {
    const {property, index} = this.props;

    return (
      <tr>
        <td>
          <Input value={property.id}
                 type="hidden"
                 name={`properties[${index}][id]`}/>

          <Input className="details-panel__input details-key"
                 value={property.name}
                 name={`properties[${index}][name]`}
          />
        </td>
        <td>
          <Select className="details-panel__input details-panel__select"
                  value={property.type || 'string'}
                  handleChange={this._changePropertyType}
                  name={`properties[${index}][type]`}
                  options={propertyTypes}
          />
        </td>
        <td>
          {this.renderInput()}
        </td>
        <td>
          <Checkbox value={property.required}
                    name={`properties[${index}][required]`}
          />
        </td>
        <td>
          <Checkbox value={property.index}
                    name={`properties[${index}][index]`}
          />
        </td>
        <td>
          <Input className="details-panel__input"
                 value={property.description}
                 name={`properties[${index}][description]`}
                 type="text"
                 handleKeyDown={this._checkTabButton}
          />
        </td>
        <td className="details-panel__table__cell details-panel__table__cell--empty">
          <i className="fa fa-remove details-panel__table__action" onClick={() => this.onRemove(property)}/>
        </td>
      </tr>
    );
  }
}
