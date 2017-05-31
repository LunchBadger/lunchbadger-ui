import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {IconSVG} from '../../../';
import {iconUser} from '../../../../../../src/icons';
import './User.scss';

class User extends Component {
  static contextTypes = {
    loginManager: PropTypes.object
  }

  render() {
    return (
      <div className="User">
        <IconSVG className="User__icon" svg={iconUser} />
        {this.context.loginManager.user.profile.preferred_username}
      </div>
    );
  }
}

export default User;
