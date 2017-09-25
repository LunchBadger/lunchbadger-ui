import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Form, EntityProperty, EntityValidationErrors} from '../../../../../lunchbadger-ui/src';
import CloseButton from '../CloseButton';
import SaveButton from '../SaveButton';
import {changePanelStatus, setCurrentEditElement, setCurrentElement} from '../../../reduxActions';
import getFlatModel from '../../../utils/getFlatModel';
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
        validations: {
          isValid: true,
          data: {}
        },
      }
    }

    componentDidMount() {
      this.setFlatModel();
    }

    componentWillUpdate(_nextProps, nextState) {
      if (this.state.isPristine !== nextState.isPristine) {
        const {store: {dispatch}} = this.context;
        dispatch(changePanelStatus(!nextState.isPristine, this.update, this.discardChanges));
      }
    }

    componentDidUpdate(prevProps) {
      const {id} = this.props.entity;
      if (prevProps.entity.id !== id) {
        setTimeout(this.setFlatModel);
      }
    }

    setFlatModel = () => this.state.model = getFlatModel(this.refs.form.getModel());

    resetFormModel = () => this.refs.form.reset(this.state.model);

    discardChanges = () => {
      const element = this.element.wrappedInstance || this.element;
      if (typeof element.discardChanges === 'function') {
        element.discardChanges(() => setTimeout(this.resetFormModel));
      } else {
        this.resetFormModel();
      }
      this.setState({
        isPristine: true,
        validations: {isValid: true, data: {}},
      });
    }

    update = async (props = this.refs.form.getModel()) => {
      const {store: {dispatch}} = this.context;
      const {entity} = this.props;
      const element = this.element.wrappedInstance || this.element;
      let model = props;
      if (typeof element.processModel === 'function') {
        model = element.processModel(model);
      }
      const validations = dispatch(entity.validate(model));
      this.setState({validations}, () => {
        if (!validations.isValid) {
          document.querySelector('.DetailsPanel').scrollTop = 0;
        }
      });
      if (!validations.isValid) return;
      this.setState({isPristine: true});
      dispatch(setCurrentEditElement(null));
      const updatedEntity = await dispatch(entity.update(model));
      dispatch(setCurrentElement(updatedEntity));
      setTimeout(() => {
        if (this.refs && this.refs.form) {
          this.state.model = getFlatModel(this.refs.form.getModel());
        }
      });
    }

    checkPristine = (_model, changed) => {
      if (typeof changed === 'undefined') {
        changed = this.refs.form.isChanged();
      }
      if (!this.element) return;
      const element = this.element.wrappedInstance || this.element;
      let isPristine;
      if (element.state && element.state.changed) {
        isPristine = false;
      } else {
        isPristine = !changed;
      }
      if (this.state.isPristine !== isPristine) {
        this.setState({isPristine});
      }
    }

    _preventSubmit = (event) => {
      const keyCode = event.keyCode || event.which;
      if (keyCode === 13) {
        event.preventDefault();
        return false;
      }
    }

    _handleValid = () => {
      if (!this.state.formValid) {
        this.setState({formValid: true});
      }
    }

    _handleInvalid = () => {
      if (this.state.formValid) {
        this.setState({formValid: false});
      }
    }

    render() {
      const {validations} = this.state;
      return (
        <div className="details-panel__element">
          {!validations.isValid && (
            <EntityValidationErrors
              validations={validations}
              basic
            />
          )}
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
            <div className="panel__details panel__details--name">
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
