import React, {PureComponent} from 'react';
import {Input} from '../../../../../lunchbadger-ui/src';
import './ModelDetails.scss';

export default class ModelDefaultValue extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      invalid: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.type !== nextProps.type) {
      this.setState({invalid: false});
    }
  }

  handleBlur = ({target: {value}}) => {
    const {type} = this.props;
    if (['object', 'array', 'geopoint'].includes(type)) {
      let invalid = false;
      try {
        const parsed = JSON.parse(value);
        if (typeof parsed === 'string') {
          invalid = true;
        }
        if (!invalid && type === 'geopoint' && !(
          Array.isArray(parsed)
          &&
          parsed.length === 2
          &&
          Number.isFinite(parsed[0])
          &&
          Number.isFinite(parsed[1])
        )) {
          invalid = true;
        }
      } catch (e) {
        invalid = true;
      }
      this.setState({invalid});
    }
  };

  render() {
    const {name, value, type, inputType, textarea} = this.props;
    const {invalid} = this.state;
    let validations = undefined;
    if (textarea) {
      validations = 'isJSON';
    } else if (type === 'geopoint') {
      validations = 'isGeoPoint';
    }
    return (
      <div>
        <div className={textarea ? '' : 'TableInput'}>
          <Input
            name={name}
            value={value}
            underlineStyle={{bottom: 0}}
            fullWidth
            hideUnderline
            type={inputType}
            textarea={textarea}
            handleFocus={() => this.setState({invalid: false})}
            handleBlur={this.handleBlur}
            validations={validations}
          />
        </div>
        {invalid && (
          <div className="EntityProperty__error">
            This is not a valid {type}.
          </div>
        )}
      </div>
    )
  }
}
