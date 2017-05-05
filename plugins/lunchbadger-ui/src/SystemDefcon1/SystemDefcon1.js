import React from 'react';
import './SystemDefcon1.scss';

const SystemDefcon1 = ({error}) => (
  <div className="SystemDefcon1">
    <div className="SystemDefcon1__box">
      <div className="SystemDefcon1__box__title">
        Server Failure
      </div>
      <div className="SystemDefcon1__box__content">
        The system can&#8217;t connect to the server.
        Please check that the server is running and reload the page.
        <div className="SystemDefcon1__box__content--error">
          ERROR: {error}
        </div>
      </div>
      <div className="SystemDefcon1__box__content">
        <button>OK</button>
      </div>
    </div>
  </div>
);

export default SystemDefcon1;
