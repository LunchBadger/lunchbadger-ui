import React, {Component, PropTypes} from 'react';
import {DragSource} from 'react-dnd';
import classNames from 'classnames';
import './APIForecast.scss';
import removeAPIForecast from 'actions/API/remove';

const boxSource = {
  beginDrag(props) {
    const { entity, left, top } = props;
    return { entity, left, top };
  }
};

@DragSource('forecastElement', boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource()
}))
export default class APIForecast extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      expanded: false
    }
  }

  remove() {
    removeAPIForecast(this.props.entity.id);
  }

  toggleExpand() {
    this.setState({expanded: !this.state.expanded})
  }

  render() {
    const elementClass = classNames({
      expanded: this.state.expanded
    });
    const { hideSourceOnDrag, left, top, connectDragSource, isDragging} = this.props;
    if (isDragging && hideSourceOnDrag) {
      return null;
    }
    return connectDragSource(
      <div className={`api-forecast ${elementClass}`} style={{left, top}}>
        <div className="api-forecast__header">
          {this.props.entity.name}
          <ul className="api-forecast__header__nav">
            <li><a onClick={this.remove.bind(this)}><i className="fa fa-remove"></i></a></li>
            <li><a onClick={this.toggleExpand.bind(this)}><i className="fa fa-expand"></i></a></li>
          </ul>
        </div>
        <div className="api-forecast__content">
          Here comes the chart
        </div>
      </div>
    );
  }
}
