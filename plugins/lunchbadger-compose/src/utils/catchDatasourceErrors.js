import React from 'react';

const catchMap = [
  {
    test: (newState, {message}) => {
      if (/ENOTFOUND/.test(message) || /ENOENT/.test(message)) {
        for (let id in newState) {
          const {host, port, url} = newState[id];
          const credsRegex = new RegExp(`${host} ${host}:${port}`, 'i');
          if (credsRegex.test(message)) return id;
          if (url) {
            const domain = url.replace('https://', '').replace('http://', '');
            const domainRegex = new RegExp(`ENOTFOUND ${domain} ${domain}`, 'i');
            if (domainRegex.test(message)) return id;
            if (message.includes(`${url}?wsdl`)) return id;
          }
        }
      }
      if (/ER_ACCESS_DENIED_ERROR/.test(message)) {
        for (let id in newState) {
          const {nodeModules} = newState[id];
          for (let i in nodeModules) {
            const nodeModule = nodeModules[i];
            const credsRegex = new RegExp(`node_modules/${nodeModule}/`, 'i');
            if (credsRegex.test(message)) {
              const {user} = newState[id];
              const userRegex = new RegExp(`Access denied for user '${user}'@'`, 'i');
              if (userRegex.test(message)) return id;
            }
          }
        }
      }
      if (/MongoNetworkError/.test(message)) {
        for (let id in newState) {
          const {nodeModules} = newState[id];
          for (let i in nodeModules) {
            const nodeModule = nodeModules[i];
            const credsRegex = new RegExp(`node_modules/${nodeModule}/`, 'i');
            if (credsRegex.test(message)) {
              const {host, port} = newState[id];
              const addrRegex = new RegExp(`${host}:${port}`, 'i');
              if (addrRegex.test(message)) return id;
            }
          }
        }
      }
      if (/ER_DBACCESS_DENIED_ERROR/.test(message)) {
        for (let id in newState) {
          const {nodeModules} = newState[id];
          for (let i in nodeModules) {
            const nodeModule = nodeModules[i];
            const credsRegex = new RegExp(`node_modules/${nodeModule}/`, 'i');
            if (credsRegex.test(message)) {
              const {user, database} = newState[id];
              const dbRegex = new RegExp(`Access denied for user '${user}'@'%' to database '${database}'`, 'i');
              if (dbRegex.test(message)) return id;
            }
          }
        }
      }
      if (/pg_hba/.test(message)) {
        for (let id in newState) {
          const {nodeModules} = newState[id];
          for (let i in nodeModules) {
            const nodeModule = nodeModules[i];
            const credsRegex = new RegExp(`node_modules/${nodeModule}/`, 'i');
            if (credsRegex.test(message)) {
              const {user, database} = newState[id];
              if (message.includes(user) && message.includes(database)) return id;
            }
          }
        }
      }
      if (/3000\/explorer/.test(message) && Object.keys(newState).length === 1) {
        return Object.keys(newState)[0];
      }
      for (let id in newState) {
        const {nodeModules} = newState[id];
        for (let i in nodeModules) {
          const nodeModule = nodeModules[i];
          const credsRegex = new RegExp(`node_modules/${nodeModule}/`, 'i');
          if (credsRegex.test(message)) return id;
        }
      }
      return null;
    },
    process: (entity, error) => {
      error.friendlyTitle = <div>Datasource <code>{entity.name}</code> connector failed</div>;
      error.friendlyMessage = `
        Datasource connector failed on connect.
        Please check, if all properties and credentials, you provided, are correct.
        Be aware, that The Loopback is located in cloud, so it will not be able to access your localhost database.
      `;
      entity.error = error;
    },
  }
];

const checkCatchMap = (newState, error, entityId) => {
  for (let i in catchMap) {
    const catchMapItem = catchMap[i];
    const catchMapEntityId = catchMapItem.test(newState, error);
    if (catchMapEntityId) {
      catchMapItem.process(newState[catchMapEntityId], error);
      return true;
    }
  }
  if (entityId && newState[entityId]) {
    error.friendlyTitle = <div>Operation failure</div>;
    error.friendlyMessage = 'Error happened during processing entity';
    newState[entityId].error = error;
    return true;
  }
  return false;
};

const catchDatasourceErrors = (state, payload) => {
  const newState = {...state};
  const catched = checkCatchMap(newState, payload.error.error, payload.entityId);
  if (catched) {
    payload.error.error.processed = true;
    return newState;
  }
  return state;
};

export default catchDatasourceErrors;
