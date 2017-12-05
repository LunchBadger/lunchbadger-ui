import {add as addDataSource} from '../reduxActions/dataSources';
import {add as addModel} from '../reduxActions/models';
import {add as addMicroservice} from '../reduxActions/microservices';
import {add as addFunction} from '../reduxActions/functions';
import Config from '../../../../src/config';

const dataSources = [
  'Memory',
  'REST',
  'SOAP',
  'MongoDB',
  'Redis',
  'MySQL',
  'Ethereum',
  'Salesforce',
];

if (Config.get('features').tritonObjectStorage) {
  dataSources.push('TritonObjectStorage');
}

const dataSourcesWizard = [
  'MongoDB',
  'Redis',
  'MySQL',
];

const getDataSourceConnector = label => {
  if (label === 'Ethereum') return 'web3';
  if (label === 'TritonObjectStorage') return 'manta';
  return label.toLowerCase();
}

const getDataSourceLabel = label => label === 'TritonObjectStorage' ? 'Triton Object Storage' : label;

const wizardFunc = label => () => {}; //TODO: implement datasource wizard

const getWizardFunc = (label) => {
  if (document.location.search !== '?ds') return undefined;
  return dataSourcesWizard.includes(label) ? wizardFunc(label) : undefined;
}

const dataSourceAction = label => () => dispatch => dispatch(addDataSource(label, getDataSourceConnector(label)));

const modelAction = () => dispatch => dispatch(addModel());

const microserviceAction = () => dispatch => dispatch(addMicroservice());

const functionAction = () => dispatch => dispatch(addFunction());

const tools = {
  0: [
    {
      name: 'dataSource',
      icon: 'iconDataSource',
      tooltip: 'Data Source',
      submenu: dataSources.map(label => ({
        label: getDataSourceLabel(label),
        name: label.toLowerCase(),
        icon: `iconDataSource${label}`,
        action: dataSourceAction(label),
        wizard: getWizardFunc(label),
        wizardTooltip: 'Create and connect to a new data source',
      })),
    },
    {
      name: 'model',
      icon: 'iconModel',
      tooltip: 'Model',
      action: modelAction,
    },
    {
      name: 'function',
      icon: 'iconFunction',
      tooltip: 'Function',
      action: functionAction,
    },
  ],
};

if (Config.get('features').microservices) {
  tools[0].push({
    name: 'microservice',
    icon: 'iconMicroservice',
    tooltip: 'Microservice',
    action: microserviceAction,
  });
}

export default tools;
