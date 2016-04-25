import React, {Component, PropTypes} from 'react';
import ShowModalButton from '../ShowModalButton';

export default (ComposedComponent) => {
  return class BaseDetails extends Component {
    static propTypes = {
      entity: PropTypes.object.isRequired
    }

    constructor(props) {
      super(props);
      this.state = {
        name: props.entity.name
      }
    }

    componentWillReceiveProps(props) {
      this.setState({
        name: props.entity.name
      });
    }

    discardChanges() {
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
      return (
        <div className="details-panel__element">
          <ShowModalButton className="confirm-button__cancel" onSave={this.update.bind(this)} onCancel={this.discardChanges.bind(this)}/>
          <div className="details-panel__title">
                <span className="details-panel__label">Name</span>
          <input className="details-panel__input"
                 ref="nameInput"
                 value={this.state.name}
                 onChange={this.updateName.bind(this)}/>
          </div>
          <ComposedComponent parent={this} ref={(ref) => this.element = ref} {...this.props} {...this.state}/>
          <ShowModalButton className="confirm-button__accept" onSave={this.update.bind(this)} onCancel={this.discardChanges.bind(this)} />
        </div>
      )
    }
  }
}
