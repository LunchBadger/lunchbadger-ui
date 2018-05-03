export default {
  '01': {
    title: 'Data Source Dropdown Menu',
    text: 'Selecting this icon will reveal available data source connectors for your LunchBadger project.',
    selector: '.Tool.dataSource',
    position: 'right',
  },
  '02': {
    title: 'Model Entities',
    text: 'Model Entity represent a visual interface on top of a Loopback Model. Here, you can add properties you\'d like to expose from your Data Source through your API Endpoint.',
    selector: '.Entity.Model',
    position: 'right',
  },
  '03': {
    title: 'Function Entities',
    text: 'A function entity represents a serverless function that runs in your Kubernetes cluster. LunchBadger includes a built-in editor.',
    selector: '.Entity.Function_',
    position: 'right',
  },
  '04': {
    title: 'Microservice Entities',
    text: 'This Entity is still in-development. It\'s not recommended for use at this time.',
    selector: '.Tool.microservice',
    position: 'right',
  },
};
