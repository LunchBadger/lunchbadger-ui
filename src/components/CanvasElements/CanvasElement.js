import React, {Component, PropTypes} from 'react';
import './CanvasElement.scss';
import InlineEdit from 'react-edit-inline';

export default (ComposedComponent) => {
  return class CanvasElement extends Component {
    static propTypes = {
      icon: PropTypes.string.isRequired,
      entity: PropTypes.object.isRequired
    };

    constructor(props) {
      super(props);

      this.state = {
        name: this.props.entity.name
      };
    }

    validateName(text) {
      return (text.length > 0);
    }

    nameChanged(data) {
      if (typeof this.element.onNameUpdate === 'function') {
        this.element.onNameUpdate(data.name);
      }

      this.setState({...data});
    }

    render() {
      return (
        <div className="canvas-element">
          <div className="canvas-element__inside">
            <div className="canvas-element__icon">
              <i className={`fa ${this.props.icon}`}/>
            </div>
            <div className="canvas-element__title">
              <InlineEdit
                validate={this.validateName}
                activeClassName="editing"
                text={this.state.name}
                paramName="name"
                change={this.nameChanged.bind(this)}
              />
            </div>
          </div>
          <div className="canvas-element__extra">
            <ComposedComponent ref={(ref) => this.element = ref} {...this.props} />
          </div>
        </div>
      );
    }
  }
}
