import React, {Component, PropTypes} from 'react';
import './CanvasElement.scss';
import {findDOMNode} from 'react-dom';
import classNames from 'classnames';
import addElement from 'actions/addElement';

export default (ComposedComponent) => {
  return class CanvasElement extends Component {
    static propTypes = {
      icon: PropTypes.string.isRequired,
      entity: PropTypes.object.isRequired
    };

    constructor(props) {
      super(props);

      this.state = {
        name: props.entity.name,
        editable: true,
        expanded: true
      };
    }

    componentDidMount() {
      this.triggerElementAutofocus();

      setTimeout(() => addElement(this.refs.element));
    }

    update() {
      if (typeof this.element.update === 'function') {
        this.element.update();
      }

      this.setState({
        editable: false,
        expanded: false
      });
    }

    updateName(evt) {
      this.setState({name: evt.target.value});
    }

    handleAdd(evt) {
      if (typeof this.element.handleAdd === 'function') {
        this.element.handleAdd(evt);
      }
    }

    triggerElementAutofocus() {
      const nameInput = findDOMNode(this.refs.nameInput);
      const selectAllOnce = () => {
        nameInput.select();
        nameInput.removeEventListener('focus', selectAllOnce);
      };

      nameInput.addEventListener('focus', selectAllOnce);
      nameInput.focus();
    }

    handleEnterPress(event) {
      const keyCode = event.which || event.keyCode;

      // ENTER
      if (keyCode === 13) {
        this.update();
      }
    }

    render() {
      const elementClass = classNames({
        'canvas-element': true,
        editable: this.state.editable,
        expanded: this.state.expanded
      });
      return (
        <div ref="element" className={elementClass}>
          <div className="canvas-element__inside">
            <div className="canvas-element__icon" onClick={() => this.setState({expanded: !this.state.expanded})}>
              <i className={`fa ${this.props.icon}`}/>
            </div>
            <div className="canvas-element__title">
              <span className="canvas-element__name hide-while-edit"
                    onDoubleClick={() => this.setState({editable: true})}>{this.props.entity.name}</span>
              <input className="canvas-element__input editable-only"
                     ref="nameInput"
                     value={this.state.name}
                     onKeyPress={this.handleEnterPress.bind(this)}
                     onChange={this.updateName.bind(this)}/>
            </div>
          </div>
          <div className="canvas-element__extra">
            <ComposedComponent ref={(ref) => this.element = ref} {...this.props} {...this.state}/>
          </div>
          <div className="canvas-element__actions editable-only">
            <button className="canvas-element__button" onClick={() => this.update()}>OK</button>
          </div>
        </div>
      );
    }
  }
}
