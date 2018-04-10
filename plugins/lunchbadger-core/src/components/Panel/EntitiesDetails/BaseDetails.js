import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import {
  Form,
  EntityProperty,
  EntityValidationErrors,
  EntityActionButtons,
} from '../../../../../lunchbadger-ui/src';
import {
  changePanelStatus,
  setCurrentEditElement,
  setCurrentElement,
  setCurrentZoom,
} from '../../../reduxActions';
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

    setFlatModel = () => {
      if (this.refs && this.refs.form) {
        this.state.model = getFlatModel(this.refs.form.getModel());
        this.discardChanges();
      }
    }

    resetFormModel = () => this.refs.form && this.refs.form.reset(this.state.model);

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
    };

    getElementRef = () => this.element.wrappedInstance || this.element;

    update = async (props = this.refs.form.getModel()) => {
      const {store: {dispatch}} = this.context;
      const {entity} = this.props;
      const element = this.element.wrappedInstance || this.element;
      if (typeof element.tabProcessed === 'function') {
        if (element.tabProcessed(props)) return;
      }
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
      dispatch(setCurrentEditElement(null));
      this.closePopup();
      const updatedEntity = await dispatch(entity.update(model));
      dispatch(setCurrentElement(updatedEntity));
      setTimeout(this.setFlatModel);
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

    closePopup = () => this.context.store.dispatch(setCurrentZoom({...this.props.rect, close: true}));

    render() {
      const {validations} = this.state;
      return (
        <div className={cs('BaseDetails', 'details-panel__element', this.props.rect.tab)}>
          <Form
            name="panelForm"
            ref="form"
            onValid={this._handleValid}
            onInvalid={this._handleInvalid}
            onChange={this.checkPristine}
            onValidSubmit={this.update}
            className="BaseDetails__form"
          >
            <div className="BaseDetails__name">
              <EntityProperty
                name="name"
                value={this.props.entity.name}
              />
            </div>
            <div className="BaseDetails__content">
              {!validations.isValid && (
                <EntityValidationErrors
                  validations={validations}
                  basic
                />
              )}
              <ComposedComponent
                parent={this}
                ref={(ref) => this.element = ref}
                {...this.props}
                {...this.state}
              />
            </div>
            <div className="BaseDetails__buttons">
              <EntityActionButtons
                zoom
                onCancel={this.closePopup}
                onOk={this.update}
                okDisabled={false} //this.state.isPristine || !this.state.formValid}
              />
            </div>
          </Form>
        </div>
      )
    }
  }
}
