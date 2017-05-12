import React from 'react';
import {Title} from '../';
import './Color.scss';

const lorem = 'The quick brown fox jumps over the lazy dog';
const fontSizes = [22, 18, 15, 13];

export default ({value, name}) => (
  <div className="Color">
    <Title>{name.toUpperCase()} - {value}</Title>
    <div className="Color__box" style={{color: value}}>
      <div className="Color__box__color" style={{backgroundColor: value}}/>
      <div className="Color__box__texts">
        {fontSizes.map(fontSize => <div key={fontSize} style={{fontSize}}>{lorem}</div>)}
      </div>
    </div>
  </div>
);
