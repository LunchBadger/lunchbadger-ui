import React, {Component} from 'react';
import path from './dashed-path-grey.svg';
import './PlanInstructions.scss';

export default class PlanInstructions extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="plan-instructions">
        <img src={path} className="plan-instructions__image"/>
        <p className="plan-instructions__paragraph">
          Drag icons over each other to<br />upgrade or downgrade users
        </p>
      </div>
    );
  }
}
