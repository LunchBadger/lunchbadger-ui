import {add as addDataSource} from '../reduxActions/dataSources';
import {add as addModel} from '../reduxActions/models';
import {add as addMicroservice} from '../reduxActions/microservices';
// import AddDataSource from '../actions/CanvasElements/DataSource/add';
// import AddModel from '../actions/CanvasElements/Model/add';
// import AddMicroservice from '../actions/CanvasElements/Microservice/add';

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

const dataSourcesWizard = [
  'MongoDB',
  'Redis',
  'MySQL',
];

const getDataSourceConnector = label => label === 'Ethereum' ? 'web3' : label.toLowerCase();

const wizardFunc = label => () => {}; //TODO: implement datasource wizard

const getWizardFunc = (label) => {
  if (document.location.search !== '?ds') return undefined;
  return dataSourcesWizard.includes(label) ? wizardFunc(label) : undefined;
}

const dataSourceAction = label => () => dispatch => dispatch(addDataSource(label, getDataSourceConnector(label)));

const modelAction = () => dispatch => dispatch(addModel());

const microserviceAction = () => dispatch => dispatch(addMicroservice());

export default {
  0: [
    {
      name: 'dataSource',
      icon: 'iconDataSource',
      tooltip: 'Data Source',
      submenu: dataSources.map(label => ({
        label,
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
      name: 'microservice',
      icon: 'iconMicroservice',
      tooltip: 'Microservice',
      action: microserviceAction,
    },
  ],
};
