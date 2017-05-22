import React from 'react';
import {Form} from 'formsy-react';

export default story => (
  <Form>
    {story()}
  </Form>
);
