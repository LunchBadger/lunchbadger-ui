import React, {Component, PropTypes} from 'react';
import removeTier from 'actions/APIForecast/removeTier';
import saveTier from 'actions/APIForecast/saveTier';
import './Tier.scss';
import numeral from 'numeral';
import moment from 'moment';
import classNames from 'classnames';

const TwoOptionModal = LunchBadgerCore.components.TwoOptionModal;

export default class Tier extends Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    tier: PropTypes.object.isRequired,
    date: PropTypes.string.isRequired,
    detail: PropTypes.object.isRequired,
    plan: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    const {detail} = props;

    this.state = {
      type: detail.type,
      conditionFrom: detail.conditionFrom,
      conditionTo: detail.conditionTo,
      value: detail.value,
      editing: false,
      isShowingModal: false
    }
  }

  componentWillMount() {
    if (this.props.detail.new) {
      this.setState({editing: true});
    }
  }

  renderCondition() {
    if (this.state.editing) {
      return this.editCondition();
    }

    return this.showCondition();
  }

  showCondition() {
    const {conditionFrom, conditionTo, type} = this.state;
    const conditionFromChanged = classNames({
      'tier__detail-changed': this.props.detail.conditionFrom !== this.props.tier.conditionFrom
    });
    const conditionToChanged = classNames({
      'tier__detail-changed': this.props.detail.conditionTo !== this.props.tier.conditionTo
    });
    const typeChangedClass = classNames({
      'tier__detail-changed': this.props.detail.type !== this.props.tier.type
    });

    switch (type) {
      case 'percentage':

        return (
          <div>
            <span className={typeChangedClass}>$0 total transactions / month</span>
          </div>
        );
      case 'throttle':
      case 'fixed':
      default:

        return (
          <div>
            {
              conditionTo > 0 && (
                <span>
                  <span className={conditionFromChanged}>{conditionFrom}</span>
                  {' - '}
                  <span className={conditionToChanged}>{conditionTo}</span>
                </span>
              )
            }

            {
              conditionTo < 1 && (
                <span className={conditionFromChanged}>{conditionFrom}+</span>
              )
            }

            {' '}
            <span className={typeChangedClass}>total calls / hour</span>
          </div>
        );
    }
  }

  editCondition() {
    const {conditionFrom, conditionTo, type} = this.state;

    return (
      <div className="tier__condition__edit">
        {
          type === 'percentage' && (
            '>$0 total transactions / month'
          )
        }

        {
          type !== 'percentage' && (
            <div>
              <input type="text"
                     className="tier__condition__input"
                     placeholder="Condition from"
                     name="conditionFrom"
                     value={conditionFrom}
                     onChange={(event) => this.setState({conditionFrom: parseInt(event.target.value, 10)})}/>
              <span className="tier__condition__between">-</span>
              <input type="text"
                     className="tier__condition__input"
                     placeholder="Condition to"
                     name="conditionTo"
                     value={conditionTo}
                     onChange={(event) => this.setState({conditionTo: parseInt(event.target.value, 10) || 0})}/>
              {' '} total calls / hour
            </div>
          )
        }
      </div>
    );
  }

  renderCharge() {
    if (this.state.editing) {
      return this.editCharge();
    }

    return this.showCharge();
  }

  showCharge() {
    const {value, type} = this.state;
    const valueChangedClass = classNames({
      'tier__detail-changed': this.props.detail.value !== this.props.tier.value
    });
    const typeChangedClass = classNames({
      'tier__detail-changed': this.props.detail.type !== this.props.tier.type
    });

    switch (type) {
      case 'percentage':

        return (
          <div>
            <span className={typeChangedClass}>Charge</span>{' '}
            <span className={valueChangedClass}>{numeral(value).format('0.[0000]')}%</span>{' '}
            <span className={typeChangedClass}>of total $</span>
          </div>
        );
      case 'throttle':

        return (
          <div>
            <span className={typeChangedClass}>Throttle to</span>{' '}
            <span className={valueChangedClass}>{numeral(value).format('0.[0]a')}</span>{' '}
            <span className={typeChangedClass}>per hour</span>
          </div>
        );
      case 'fixed':
      default:

        return (
          <div>
            <span className={typeChangedClass}>Charge</span>{' '}
            <span className={valueChangedClass}>{numeral(value).format('$0.[0000]')}</span>{' '}
            <span className={typeChangedClass}>per call</span>
          </div>
        );
    }
  }

  editCharge() {
    const {value, type} = this.state;

    return (
      <div className="tier__charge__edit">
        <select name="type"
                className="tier__charge__select"
                value={type}
                onChange={(event) => this.setState({type: event.target.value})}>
          <option value="percentage">Charge %</option>
          <option value="throttle">Throttle</option>
          <option value="fixed">Charge $</option>
        </select>

        {' '}

        {
          type === 'throttle' && (
            <div className="tier__charge__value">
              to <input type="text"
                        name="value"
                        value={value}
                        className="tier__charge__input"
                        onChange={(event) => this.setState({value: event.target.value})}/> per hour
            </div>
          )
        }

        {
          type === 'percentage' && (
            <div className="tier__charge__value">
              <input type="text"
                     name="value"
                     value={value}
                     className="tier__charge__input"
                     onChange={(event) => this.setState({value: event.target.value})}/> of total $
            </div>
          )
        }

        {
          type === 'fixed' && (
            <div className="tier__charge__value">
              <input type="text"
                     name="value"
                     value={value}
                     className="tier__charge__input"
                     onChange={(event) => this.setState({value: event.target.value})}/> per call
            </div>
          )
        }
      </div>
    )
  }

  renderActions() {
    return (
      <div>
        {
          this.state.editing && (
            <a className="tier__action__save" onClick={this._handleSave.bind(this)}>
              <i className="fa fa-floppy-o"/>
            </a>
          )
        }

        {
          !this.state.editing && (
            <a className="tier__action__edit" onClick={this._handleEdit.bind(this)}>
              <i className="fa fa-pencil"/>
            </a>
          )
        }

        <a className="tier__action__remove" onClick={() => this.setState({isShowingModal: true})}>
          <i className="fa fa-times"/>
        </a>
      </div>
    );
  }

  _handleSave() {
    saveTier(this.props.plan, this.props.tier, this.props.date, {
      type: this.state.type,
      conditionFrom: this.state.conditionFrom,
      conditionTo: this.state.conditionTo,
      value: this.state.value
    });

    this.setState({editing: false});
  }

  _handleEdit() {
    this.setState({editing: true});
  }

  _handleRemove() {
    removeTier(this.props.plan, this.props.tier, this.props.date);
  }

  render() {
    const date = moment(this.props.date, 'M/YYYY');
    const tierRowClass = classNames({
      'tier__row': true,
      'tier__row--new': this.props.detail.new
    });

    return (
      <tr className={tierRowClass}>
        <td className="tier__cell">
          Tier {this.props.index}
        </td>
        <td className="tier__cell">
          {this.renderCondition()}
        </td>
        <td className="tier__cell">
          {this.renderCharge()}
        </td>
        <td className="tier__action">
          {
            date.isAfter(moment(), 'month') && this.renderActions()
          }

          {
            this.state.isShowingModal &&
            <TwoOptionModal onClose={() => this.setState({isShowingModal: false})}
                            onSave={this._handleRemove.bind(this)}
                            onCancel={() => this.setState({isShowingModal: false})}
                            title="Remove tier"
                            confirmText="Remove"
                            discardText="Cancel">
              <span>Do you really want to remove that tier?</span>
            </TwoOptionModal>
          }
        </td>
      </tr>
    )
  }
}
