import React, {Component, PropTypes} from 'react';
import './BaseDetails.scss';
import classNames from 'classnames';
import {Form} from 'formsy-react';
import Input from 'components/Generics/Form/Input';
import CloseButton from '../CloseButton';
import SaveButton from '../SaveButton';

export default (ComposedComponent) => {
  return class BaseDetails extends Component {
    static propTypes = {
      entity: PropTypes.object.isRequired
    };

    constructor(props) {
      super(props);
      this.state = {
        collapsedDetails: false,
        collapsedProperties: false,
        isPristine: true
      }
    }

    discardChanges() {
      const element = this.element;

      if (typeof element.discardChanges === 'function') {
        element.discardChanges();
      }

      this.refs.form.reset();
      this.forceUpdate();
    }

    update(model) {
      const element = this.element;

      if (!model) {
        model = this.refs.form.getModel();
      }

      if (typeof element.update === 'function') {
        element.update(model);
      }

      this.setState({isPristine: true});
    }

    checkPristine(model, changed) {
      this.setState({isPristine: !changed});
    }

    _preventSubmit(event) {
      const keyCode = event.keyCode || event.which;

      if (keyCode === 13) {
        event.preventDefault();
        return false;
      }
    }

    render() {
      const detailsClass = classNames({
        'collapsed': this.state.collapsedDetails
      });
      const propertiesClass = classNames({
        'collapsed': this.state.collapsedProperties
      });

      return (
        <div className="details-panel__element">
          <Form name="panelForm"
                ref="form"
                onChange={this.checkPristine.bind(this)}
                onValidSubmit={this.update.bind(this)}>
            <CloseButton showConfirmation={!this.state.isPristine}
                         onSave={this.update.bind(this)}
                         onCancel={this.discardChanges.bind(this)}/>
            <div className="details-panel__details">
              <h2 className={`${detailsClass} details-panel__title`}
                  onClick={() => {this.setState({collapsedDetails: !this.state.collapsedDetails});}}>
                <i className="fa fa-caret-down"/>
                Details
              </h2>
              <div className={detailsClass}>
                <div className="details-panel__fieldset">
                  <span className="details-panel__label">Name</span>
                  <Input className="details-panel__input"
                         handleKeyPress={this._preventSubmit.bind(this)}
                         value={this.props.entity.name}
                         name="name"/>
                </div>
              </div>
            </div>
            <div className="details-panel__properties">
              <h2 className={`${propertiesClass} details-panel__title`}
                  onClick={() => {this.setState({collapsedProperties: !this.state.collapsedProperties});}}>
                <i className="fa fa-caret-down"/>
                Properties
              </h2>
              <div className={propertiesClass}>
                <ComposedComponent parent={this} ref={(ref) => this.element = ref} {...this.props} {...this.state}/>
              </div>
            </div>
            <SaveButton showConfirmation={!this.state.isPristine}
                        onSave={this.update.bind(this)}
                        onCancel={this.discardChanges.bind(this)}/>
          </Form>
        </div>
      )
    }
  }
}
