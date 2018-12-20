import React, {Component} from 'react';
import PropTypes from 'prop-types';

class IconSVG extends Component {
  render() {
    const {svg, className, styles} = this.props;
    return (
      <span
        className={className}
        dangerouslySetInnerHTML={{__html: svg}}
        style={styles}
      />
    );
  }
}

IconSVG.propTypes = {
  svg: PropTypes.string,
  className: PropTypes.string,
  styles: PropTypes.object,
};

IconSVG.defaultProps = {
  className: '',
  styles: {},
}

export default IconSVG;
