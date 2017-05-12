import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {WithNotes} from '@kadira/storybook-addon-notes';
import {Form} from 'formsy-react';
import {
  Button,
  CollapsibleProperties,
  Toolbox,
} from '../plugins/lunchbadger-ui/src';
import {
  lorem,
  toolboxConfig,
  colors,
} from './constants.js';
import {
  Clickable,
  Color,
  FakeEntity,
} from './components';
import './styles.scss';

storiesOf('Colors', module)
  .add('show', () => (
    <WithNotes notes="To be extended">
      <div>
        {colors.map((item, idx) => <Color key={idx} {...item} />)}
      </div>
    </WithNotes>
  ));

storiesOf('Button', module)
  .addWithInfo('show',
    '',
    () => <Button onClick={action('clicked')}>Cancel</Button>,
    {inline: true},
  );

storiesOf('Buttons', module)
  .add('show', () => (
    <div className="story__Buttons">
      <Button onClick={action('clicked')}>Cancel</Button>
      <Button type="submit" onClick={action('clicked')}>OK</Button>
    </div>
  ));

storiesOf('Inputs', module)
  .add('text', () => (
    <FakeEntity />
  ));

storiesOf('CollapsibleProperties', module)
  .add('single', () => (
    <CollapsibleProperties
      bar={lorem()}
      collapsible={lorem(6)}
      onToggleCollapse={action('onToggleCollapse')}
    />
  ))
  .add('multiple', () => (
    <div>
      <CollapsibleProperties
        bar={lorem()}
        collapsible={lorem(20)}
        onToggleCollapse={action('onToggleCollapse')}
      />
      <CollapsibleProperties
        bar={lorem()}
        collapsible={lorem(10)}
        onToggleCollapse={action('onToggleCollapse')}
      />
      <CollapsibleProperties
        bar={lorem()}
        collapsible={lorem(30)}
        onToggleCollapse={action('onToggleCollapse')}
      />
      <CollapsibleProperties
        bar={lorem()}
        collapsible={lorem(40)}
        onToggleCollapse={action('onToggleCollapse')}
      />
      <CollapsibleProperties
        bar={lorem()}
        collapsible={lorem(50)}
        onToggleCollapse={action('onToggleCollapse')}
      />
    </div>
  ));

storiesOf('Toolbox', module)
  .add('show', () => (
    <div>
      <Clickable title="Delete + Edit">
        <Toolbox config={toolboxConfig.deleteEdit} />
      </Clickable>
      <Clickable title="All entities">
        <Toolbox config={toolboxConfig.entities} />
      </Clickable>
      <Clickable title="One item only">
        <Toolbox config={toolboxConfig.one} />
      </Clickable>
    </div>
  ));
