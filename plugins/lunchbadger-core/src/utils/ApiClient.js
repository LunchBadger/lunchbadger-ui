import request from 'request';
import EventSource from 'eventsource';
import Bluebird from 'bluebird';
import _ from 'lodash';
import LoginManager from './auth';

class ApiClient {
  constructor(url, idToken) {
    this.url = url;
    this.idToken = idToken;
    // console.info('ApiClient', url, {idToken});
  }

  _getHeaders() {
    const headers = {};
    if (this.idToken) {
      headers['Authorization'] = `Bearer ${this.idToken}`;
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
        const endpoint = [this.url, url.replace(/\//, '')].join('/');
        if (error) {
          return reject(new ApiError(0, error.message, endpoint, method, req, 'Error', error));
        }
        if (response.statusCode >= 400) {
          let message = body;
          let name;
          if (typeof body === 'object') {
            message = JSON.stringify(body);
          }
          if (body.err && typeof body.err === 'string') {
            message = body.err;
          }
          if (body.message) {
            message = body.message;
          }
          if (body.error) {
            if (body.error.stack) {
              message = body.error.stack;
            }
            if (typeof body.error === 'string') {
              message = body.error;
            }
            if (body.error.message) {
              message = body.error.message;
            }
            if (body.error.name) {
              name = body.error.name;
            }
          }
          if (response.status === 401 || response.statusCode === 401) {
            LoginManager().refreshLogin();
          }
          return reject(new ApiError(response.statusCode, message, endpoint, method, req, name, body));
        }
        if (response.statusCode === 0) {
          return reject(new ApiError(0, 'Error communicating with API', endpoint, method, req));
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
  constructor(statusCode, message, endpoint, method, request, name = 'Error', body) {
    super(message);
    this.statusCode = statusCode;
    this.endpoint = endpoint;
    this.method = method;
    this.name = name;
    this.request = request;
    this.body = body;
  }
}

export default ApiClient;
