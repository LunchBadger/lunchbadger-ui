import {Component, PropTypes} from 'react';
import './Spinner.scss';

export default class Spinner extends Component {
  static propTypes = {
    loading: PropTypes.bool
  }

  render() {
    if (this.props.loading) {
      return (
        <div id="spinner__overlay">
          <div id="spinner"></div>
        </div>
      );
    } else {
      return null;
    }
  }
}
