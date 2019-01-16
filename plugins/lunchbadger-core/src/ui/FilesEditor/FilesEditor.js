import React, {Component} from 'react';
import {PropTypes} from 'prop-types';
import Tree from 'react-ui-tree';
import cs from 'classnames';
import _ from 'lodash';
import uuid from 'uuid';
import {findDOMNode} from 'react-dom';
import {
  CodeEditor,
  IconMenu,
  Input,
  IconSVG,
} from '../';
import icons from '../icons';
import userStorage from '../../utils/userStorage';
import {sortStrings} from '../utils';
import './FilesEditor.scss';

const {iconFile, iconFolder} = icons;

const OPERATIONS = {
  NEW_FILE: 'New file',
  NEW_FOLDER: 'New folder',
  RENAME: 'Rename',
  DELETE: 'Delete',
  CANCEL_EDITING: 'CANCEL_EDITING',
};

export default class FilesEditor extends Component {
  static propTypes = {
    lang: PropTypes.string,
    onChange: PropTypes.func,
    files: PropTypes.object,
    defaultSelect: PropTypes.string,
  };

  constructor(props) {
    super(props);
    const {files, defaultSelect} = props;
    const id = uuid.v4();
    const tree = {
      id,
      module: '.',
      children: [],
      root: true,
      collapsed: false,
    };
    const map = {
      [id]: tree,
    };
    this.transformFilesIntoTree(tree, files, map);
    let active = null;
    if (defaultSelect) {
      tree.children.forEach((item) => {
        if (item.module === defaultSelect) {
          active = item.id;
        }
      });
      if (!active) {
        const firstLeaf = tree.children.find(item => item.leaf === true);
        if (firstLeaf) {
          active = firstLeaf.id;
        }
      }
    }
    this.state = {
      tree,
      map,
      active,
      newFile: false,
      size: userStorage.getObjectKey('FilesEditorSize', this.props.entityId),
    };
    this.codeEditorRefs = {};
  }

  transformFilesIntoTree = (obj, data = {}, map) => {
    Object.keys(data)
      .forEach((key) => {
        const id = uuid.v4();
        const item = {
          id,
          module: key,
          parent: obj.id,
        };
        map[id] = item;
        if (typeof data[key] === 'string') {
          item.leaf = true;
          item.content = data[key];
        } else {
          item.children = [];
          item.collapsed = false;
          this.transformFilesIntoTree(item, data[key], map);
        }
        obj.children.push(item);
      });
  };

  handleOperation = (node, operation, event) => {
    const {tree, map} = this.state;
    let active = this.state.active;
    let isStateUpdate = true;
    const callbacks = [];
    if (operation === OPERATIONS.NEW_FILE) {
      const selectedNode = this.getTreeNodeById(node.leaf ? node.parent : node.id);
      const id = uuid.v4();
      const item = {
        id,
        module: '',
        leaf: true,
        content: '',
        editing: true,
        pending: true,
        parent: selectedNode.id,
      }
      map[id] = item;
      selectedNode.children.unshift(item);
      selectedNode.collapsed = false;
      active = id;
      callbacks.push(() => {
        this.dispatchResizeEvent();
        const input = findDOMNode(this.filesRef).querySelector(`.node.id${id} input`);
        input && input.focus();
      });
    }
    if (operation === OPERATIONS.NEW_FOLDER) {
      const selectedNode = this.getTreeNodeById(node.leaf ? node.parent : node.id);
      const id = uuid.v4();
      const item = {
        id,
        module: '',
        children: [],
        editing: true,
        pending: true,
        collapsed: false,
        parent: selectedNode.id,
      }
      map[id] = item;
      selectedNode.children.unshift(item);
      selectedNode.collapsed = false;
      active = null;
      callbacks.push(() => {
        this.dispatchResizeEvent();
        const input = findDOMNode(this.filesRef).querySelector(`.node.id${id} input`);
        input && input.focus();
      });
    }
    if (operation === OPERATIONS.RENAME) {
      const {id} = node;
      const selectedNode = this.getTreeNodeById(id);
      selectedNode.editing = true;
      callbacks.push(() => {
        this.dispatchResizeEvent();
        const input = findDOMNode(this.filesRef).querySelector(`.node.id${id} input`);
        input && input.focus();
      });
    }
    if (operation === OPERATIONS.DELETE) {
      if (node.id === this.state.active) {
        active = null;
      }
      const parentNode = this.getTreeNodeById(node.parent);
      parentNode.children = parentNode.children.filter(item => item.id !== node.id);
      delete map[node.id];
    }
    if (operation === OPERATIONS.CANCEL_EDITING) {
      isStateUpdate = false;
      if (event.keyCode === 13 || event.which === 13) {
        const editedNode = this.getTreeNodeById(node.id);
        const parentNode = this.getTreeNodeById(node.parent);
        const value = event.target.value.trim();
        if (parentNode.children.find(item => item.module.toLowerCase() === value.toLowerCase())) {
          if (editedNode.pending) {
            parentNode.children = parentNode.children.filter(item => item.id !== node.id);
            delete map[node.id];
            active = null;
          } else {
            editedNode.editing = false;
            editedNode.pending = false;
          }
        } else {
          editedNode.module = value;
          editedNode.editing = false;
          editedNode.pending = false;
          parentNode.children.sort(sortStrings('module'));
          callbacks.push(() => {
            const input = findDOMNode(this.filesRef).querySelector(`.node.id${node.id}`);
            input && input.scrollIntoViewIfNeeded();
          });
        }
        isStateUpdate = true;
        event.preventDefault();
      }
      if (event.keyCode === 27 || event.which === 27) {
        if (node.pending) {
          const selectedNode = this.getTreeNodeById(node.parent);
          selectedNode.children = selectedNode.children.filter(item => item.id !== node.id);
          active = null;
        } else {
          const editedNode = this.getTreeNodeById(node.id);
          editedNode.editing = false;
        }
        isStateUpdate = true;
      }
    }
    if (isStateUpdate) {
      this.setState({tree, map}, () => {
        callbacks.forEach(cb => setTimeout(cb));
        if (active !== this.state.active) {
          this.setState({active});
        }
      });
    }
  };

