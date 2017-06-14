import React from 'react';
import {Aside, ToolGroup} from '../../../../lunchbadger-ui/src';

export default ({appState, plugins, disabled}) => {
  const currentEditElement = appState.getStateKey('currentEditElement');
  const isPanelOpened = appState.getStateKey('isPanelOpened');
  const asideDisabled = !!currentEditElement || !!isPanelOpened || disabled;
  return (
    <Aside disabled={asideDisabled}>
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
};
