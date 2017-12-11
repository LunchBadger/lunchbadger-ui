import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Rnd from 'react-rnd';
import {IconSVG, entityIcons} from '../';
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
    const {x, y, width, height} = props.rect;
    this.state = {
      x: Math.round(x),
      y: Math.round(y),
      width: Math.round(width),
      height: Math.round(height),
    };
  }

  componentDidMount() {
    const {innerWidth, innerHeight} = window;
    const x = 100;
    const y = 100;
    const width = innerWidth - 2 * x;
    const height = innerHeight - 2 * y;
    const newState = {
      x,
      y,
      width,
      height,
    };
    setTimeout(() => {
      this.setState(newState);
    }, 0);
  }

  handleDragStop = (_, {x, y}) => this.setState({x, y});

  handleResize = (_, __, {offsetWidth: width, offsetHeight: height}, ___, position) => this.setState({width, height, ...position});

  render() {
    const {
      children,
      name,
      type,
    } = this.props;
    const {x, y, width, height} = this.state;
    return (
      <Rnd
        ref={r => this.rndRef = r}
        className="RnD"
        minWidth={250}
        minHeight={145}
        maxWidth="100%"
        maxHeight="100%"
        z={1005}
        bounds=".canvas__zoom-area"
        dragHandleClassName=".RnD__header"
        size={{width, height}}
        position={{x, y}}
        onDragStop={this.handleDragStop}
        onResize={this.handleResize}
      >
        <div className="RnD__wrapper">
          <div className="RnD__header">
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
      </Rnd>
    );
  }
}
