import React, {Component} from 'react';
import PropTypes from 'prop-types';

class IconSVG extends Component {
  render() {
    const {svg, className} = this.props;
    return (
      <span className={className} dangerouslySetInnerHTML={{__html: svg}} />
    );
  }
}

IconSVG.propTypes = {
  svg: PropTypes.string,
  className: PropTypes.string,
};

IconSVG.defaultProps = {
  className: '',
}

export default IconSVG;
