import React, {Component} from 'react';
import cs from 'classnames';
import AddAPI from '../../actions/CanvasElements/API/add';
import {entityIcons, IconSVG} from '../../../../lunchbadger-ui/src';

const Tool = LunchBadgerCore.components.Tool;

class API extends Component {
  render() {
    const isSelected = (this.props.currentEditElement || {name: ''}).name === 'API';
    return (
      <div className={cs('api', 'tool', {['tool--selected']: isSelected})} onClick={() => AddAPI('API')}>
        <IconSVG className="tool__svg" svg={entityIcons.API} />
        <span className="tool__tooltip">API</span>
      </div>
    );
  }
}

export default Tool(API);
