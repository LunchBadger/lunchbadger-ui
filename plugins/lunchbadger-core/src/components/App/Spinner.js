import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './Spinner.scss';

export default class Spinner extends Component {
  // static propTypes = {
  //   loading: PropTypes.bool,
  //   grace: PropTypes.number
  // }
  //
  // static defaultProps = {
  //   grace: 500
  // };
  //
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     graceElapsed: false
  //   };
  //   this.timeout = null;
  // }
  //
  // componentDidMount() {
  //   this.start();
  // }
  //
  // componentWillUnmount() {
  //   if (this.timeout) {
  //     clearTimeout(this.timeout);
  //   }
  // }
  //
  // start() {
  //   this.timeout = setTimeout(() => {
  //     this.timeout = null;
  //     this.setState({graceElapsed: true});
  //   }, this.props.grace);
  // }
  //
  // componentWillReceiveProps(nextProps) {
  //   if (this.props.loading && !nextProps.loading) {
  //     if (this.timeout) {
  //       clearTimeout(this.timeout);
  //     }
  //     this.setState({graceElapsed: false});
  //   } else if (!this.props.loading && nextProps.loading) {
  //     this.start();
  //   }
  // }

  render() {
    if (this.props.loading) {
      return (
        <div className="spinner__overlay">
          <div className="spinner"></div>
        </div>
      );
    } else {
      return null;
    }
  }
}
