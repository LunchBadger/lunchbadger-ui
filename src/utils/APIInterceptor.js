import request from 'request';
import Bluebird from 'bluebird';
import _ from 'lodash';
import config from 'config';

class APIInterceptor {
  constructor() {
  }

  _getHeaders() {
    const headers = {};

    return headers;
  }

  _callAPI(method, url, options) {
    return new Bluebird((resolve, reject) => {
      request(_.extend({
        method: method,
        url: url,
        baseUrl: config.apiUrl,
        json: true,
        headers: _.extend(this._getHeaders(), {}),
        withCredentials: false
      }, options), (error, response, body) => {
        if (error) {
          return reject(error);
        }

        if (response.statusCode >= 400) {
          return reject(body.errors);
        }

        if (response.statusCode === 0) {
          return reject(new Error('General API Error!'));
        }

        const responseData = {
          response: response,
          body: body
        };

        return resolve(responseData);
      });
    });
  }

  get(url, options) {
    return this._callAPI('GET', url, options);
  }

  post(url, options) {
    return this._callAPI('POST', url, options);
  }

  patch(url, options) {
    return this._callAPI('PATCH', url, options);
  }

  put(url, options) {
    return this._callAPI('PUT', url, options);
  }

  delete(url, options) {
    return this._callAPI('DELETE', url, options);
  }
}

export default APIInterceptor;
