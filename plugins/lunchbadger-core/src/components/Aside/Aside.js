import React from 'react';
import {Aside, ToolGroup} from '../../../../lunchbadger-ui/src';

export default ({plugins, disabled, currentEditElement}) => (
  <Aside disabled={disabled}>
    {plugins.getToolGroups().map((plugin, idxGroup) => (
      <ToolGroup key={idxGroup}>
        {plugin.tools.map(({component: ToolComponent}, idxTool) => (
          <ToolComponent
            key={idxTool}
            currentEditElement={currentEditElement}
            editedElement={(currentEditElement || {name: ''}).name}
          />
        ))}
      </ToolGroup>
    ))}
  </Aside>
);
