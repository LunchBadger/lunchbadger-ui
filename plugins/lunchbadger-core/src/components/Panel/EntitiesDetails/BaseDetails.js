import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Form, EntityProperty} from '../../../../../lunchbadger-ui/src';
import CloseButton from '../CloseButton';
import SaveButton from '../SaveButton';
import {changePanelStatus, setCurrentEditElement, setCurrentElement} from '../../../reduxActions';
import './BaseDetails.scss';

export default (ComposedComponent) => {
  return class BaseDetails extends Component {
    static propTypes = {
      entity: PropTypes.object.isRequired
    };

    static contextTypes = {
      store: PropTypes.object,
    };

    constructor(props) {
      super(props);
      this.state = {
        isPristine: true,
        formValid: false,
      }
    }

    discardChanges = () => {
      const element = this.element;
      if (typeof element.discardChanges === 'function') {
        element.discardChanges();
      }
      this.refs.form.reset(this.props.entity.toJSON());
      this.forceUpdate();
    }

    update = async (props = this.refs.form.getModel()) => {
      const {store: {dispatch}} = this.context;
      const {entity} = this.props;
      const element = this.element.wrappedInstance || this.element;
      let model = props;
      if (typeof element.processModel === 'function') {
        model = element.processModel(model);
      }
      // const validations = dispatch(entity.validate(model)); //TODO
      // this.setState({validations});
      // if (!validations.isValid) return;
      this.setState({isPristine: true});
      dispatch(setCurrentEditElement(null));
      const updatedEntity = await dispatch(entity.update(model));
      dispatch(setCurrentElement(updatedEntity));
    }

    checkPristine = (_model, changed) => {
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

    _preventSubmit = (event) => {
      const keyCode = event.keyCode || event.which;
      if (keyCode === 13) {
        event.preventDefault();
        return false;
      }
    }

    componentWillUpdate(_nextProps, nextState) {
      if (this.state.isPristine !== nextState.isPristine) {
        const {store: {dispatch}} = this.context;
        dispatch(changePanelStatus(!nextState.isPristine, this.update, this.discardChanges));
      }
    }

    _handleValid = () => {
      this.setState({ formValid: true });
    }

    _handleInvalid = () => {
      this.setState({ formValid: false });
    }

    render() {
      return (
        <div className="details-panel__element">
          <Form
            name="panelForm"
            ref="form"
            onValid={this._handleValid}
            onInvalid={this._handleInvalid}
            onChange={this.checkPristine}
            onValidSubmit={this.update}
          >
            <CloseButton
              showConfirmation={!this.state.isPristine}
              onSave={this.update}
              onCancel={this.discardChanges}
            />
            <div className="panel__details">
              <EntityProperty
                title="Name"
                name="name"
                value={this.props.entity.name}
                placeholder=" "
                onChange={this._preventSubmit}
              />
            </div>
            <ComposedComponent
              parent={this}
              ref={(ref) => this.element = ref}
              {...this.props}
              {...this.state}
            />
            <SaveButton
              enabled={!this.state.isPristine && this.state.formValid}
              onSave={this.update}
            />
          </Form>
        </div>
      )
    }
  }
}
