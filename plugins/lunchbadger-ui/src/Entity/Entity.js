import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import EntityHeader from './EntityHeader/EntityHeader';
import EntityValidationErrors from './EntityValidationErrors/EntityValidationErrors';
import EntityActionButtons from './EntityActionButtons/EntityActionButtons';
import {SmoothCollapse, Toolbox, Form} from '../';
import userStorage from '../../../../plugins/lunchbadger-core/src/utils/userStorage';
import './Entity.scss';

class Entity extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expanded: props.defaultExpanded,
      marginTopPorts: {},
    }
  }

  componentDidMount() {
    const collapsed = userStorage.getObjectKey('entityCollapsed', this.props.entityId);
    if (collapsed) {
      this.handleToggleExpand();
    }
  }

  componentWillReceiveProps(props) {
    if (!this.props.editable && props.editable && !this.state.expanded) {
      this.setState({expanded: true});
    }
  }

  getInputNameRef = () => this.entityHeaderRef.getInputNameRef();

  getFormRef = () => this.refs.form;

  handleToggleExpand = (event) => {
    let expanded = this.state.expanded;
    if (event) {
      expanded = !expanded;
    }
    this.refs.data.querySelectorAll('.port__middle').forEach((portRef) => {
      if (!expanded) {
        const marginTop = +window.getComputedStyle(portRef).marginTop.replace('px', '');
        this.state.marginTopPorts[portRef.id] = marginTop;
        portRef.style.marginTop = `${-portRef.offsetTop + marginTop + 13}px`;
      } else {
        portRef.style.marginTop = `${this.state.marginTopPorts[portRef.id]}px`;
      }
    });
    if (event) {
      this.setState({expanded});
      this.props.onToggleCollapse(!expanded);
      event && event.stopPropagation();
    }
  }

  render() {
    const {
      children,
      type,
      connector,
      editable,
      highlighted,
      dragging,
      wip,
      gray,
      fake,
      invalid,
      semitransparent,
      toolboxConfig,
      name,
      onNameChange,
      validations,
      onCancel,
      onValidSubmit,
      onClick,
      onDoubleClick,
      connectDragSource,
      connectDropTarget,
      onNameBlur,
      slugifyName,
      subtitle,
    } = this.props;
    const opacity = dragging ? 0.2 : 1;
    const {expanded} = this.state;
    const collapsed = !expanded;
    const classNames = cs('Entity', type, connector, {
      editable,
      expanded,
      collapsed,
      highlighted,
      dragging,
      wip,
      gray,
      invalid,
      semitransparent,
    });
    return connectDragSource(connectDropTarget(
      <div
        className={classNames}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        style={{opacity}}
      >
        <Toolbox config={toolboxConfig} />
        <Form name="elementForm" ref="form" onValidSubmit={onValidSubmit}>
          <EntityHeader
            ref={(r) => {this.entityHeaderRef = r;}}
            type={type}
            onToggleExpand={this.handleToggleExpand}
            name={name}
            onNameChange={onNameChange}
            onNameBlur={onNameBlur}
            invalid={validations.data.name}
            slugifyName={slugifyName}
            subtitle={subtitle}
          />
          {!fake && (
            <div className="Entity__data">
              <SmoothCollapse expanded={expanded} heightTransition="800ms ease">
                <div className="Entity__extra" ref="data">
                  <EntityValidationErrors
                    validations={validations}
                  />
                  {children}
                  <SmoothCollapse expanded={editable} heightTransition="800ms ease">
                    <EntityActionButtons onCancel={onCancel} />
                  </SmoothCollapse>
                </div>
              </SmoothCollapse>
            </div>
          )}
        </Form>
      </div>
    ));
  }
}

Entity.propTypes = {
  children: PropTypes.node.isRequired,
  editable: PropTypes.bool.isRequired,
  highlighted: PropTypes.bool.isRequired,
  dragging: PropTypes.bool.isRequired,
  wip: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  toolboxConfig: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  onNameChange: PropTypes.func.isRequired,
  onNameBlur: PropTypes.func.isRequired,
  validations: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  onValidSubmit: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func.isRequired,
  onToggleCollapse: PropTypes.func.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  connector: PropTypes.string,
  semitransparent: PropTypes.bool,
  defaultExpanded: PropTypes.bool.isRequired,
};

export default Entity;
