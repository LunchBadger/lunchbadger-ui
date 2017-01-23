import React, {Component, PropTypes} from 'react';
import './BaseDetails.scss';
import {Form} from 'formsy-react';
import InputField from './InputField';
import CloseButton from '../CloseButton';
import SaveButton from '../SaveButton';
import changePanelStatus from '../../../actions/AppState/changePanelStatus';

export default (ComposedComponent) => {
  return class BaseDetails extends Component {
    static propTypes = {
      entity: PropTypes.object.isRequired
    };

    constructor(props) {
      super(props);
      this.state = {
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

    checkPristine(_model, changed) {
      if (typeof changed === 'undefined') {
        changed = this.refs.form.isChanged();
      }

      if (!this.element) {
        return;
      }

      if (this.element.state && this.element.state.changed) {
        this.setState({isPristine: false});
      } else {
        this.setState({isPristine: !changed});
      }
    }

    _preventSubmit(event) {
      const keyCode = event.keyCode || event.which;

      if (keyCode === 13) {
        event.preventDefault();
        return false;
      }
    }

    componentWillUpdate(_nextProps, nextState) {
      if (this.state.isPristine !== nextState.isPristine) {
        changePanelStatus(!nextState.isPristine, this.update.bind(this), this.discardChanges.bind(this));
      }
    }

    render() {
      return (
        <div className="details-panel__element">
          <Form name="panelForm"
                ref="form"
                onChange={this.checkPristine.bind(this)}
                onValidSubmit={this.update.bind(this)}>
            <CloseButton showConfirmation={!this.state.isPristine}
                         onSave={this.update.bind(this)}
                         onCancel={this.discardChanges.bind(this)}/>

            <InputField label="Name"
                        propertyName="name"
                        handleKeyPress={this._preventSubmit.bind(this)}
                        entity={this.props.entity} />

            <ComposedComponent parent={this} ref={(ref) => this.element = ref} {...this.props} {...this.state}/>

            <SaveButton enabled={!this.state.isPristine}
                        onSave={this.update.bind(this)}/>
          </Form>
        </div>
      )
    }
  }
}
