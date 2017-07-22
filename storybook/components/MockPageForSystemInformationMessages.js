import React from 'react';
import {connect} from 'react-redux';
import {addSystemInformationMessage} from '../../plugins/lunchbadger-ui/src/actions';
import {lorem} from '../constants';
import '../styles.scss';

const MockPageForSystemInformationMessages = ({children, push}) => (
  <div>
    {children}
    <button onClick={push} className="story__button">
      Mock new <b>SystemInformationMessage</b>
    </button>
  </div>
);

const mapDispatchToProps = dispatch => ({
  push: () => dispatch(addSystemInformationMessage({
    message: lorem(),
    type: 'success',
  })),
});

export default connect(null, mapDispatchToProps)(MockPageForSystemInformationMessages);