  handleTreeChange = tree => {
    // TODO: reorder after moving items
    this.setState({tree});
  };

  getTreeNodeById = id => this.state.map[id];

  isRequired = (node) => {
    const {lang} = this.props;
    const extension = {
      javascript: 'js',
      python: 'py',
    }[lang];
    const requiredFiles = [`handler.${extension}`];
    if (!requiredFiles.includes(node.module)) return false;
    if (!this.state.map[node.parent].root) return false;
    return true;
  };

  renderNode = (node) => {
    const active = node.id === this.state.active;
    const options = [];
    const secondaryOptions = [];
    options.push(OPERATIONS.NEW_FILE);
    options.push(OPERATIONS.NEW_FOLDER);
    if (!node.root && !this.isRequired(node)) {
      secondaryOptions.push(OPERATIONS.RENAME);
      secondaryOptions.push(OPERATIONS.DELETE);
    }
    const {editing, module: name, id, leaf, root} = node;
    const noIcon = root;
    return (
      <div
        className={cs('node', `id${id}`, {active, noIcon})}
        onClick={this.onClickNode(node)}
      >
        {!noIcon && <IconSVG svg={leaf ? iconFile : iconFolder} className="icon" />}
        {!editing && name}
        {!editing && (
          <div className="FilesEditor__iconMenu">
            <IconMenu
              icon="iconBasics"
              name={'tmp'}
              options={options}
              secondaryOptions={secondaryOptions}
              onClick={operation => this.handleOperation(node, operation)}
            />
          </div>
        )}
        {editing && (
          <input
            className="FilesEditor__editing"
            defaultValue={name}
            onKeyDown={event => this.handleOperation(node, OPERATIONS.CANCEL_EDITING, event)}
            onBlur={() => this.handleOperation(node, OPERATIONS.CANCEL_EDITING, {keyCode: 27})}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        )}
      </div>
    );
  };

  onClickNode = node => () => {
    if (node.leaf) {
      this.setState({active: node.id}, this.dispatchResizeEvent);
    } else if (!node.root) {
      const {tree} = this.state;
      const selectedNode = this.getTreeNodeById(node.id);
      selectedNode.collapsed = !selectedNode.collapsed;
      this.setState({tree});
    }
  };

  dispatchResizeEvent = () => window.dispatchEvent(new Event('rndresized'));

  handleResize = size => {
    userStorage.setObjectKey('FilesEditorSize', this.props.entityId, size);
    this.setState({size});
  };

  renderCodeEditors = (prefix, tree) => {
    const {lang, onChange} = this.props;
    const {active, size} = this.state;
    const {children} = tree;
    const isEmptyFolder = children.length === 0;
    return (
      <div>
        {isEmptyFolder && (
          <Input
            name={prefix}
            value={true}
            className="FilesEditor__hidden"
          />
        )}
        {children.map(node => {
          const slug = node.module.replace(/\./g, '*');
          return (
            <div key={node.id}>
              {node.leaf && (
                <div style={{display: node.id === active ? 'block' : 'none'}}>
                  <CodeEditor
                    size={size}
                    lang={lang}
                    value={node.content}
                    name={`${prefix}[${slug}]`}
                    onChange={onChange}
                    mode="editor"
                    onResize={this.handleResize}
                    initialHeight={200}
                  />
                </div>
              )}
              {node.children && this.renderCodeEditors(`${prefix}[${slug}]`, node)}
            </div>
          );
        })}
      </div>
    );
  };

  render () {
    const {tree, active} = this.state;
    const blank = active === null;
    const size = this.state.size || {
      width: 'calc(100% - 5px)',
      height: 200,
    };
    const codeEditorStyle = {};
    if (blank) {
      Object.assign(codeEditorStyle, size);
    }
    return (
      <div className="FilesEditor">
        <div className={cs('FilesEditor__codeEditor', {blank})}>
          {this.renderCodeEditors('files', tree)}
          <div className="FilesEditor__fake" style={codeEditorStyle} />
        </div>
        <div className="FilesEditor__tree">
          <Tree
            ref={r => this.filesRef = r}
            tree={tree}
            renderNode={this.renderNode}
            paddingLeft={15}
            onChange={this.handleTreeChange}
          />
        </div>
      </div>
    );
  }
}
