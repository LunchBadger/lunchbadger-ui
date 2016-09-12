import request from 'request';
import Bluebird from 'bluebird';
import _ from 'lodash';

class APIInterceptor {
  constructor(url, idToken) {
    this.url = url;
    this.idToken = idToken;
  }

  _getHeaders() {
    const headers = {};
    if (this.idToken) {
      headers['Authorization'] = `JWT ${this.idToken}`;
    }
    return headers;
  }

  _callAPI(method, url, options) {
    return new Bluebird((resolve, reject) => {
      const req = _.merge({
        method: method,
        url: url,
        baseUrl: this.url,
        json: true,
        headers: _.extend(this._getHeaders(), {})
      }, options);
      request(req, (error, response, body) => {
        if (error) {
          return reject(error);
        }

        if (response.statusCode >= 400) {
          return reject(new APIError(response.statusCode,
                                     body.error ? body.error.message : body));
        }

        if (response.statusCode === 0) {
          return reject(new APIError(0, 'General API Error!'));
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

class APIError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default APIInterceptor;
