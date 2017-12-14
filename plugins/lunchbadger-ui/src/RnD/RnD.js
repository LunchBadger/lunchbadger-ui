import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import Rnd from 'react-rnd';
import {IconSVG, entityIcons, Toolbox} from '../';
import './RnD.scss';

export default class RnD extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    rect: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  };

  static contextTypes = {
    store: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {...props.rect, transitioning: true, opacity: 0};
  }

  componentDidMount() {
    const {innerWidth, innerHeight} = window;
    const x = 100;
    const y = 20;
    const width = innerWidth - 2 * x;
    const height = innerHeight - 2 * y;
    const state = {
      x,
      y,
      width,
      height,
      max: false,
      opacity: 1,
    };
    this.transitions(state);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.rect.close) {
      this.transitions({...nextProps.rect, opacity: 0}, this.props.onClose);
    }
  }

  transitions = (state, cb) => {
    setTimeout(() => {
      this.setState({transitioning: true}, () => {
        setTimeout(() => {
          this.setState(state, () => {
            setTimeout(() => this.setState({transitioning: false}, cb), 450);
          });
        });
      });
    });
  };

  handleDoubleClick = () => {
    if (this.state.max) {
      this.setState(this.prevState);
    } else {
      this.prevState = {...this.state};
      const {innerWidth, innerHeight} = window;
      this.setState({
        x: 0,
        y: 20,
        width: innerWidth,
        height: innerHeight - 20,
        max: true,
      });
    }
  };

  handleDragStop = (_, {x, y}) => this.setState({x, y});

  handleResize = (_, direction, {offsetWidth: width, offsetHeight: height}, ___, position) => {
    const state = {width, ...position};
    if (direction !== 'left' && direction !== 'right') {
      Object.assign(state, {height});
    }
    this.setState(state);
  }

  render() {
    const {
      children,
      name,
      type,
      toolbox,
    } = this.props;
    const {x, y, width, height, transitioning, opacity, close} = this.state;
    const size = {width, height};
    const position = {x, y};
    return (
      <Rnd
        ref={r => this.rndRef = r}
        className={cs('RnD', {transitioning, close})}
        minWidth={250}
        minHeight={145}
        maxWidth="100%"
        maxHeight="100%"
        z={1005}
        bounds=".canvas__zoom-area"
        dragHandleClassName=".RnD__header"
        size={size}
        position={position}
        onDragStop={this.handleDragStop}
        onResize={this.handleResize}
        style={{opacity}}
      >
        {!transitioning && (
          <div
            className="RnD__wrapper"
            style={size}
          >
            <Toolbox config={toolbox} zoom />
            <div className="RnD__header" onDoubleClick={this.handleDoubleClick}>
              <div className="RnD__header__icon">
                <IconSVG svg={entityIcons[type]} />
              </div>
              <div className="RnD__header__name">
                {name}
              </div>
            </div>
            <div className="RnD__content">
              {children}
            </div>
          </div>
        )}
      </Rnd>
    );
  }
}
