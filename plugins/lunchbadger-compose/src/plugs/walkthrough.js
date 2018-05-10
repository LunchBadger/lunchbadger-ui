export default {
  '010': {
    title: 'Data Source Dropdown Menu',
    text: 'Selecting this icon will reveal available data source connectors for your LunchBadger project.',
    selector: '.Tool.dataSource',
    position: 'right',
  },
  '011': {
    title: 'Data Source Entities Overview',
    text: 'Each data source entity will come with its own set of properties specific for that type of connection.  These entities correspond with a matching data source connector that can be used with your underlying Loopback project.',
    waitForSelector: 'div[role=presentation]',
    position: 'right',
    onBefore: api => [
      api.openEntitySubmenu('dataSource'),
    ],
  },
  '012': {
    text: 'Memory type is different from all other types, because it is in-memory data store, and not a Loopback data source connector.',
    selector: '.Tool__submenuItem.memory',
    position: 'right',
  },
  '013': {
    text: 'If it would be a Loopback data source connector, here you could specify data source properties, like host, port, etc.',
    waitForSelector: '.Entity.DataSource.memory',
    position: 'right',
    onBefore: api => [
      api.addEntityViaSubmenu('memory'),
    ],
    onAfter: api => [
      api.submitCanvasEntity('DataSource.memory'),
      api.unselectEntities(),
    ],
  },
  '020': {
    title: 'Model Entities',
    text: 'Model Entity represent a visual interface on top of a Loopback Model.',
    selector: '.Tool.model',
    position: 'right',
  },
  '021': {
    text: 'Here, you can add properties you\'d like to expose from your Data Source through your API Endpoint.',
    waitForSelector: '.Entity.Model .EntitySubElements__main',
    position: 'right',
    onBefore: api => [
      api.addEntity('model'),
      api.setCanvasEntityName('Model', 'Car'),
      api.setTextValue('.Entity.Model .input__httppath', 'cars'),
      api.click('.Entity.Model .button__add__Properties'),
      api.setTextValue('.Entity.Model .input__properties0name', 'make'),
      api.click('.Entity.Model .button__add__Properties'),
      api.setTextValue('.Entity.Model .input__properties1name', 'model'),
      api.click('.Entity.Model .button__add__Properties'),
      api.setTextValue('.Entity.Model .input__properties2name', 'year'),
      api.setSelectValue('.Entity.Model .select__properties2type', 'number'),
      api.click('.Entity.Model .button__add__Properties'),
      api.setTextValue('.Entity.Model .input__properties3name', 'vin'),
      api.wait(500),
    ],
    onAfter: api => [
      api.submitCanvasEntity('Model'),
      api.connectPorts('.Entity.DataSource .port-out', '.Entity.Model .port-in'),
      api.unselectEntities(),
    ],
  },
  '030': {
    title: 'Function Entities',
    text: 'A function entity represents a serverless function that runs in your Kubernetes cluster.',
    selector: '.Tool.function',
    position: 'right',
  },
  '031': {
    text: 'LunchBadger includes a built-in editor.',
    waitForSelector: '.DetailsPanel .FilesEditor',
    position: 'top',
    onBefore: api => [
      api.addEntity('function'),
      api.submitCanvasEntity('Function_'),
      api.openEntityDetails('Function_'),
      api.click('.DetailsPanel .FilesEditor__tree > div > div > .children > div:nth-child(2) > div > div'),
    ],
    onAfter: api => [
      api.discardEntityDetails(),
      api.unselectEntities(),
    ],
  },
  '040': {
    title: 'Microservice Entities',
    text: '<i>This Entity is still in-development. It\'s not recommended for use at this time.</i>',
    selector: '.Tool.microservice',
    position: 'right',
  },
};
