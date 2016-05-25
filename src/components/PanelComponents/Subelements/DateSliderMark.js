import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

export default class DateSliderMark extends Component {
  static propTypes = {
    month: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    position: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      selected: false
    }
  }

  getWidth() {
    return 100 / this.props.count;
  }

  getPosition() {
    return 100 / (this.props.count - 1) * this.props.position;
  }

  toggleSelected() {
    this.setState({
      selected: !this.state.selected
    })
  }

  render() {
    const elementClass = classNames({
      selected: this.state.selected
    });
    const style = {
      width: this.getWidth() + '%',
      left: this.getPosition() + '%'
    };
    return (
      <div onClick={this.toggleSelected.bind(this)}
           className={`date-slider__mark ${elementClass}`}
           style={style}>
        {this.props.month}
      </div>
    )
  }
}
