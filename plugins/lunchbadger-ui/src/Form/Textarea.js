import React from 'react';
import Input from './Input';

export default (props) => {
  console.log(2, props);
  return (
  <div>
    <Input
    {...props}
    multiLine
    rows={2}
    rowsMax={4}
    />
  </div>
)
};
