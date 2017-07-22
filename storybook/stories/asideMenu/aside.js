import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select} from '@kadira/storybook-addon-knobs';
import {withContext, withProvider} from '../../decorators';
import {importPaths} from '../../constants';
import {forAsideMenu} from '../../decorators';
import {MockApp} from '../../components';
import {Aside, entityIcons, dataSourceIcons} from '../../../plugins/lunchbadger-ui/src';
import ToolGroup from '../../../plugins/lunchbadger-ui/src/Aside/ToolGroup/ToolGroup';
import Tool from '../../../plugins/lunchbadger-ui/src/Aside/Tool/Tool';
import {iconEdit, iconTrash} from '../../../src/icons';

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

const getWizardFunc = label => dataSourcesWizard.includes(label) ? action(`Wizard: ${label}`) : undefined;

const submenuDataSource = dataSources.map(label => ({
  label,
  name: label.toLowerCase(),
  icon: dataSourceIcons[label],
  onClick: action(label),
  wizard: getWizardFunc(label),
  wizardTooltip: 'Create and connect to a new data source',
}));

const submenuEndpoint = [
  {
    label: 'Private',
    name: 'privateendpoint',
    icon: entityIcons.PrivateEndpoint,
    onClick: action('PrivateEndpoint'),
  },
  {
    label: 'Public',
    name: 'publicendpoint',
    icon: entityIcons.PrivateEndpoint,
    onClick: action('PublicEndpoint'),
  },
];

const options = {
  '': 'none',
  DataSource: 'Data Source',
  Model: 'Model',
  Microservice: 'Microservice',
  Endpoint: 'Endpoint',
  Gateway: 'Gateway',
  API: 'API',
  Portal: 'Portal',
}

const selected = (item) => item === select('selected', options, '');

storiesOf('Aside menu', module)
  .addDecorator(withKnobs)
  .addDecorator(withProvider)
  .addDecorator(withContext)
  .addDecorator(forAsideMenu)
  .addWithInfo('Aside menu',
    importPaths([
      ['Aside', 'plugins/lunchbadger-ui/src', true],
      ['ToolGroup', 'plugins/lunchbadger-ui/src/Aside/ToolGroup/ToolGroup', false],
      ['Tool', 'plugins/lunchbadger-ui/src/Aside/Tool/Tool', false],
    ]),
    () => (
      <MockApp>
        <Aside disabled={boolean('disabled', false)}>
          <ToolGroup>
            <Tool
              icon={entityIcons.DataSource}
              onClick={action('Data Source')}
              tooltip="DataSource"
              submenu={submenuDataSource}
              selected={selected('DataSource')}
            />
            <Tool
              icon={entityIcons.Model}
              onClick={action('Model')}
              tooltip="Model"
              selected={selected('Model')}
            />
            <Tool
              icon={entityIcons.Microservice}
              onClick={action('Microservice')}
              tooltip="Microservice"
              selected={selected('Microservice')}
            />
          </ToolGroup>
          <ToolGroup>
            <Tool
              icon={entityIcons.PrivateEndpoint}
              onClick={action('Microservice')}
              tooltip="Endpoint"
              plain
              submenu={submenuEndpoint}
              selected={selected('Endpoint')}
            />
            <Tool
              icon={entityIcons.Gateway}
              onClick={action('Gateway')}
              tooltip="Gateway"
              selected={selected('Gateway')}
            />
          </ToolGroup>
          <ToolGroup>
            <Tool
              icon={entityIcons.API}
              onClick={action('API')}
              tooltip="API"
              selected={selected('API')}
            />
            <Tool
              icon={entityIcons.Portal}
              onClick={action('Portal')}
              tooltip="Portal"
              selected={selected('Portal')}
            />
          </ToolGroup>
        </Aside>
      </MockApp>
    ),
    {propTables: [Aside, ToolGroup, Tool], inline: true}
  );
