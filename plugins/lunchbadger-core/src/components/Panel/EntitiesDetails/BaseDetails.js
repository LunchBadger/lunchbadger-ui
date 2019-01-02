import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {findDOMNode} from 'react-dom';
import cs from 'classnames';
import _ from 'lodash';
import {
  Form,
  EntityProperty,
  EntityValidationErrors,
  EntityActionButtons,
  CopyOnHover,
  scrollToElement,
  GAEvent,
  ContextualInformationMessage,
  labels,
} from '../../../ui';
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
        isOkEnabled: false,
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

    handleNameChange = event => {
      const element = this.getElementRef();
      if (typeof element.updateName === 'function') {
        element.updateName(event);
      }
    };

    update = async (props = this.refs.form.getModel()) => {
      const {store: {dispatch}} = this.context;
      const {entity} = this.props;
      const element = this.element.wrappedInstance || this.element;
      if (typeof element.tabProcessed === 'function') {
        if (element.tabProcessed(props)) return;
      }
      let model = _.cloneDeep(props);
      if (typeof element.processModel === 'function') {
        model = element.processModel(model);
      }
      const validations = dispatch(entity.validate(model));
      this.setState({validations}, () => {
        if (!validations.isValid) {
          scrollToElement(findDOMNode(this.validationErrorsRef));
        }
      });
      if (!validations.isValid) return;
      if (typeof element.postProcessModel === 'function') {
        element.postProcessModel(props);
      }
      dispatch(setCurrentEditElement(null, true));
      this.closePopup(null, false);
      dispatch(setCurrentElement(entity));
      await dispatch(entity.update(model));
      setTimeout(this.setFlatModel);
      GAEvent('Zoom Window', 'Saved And Closed', this.props.entity.gaType);
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

    handleFormKeyPress = (event) => {
      if ((event.which === 13 || event.keyCode === 13) && event.target.type !== 'textarea') {
        event.preventDefault();
        event.target.blur && event.target.blur();
      }
    };

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

    closePopup = (event, silent = false) => {
      const element = this.element.wrappedInstance || this.element;
      if (typeof element.tabCancelled === 'function') {
        if (element.tabCancelled()) return;
      }
      this.discardChanges();
      const {dispatch} = this.context.store;
      dispatch(setCurrentZoom({...this.props.rect, close: true}));
      setTimeout(() => dispatch(setCurrentZoom(undefined, false, silent)), 1000);
      if (event) {
        GAEvent('Zoom Window', 'Closed', this.props.entity.gaType);
      }
    }

    setOkEnabled = isOkEnabled => this.setState({isOkEnabled});

    render() {
      const {entity, rect, onUnlock} = this.props;
      const {id, isCanvasEditDisabled, name, locked} = entity;
      const {validations, isPristine, formValid, isOkEnabled} = this.state;
      const isAutogenerated = id.startsWith('autogenerated');
      const underlineStyle = {
        borderColor: '#8dbde2',
      }
      const okDisabled = (isPristine || !formValid) && !isOkEnabled;
      const editDisabled = locked || id.startsWith('autogenerated');
      return (
        <div className={cs(
          'BaseDetails',
          'details-panel__element',
          rect.tab,
          {
            isCanvasEditDisabled,
            locked: editDisabled,
            listing: !isOkEnabled,
          },
        )}>
          <Form
            name="panelForm"
            ref="form"
            onValid={this._handleValid}
            onInvalid={this._handleInvalid}
            onChange={this.checkPristine}
            onValidSubmit={this.update}
            onKeyPress={this.handleFormKeyPress}
            className="BaseDetails__form"
          >
            <div className="BaseDetails__name">
              <EntityProperty
                name="name"
                value={name}
                underlineStyle={underlineStyle}
                invalidUnderlineColor="#FFF"
                fake={isCanvasEditDisabled || isAutogenerated}
                onChange={this.handleNameChange}
              />
              <div className="BaseDetails__id">
                Entity ID:
                <CopyOnHover copy={id}>{id}</CopyOnHover>
              </div>
              {locked && (
                <ContextualInformationMessage
                  tooltip={labels.LOCKED_MESSAGE}
                  direction="bottom"
                >
                  <i className="locked fa fa-lock" />
                </ContextualInformationMessage>
              )}
            </div>
            <div className="BaseDetails__content">
              {!validations.isValid && (
                <EntityValidationErrors
                  ref={r => this.validationErrorsRef = r}
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
                onOk={locked ? onUnlock : this.update}
                okLabel={locked ? 'UNLOCK' : 'OK'}
                okDisabled={locked ? false : okDisabled}
                submit={!locked}
              />
            </div>
          </Form>
        </div>
      )
    }
  }
}
