import request from 'request';
import EventSource from 'eventsource';
import Bluebird from 'bluebird';
import _ from 'lodash';

class ApiClient {
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
          const message = body.error ? (body.error.message + '\n' + body.error.stack) : body;
          return reject(new ApiError(response.statusCode, message));
        }
        if (response.statusCode === 0) {
          return reject(new ApiError(0, 'Error communicating with API'));
        }
        return resolve({response, body});
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

  eventSource(url) {
    let fullUrl = _.trimEnd(this.url, ['/']) + '/' + _.trimStart(url, ['/'])
    return new EventSource(fullUrl, { headers: this._getHeaders() });
  }
}

class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default ApiClient;
