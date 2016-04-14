import React, {Component, PropTypes} from 'react';
import './CanvasElement.scss';
import InlineEdit from 'react-edit-inline';
import {findDOMNode} from 'react-dom';

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

    componentDidMount() {
      if (!this.props.entity.ports) {
        return;
      }

      this.props.entity.ports.forEach((port) => {
        const portDOM = findDOMNode(port.DOMReference);

        if (port.portType === 'in') {
          this.props.paper.makeTarget(portDOM, {
            maxConnections: -1,
            endpoint: 'Blank',
            paintStyle: {
              fillStyle: '#ffffff'
            },
            dropOptions: {
              hoverClass: 'hover',
              activeClass: 'active'
            },
            anchor: [0.6, 0.1, 0, 0],
            scope: port.portGroup
          });
        } else {
          this.props.paper.makeSource(portDOM, {
            maxConnections: -1,
            endpoint: 'Blank',
            paintStyle: {
              fillStyle: '#ffffff'
            },
            connectorStyle: {
              lineWidth: 6,
              strokeStyle: '#ffffff',
              joinstyle: 'round',
              outlineColor: '#c1c1c1',
              outlineWidth: 2
            },
            connectorHoverStyle: {
              outlineColor: '#919191'
            },
            anchor: [0.5, 0, 0.5, 0.5],
            scope: port.portGroup
          });
        }
      });
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
