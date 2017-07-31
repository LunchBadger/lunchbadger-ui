import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import './Spinner.scss';

class Spinner extends Component {
  static propTypes = {
    visible: PropTypes.bool,
  }

  render() {
    if (!this.props.visible) return null;
    return (
      <div className="spinner__overlay">
        <div className="spinner"></div>
      </div>
    );
  }
}

const selector = createSelector(
  (_, props) => props.force,
  state => state.loadingProject,
  (force, loading) => ({visible: force || loading}),
);

export default connect(selector)(Spinner);
