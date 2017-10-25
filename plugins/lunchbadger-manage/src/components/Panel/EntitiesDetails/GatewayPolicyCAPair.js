import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {
  // EntityProperty,
  EntityPropertyLabel,
  CollapsibleProperties,
  Input,
  // Checkbox,
  Table,
  IconButton,
} from '../../../../../lunchbadger-ui/src';
import './GatewayPolicyCAPair.scss';

export default class GatewayPolicyCAPair extends PureComponent {
  static propTypes = {
    idx: PropTypes.number,
    onRemoveCAPair: PropTypes.func,
    onReorderCAPairUp: PropTypes.func,
    onReorderCAPairDown: PropTypes.func,
    onAddParameter: PropTypes.func,
    onRemoveParameter: PropTypes.func,
    onParameterTab: PropTypes.func,
    pipelineIdx: PropTypes.number,
    policyIdx: PropTypes.number,
    pair: PropTypes.object,
  };

  renderParameters = (pipelineIdx, policyIdx, pairIdx, pair, kind) => {
    const {onAddParameter, onRemoveParameter, onParameterTab} = this.props;
    const columns = [
      'Parameter Name',
      'Parameter Value',
      <IconButton icon="iconPlus" onClick={onAddParameter(kind, pipelineIdx, policyIdx, pairIdx)} />,
    ];
    const widths = [160, undefined, 70];
    const paddings = [true, true, false];
    const data = pair[kind].parameters.map((item, idx) => [
      <Input
        name={`pipelines[${pipelineIdx}][policies][${policyIdx}][pairs][${pairIdx}][${kind}][${idx}][name]`}
        value={item.name}
        underlineStyle={{bottom: 0}}
        fullWidth
        hideUnderline
      />,
      <Input
        name={`pipelines[${pipelineIdx}][policies][${policyIdx}][pairs][${pairIdx}][${kind}][${idx}][value]`}
        value={item.value}
        underlineStyle={{bottom: 0}}
        fullWidth
        hideUnderline
        handleKeyDown={onParameterTab(kind, pipelineIdx, policyIdx, pairIdx, idx)}
      />,
      <IconButton icon="iconDelete" onClick={onRemoveParameter(kind, pipelineIdx, policyIdx, pairIdx, idx)} />,
    ]);
    return (
      <Table
        columns={columns}
        data={data}
        widths={widths}
        paddings={paddings}
      />
    );
  };

  render() {
    const {
      pairIdx,
      onRemoveCAPair,
      onReorderCAPairUp,
      onReorderCAPairDown,
      pipelineIdx,
      policyIdx,
      pair,
    } = this.props;
    const collapsible = (
      <div className="GatewayPolicyCAPair__CA">
        <Input
          type="hidden"
          name={`pipelines[${pipelineIdx}][policies][${policyIdx}][pairs][${pairIdx}][id]`}
          value={pair.id}
        />
        <div className="GatewayPolicyCAPair__CA__C">
          <EntityPropertyLabel>Condition</EntityPropertyLabel>
          {this.renderParameters(pipelineIdx, policyIdx, pairIdx, pair, 'condition')}
        </div>
        <div className="GatewayPolicyCAPair__CA__A">
          <EntityPropertyLabel>Action</EntityPropertyLabel>
          {this.renderParameters(pipelineIdx, policyIdx, pairIdx, pair, 'action')}
        </div>
      </div>
    );
    const buttons = (
      <span>
        <IconButton
          icon="iconDelete"
          onClick={onRemoveCAPair}
        />
        <IconButton
          icon="iconArrowDown"
          onClick={onReorderCAPairDown}
          disabled={!onReorderCAPairDown}
        />
        <IconButton
          icon="iconArrowUp"
          onClick={onReorderCAPairUp}
          disabled={!onReorderCAPairUp}
        />
      </span>
    );
    return (
      <div className="GatewayPolicyCAPair">
        <CollapsibleProperties
          bar={<span className="GatewayPolicyCAPair__title">Pair {pairIdx + 1}</span>}
          button={buttons}
          collapsible={collapsible}
          defaultOpened
          space="0"
          barToggable
        />
      </div>
    );
  }
}
