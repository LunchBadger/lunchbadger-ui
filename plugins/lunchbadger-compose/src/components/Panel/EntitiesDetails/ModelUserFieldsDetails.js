import React, {Component} from 'react';
import PropTypes from 'prop-types';

const {Input, Select, Textarea} = LunchBadgerCore.components;
const ModelClass = LunchBadgerManage.models.Model;

const userFieldsTypeOptions = [
  {label: 'String', value: 'string'},
  {label: 'Number', value: 'number'},
  {label: 'Object', value: 'object'},
];

export default class ModelUserFieldsDetails extends Component {
  static propTypes = {
    field: PropTypes.object.isRequired,
    onRemove: PropTypes.func.isRequired,
    addAction: PropTypes.func.isRequired,
    fieldsCount: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      inputType: props.field.type === 'object' ? 'textarea' : 'input'
    };
  }

  onRemove(field) {
    this.props.onRemove(field);
  }

  _checkTabButton = (event) => {
    if ((event.which === 9 || event.keyCode === 9) && !event.shiftKey && this.props.fieldsCount === this.props.index + 1) {
      this.props.addAction();
    }
  }

  _changeFieldType = (value) => {
    if (value === 'object') {
      this.setState({inputType: 'textarea'});
    } else {
      this.setState({inputType: 'input'});
    }
  }

  _prepareValue(value) {
    const {field} = this.props;
    const {type} = field;

    if (type === 'object') {
      return JSON.stringify(value);
    } else if (type === 'number') {
      return String(value);
    }

    return value;
  }

  renderInput() {
    const {field, index} = this.props;

    if (this.state.inputType === 'textarea') {
      return (
        <Textarea className="details-panel__textarea"
                  value={this._prepareValue(field.value)}
                  validations="isJSON"
                  handleKeyDown={this._checkTabButton}
                  name={`userFields[${index}][value]`}
        />
      );
    } else {
      return (
        <Input className="details-panel__input"
               value={this._prepareValue(field.value)}
               handleKeyDown={this._checkTabButton}
               name={`userFields[${index}][value]`}
        />
      );
    }
  }

  render() {
    const {field, index} = this.props;

    return (
      <tr>
        <td>
          <Input className="details-panel__input details-key"
                 value={field.name}
                 name={`userFields[${index}][name]`}
                 validations={{isNotIn: ModelClass.forbiddenFields}}
          />
        </td>
        <td>
          <Select className="details-panel__input details-panel__select"
                  value={field.type || 'string'}
                  handleChange={this._changeFieldType}
                  name={`userFields[${index}][type]`}
                  options={userFieldsTypeOptions}
          />
        </td>
        <td>
          {this.renderInput()}
        </td>
        <td className="details-panel__table__cell details-panel__table__cell--empty">
          <i className="fa fa-remove details-panel__table__action" onClick={() => this.onRemove(field)}/>
        </td>
      </tr>
    );
  }
}
