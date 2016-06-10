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
    const {conditionFrom, conditionTo, type} = this.state;
    const conditionUsers = conditionTo > 0 ? `${conditionFrom} - ${conditionTo}` : `${conditionFrom}+`;
    let condition;

    switch (type) {
      case 'percentage':
        condition = '>$0 total transactions / month';
        break;
      case 'throttle':
        condition = `${conditionUsers} total calls / hour`;
        break;
      case 'fixed':
      default:
        condition = `${conditionUsers} total calls / hour`
    }

    return condition;
  }

  renderCharge() {
    const {value, type} = this.state;
    let charge;

    switch (type) {
      case 'percentage':
        charge = `Charge ${numeral(value).format('0.[0000]')}% of total $`;
        break;
      case 'throttle':
        charge = `Throttle to ${numeral(value).format('0.[0]a')} per hour`;
        break;
      case 'fixed':
      default:
        charge = `Charge ${numeral(value).format('$0.[0000]')} per call`
    }

    return charge;
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
