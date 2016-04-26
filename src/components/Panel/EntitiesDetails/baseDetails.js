import React, {Component, PropTypes} from 'react';
import ShowModalButton from '../ShowModalButton';
import './BaseDetails.scss';
import classNames from 'classnames';

export default (ComposedComponent) => {
  return class BaseDetails extends Component {
    static propTypes = {
      entity: PropTypes.object.isRequired
    }

    constructor(props) {
      super(props);
      this.state = {
        name: props.entity.name,
        collapsedDetails: false,
        collapsedProperties: false
      }
    }

    componentWillReceiveProps(props) {
      const element = this.element.decoratedComponentInstance || this.element;
      this.setState({
        name: props.entity.name
      });
    }

    discardChanges() {
      const element = this.element.decoratedComponentInstance || this.element;

      if (typeof element.discardChanges === 'function') {
        element.discardChanges();
      }
      this.setState({
        name: this.props.entity.name
      });
    }

    update() {
      const element = this.element.decoratedComponentInstance || this.element;

      if (typeof element.update === 'function') {
        element.update();
      }
    }

    updateName(evt) {
      const element = this.element.decoratedComponentInstance || this.element;

      this.setState({name: evt.target.value});

      if (typeof element.updateName === 'function') {
        element.updateName(evt);
      }
    }

    /*handleEnterPress(event) {
      const keyCode = event.which || event.keyCode;

      // ENTER
      if (keyCode === 13) {
        this.update();
      }
    }*/

    render() {
      const detailsClass = classNames({
        'collapsed': this.state.collapsedDetails
      });
      const propertiesClass = classNames({
        'collapsed': this.state.collapsedProperties
      });
      return (
        <div className="details-panel__element">
          <ShowModalButton className="confirm-button__cancel" onSave={this.update.bind(this)} onCancel={this.discardChanges.bind(this)}/>
          <div className="details-panel__details">
            <h2 className={`${detailsClass} details-panel__title`} onClick={() => {this.setState({collapsedDetails: !this.state.collapsedDetails});}}>
              <i className="fa fa-caret-down"></i>
              Details
            </h2>
            <div className={detailsClass}>
              <div className="details-panel__fieldset">
                <span className="details-panel__label">Name</span>
                <input className="details-panel__input"
                     ref="nameInput"
                     value={this.state.name}
                     onChange={this.updateName.bind(this)}/>
              </div>
            </div>
          </div>
          <div className="details-panel__properties">
            <h2 className={`${propertiesClass} details-panel__title`} onClick={() => {this.setState({collapsedProperties: !this.state.collapsedProperties});}}>
              <i className="fa fa-caret-down"></i>
              Properties
            </h2>
            <div className={propertiesClass}>
              <ComposedComponent parent={this} ref={(ref) => this.element = ref} {...this.props} {...this.state}/>
            </div>
          </div>
          <ShowModalButton className="confirm-button__accept" onSave={this.update.bind(this)} onCancel={this.discardChanges.bind(this)} />
        </div>
      )
    }
  }
}
