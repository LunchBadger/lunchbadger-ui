import EventSource from 'eventsource';
import Bluebird from 'bluebird';
import axios from 'axios';
import _ from 'lodash';
import LoginManager from './auth';
import recordedMocks from './recordedMocks';
import Config from '../../../../src/config';

const mocks = Config.get('mocks');

const statusCodesToRepeat = {
  422: [0, 0, 0, 0, 0],
  503: [5, 10, 20, 30],
};

const getErrorName = (body) => {
  if (body.error && body.error.name) {
    return body.error.name;
  }
  return null;
}

const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));

const getErrorMessage = (body) => {
  let message = body;
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
  }
  return message;
}

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
    // FIXME after quarantaine, we can remove that and replace body->data in all services
    if (options && options.hasOwnProperty('body')) {
      Object.defineProperty(options, 'data', Object.getOwnPropertyDescriptor(options, 'body'));
      delete options.body;
    }
    if (mocks) return Promise.resolve({body: recordedMocks(method, this.url + url)});
    return new Bluebird((resolve, reject) => {
      const req = _.merge({
        method: method,
        url: url,
        baseURL: this.url,
        json: true,
        headers: _.extend(this._getHeaders(), {})
      }, options);
      this.makeRequest(req, resolve, reject, url, method, options);
    });
  }

  makeRequest = (req, resolve, reject, url, method, options, attempt = 0) => {
    const endpoint = [this.url, url.replace(/\//, '')].join('/');
    axios(req)
      .then(async (response) => {
        const {data: body, status: statusCode} = response;
        if (statusCode >= 400) {
          if (statusCodesToRepeat[statusCode] && attempt < statusCodesToRepeat[statusCode].length) {
            // retrying the same call up to 5 times: https://github.com/LunchBadger/general/issues/445
            await timeout(statusCodesToRepeat[statusCode][attempt] * 1000);
            return this.makeRequest(req, resolve, reject, url, method, options, attempt + 1);
          }
          let message = body;
          let name;
          if (body) {
            name = getErrorName(body);
            message = getErrorMessage(body);
          } else {
            message = response.statusMessage;
          }
          if (statusCode === 401) {
            LoginManager().refreshLogin();
          }
          return reject(new ApiError(statusCode, message, endpoint, method, req, name, body));
        }
        if (statusCode === 0) {
          return reject(new ApiError(0, 'Error communicating with API', endpoint, method, req));
        }
        return resolve({response, body});
      })
    .catch(async (error) => {
      const {response} = error;
      if (response) {
        const {data: body, status: statusCode} = response;
        if (statusCode >= 400) {
          if (statusCodesToRepeat[statusCode] && attempt < statusCodesToRepeat[statusCode].length) {
            await timeout(statusCodesToRepeat[statusCode][attempt] * 1000);
            return this.makeRequest(req, resolve, reject, url, method, options, attempt + 1);
          }
          let message = body;
          let name;
          if (body) {
            name = getErrorName(body);
            message = getErrorMessage(body);
          } else {
            message = response.statusMessage;
          }
          if (statusCode === 401) {
            LoginManager().refreshLogin();
          }
          return reject(new ApiError(statusCode, message, endpoint, method, req, name, body));
        }
      }
      return reject(new ApiError(0, error.message, endpoint, method, req, 'Error', error));
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
