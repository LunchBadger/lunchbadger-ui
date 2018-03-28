import React, {PureComponent} from 'react';
import {PropTypes} from 'prop-types';
import Tree from 'react-ui-tree';
import slug from 'slug';
import cx from 'classnames';
import _ from 'lodash';
import {findDOMNode} from 'react-dom';
import {
  CodeEditor,
  IconButton,
  Input,
} from '../';
import './FilesEditor.scss';

export default class FilesEditor extends PureComponent {
  static propTypes = {
    lang: PropTypes.string,
    onChange: PropTypes.func,
    files: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      files: _.cloneDeep(props.files),
      active: Object.keys(props.files)[0] || null,
      newFile: false,
    };
    this.codeEditorRefs = {};
  }

  renderNode = (node) => {
    const file = node.module || '';
    const active = file === this.state.active;
    const filesAmount = Object.keys(this.state.files || {})
      .filter(file => this.state.files[file] !== null)
      .length;
    return (
      <span
        className={cx('node', slug(file, {lower: true}), {active})}
        onClick={this.onClickNode(file)}
      >
        {file}
        {filesAmount > 1 && file !== '' && (
          <div className="FilesEditor__removeFile">
            <IconButton icon="iconDelete" onClick={event => this.handleRemoveNode(event, file)} />
          </div>
        )}
      </span>
    );
  };

  onClickNode = active => () => {
    if (!active) return;
    this.setState({active}, this.dispatchResizeEvent);
  };

  dispatchResizeEvent = () => window.dispatchEvent(new Event('rndresized'));

  handleResize = size => this.setState({size});

  handleRemoveNode = (event, filename) => {
    const files = {};
    Object.keys(this.state.files).forEach((file) => {
      files[file] = file === filename ? null : this.state.files[file];
    });
    if (!this.props.files.hasOwnProperty(filename)) {
      delete files[filename];
    }
    let active = this.state.active;
    if (filename === active) {
      active = Object.keys(files).filter(file => files[file] !== null)[0] || null;
    }
    this.setState({
      files,
      active,
    }, () => {
      this.dispatchResizeEvent();
      this.forceUpdate();
    });
    event.preventDefault();
    event.stopPropagation();
  };

  handleAddFile = () => {
    this.setState({newFile: true}, () => {
      const input = findDOMNode(this.newFileRef).querySelector('input');
      input && input.focus();
    });
  };

  handleNewFileKeyPress = (event) => {
    if (event.keyCode === 13 || event.which === 13) {
      const filename = event.target.value.trim();
      if (filename.length > 0) {
        const files = {};
        const data = {
          ...this.state.files,
          [filename]: ' ',
        };
        Object.keys(data).sort().forEach(key => files[key] = data[key]);
        this.setState({
          files,
          newFile: false,
        });
        setTimeout(() => {
          this.setState({active: filename}, () => {
            this.dispatchResizeEvent();
            const input = findDOMNode(this.filesRef).querySelector(`.${slug(filename, {lower: true})}`);
            input && input.scrollIntoViewIfNeeded();
          });
        });
      }
      event.preventDefault();
      event.stopPropagation();
    }
  };

  render () {
    const {lang, onChange} = this.props;
    const {files, active, size, newFile} = this.state;
    const tree = {
      children: Object.keys(files)
        .filter(file => files[file] !== null)
        .map(file => ({
          module: file,
          leaf: true,
        })),
    };
    const filesToRemove = Object.keys(files).filter(file => files[file] === null);
    return (
      <div className="FilesEditor">
        <div className="FilesEditor__hidden">
          {filesToRemove.map(key => (
            <Input
              key={key}
              name={`filesToRemove[${key.replace(/\./g, '*')}]`}
              value=""
            />
          ))}
        </div>
        <div className="FilesEditor__codeEditor">
          {Object.keys(files).map(key => (
            <div key={key} style={{display: key === active ? 'block' : 'none'}}>
              <CodeEditor
                size={size}
                lang={lang}
                value={files[key]}
                name={`files[${key.replace(/\./g, '*')}]`}
                onChange={onChange}
                mode="editor"
                onResize={this.handleResize}
                initialHeight={200}
              />
            </div>
          ))}
        </div>
        <div className="FilesEditor__tree">
          {!newFile && (
            <div className="FilesEditor__addFile">
              <IconButton icon="iconPlus" onClick={this.handleAddFile} />
            </div>
          )}
          {newFile && (
            <div className="FilesEditor__newFile">
              <Input
                ref={r => this.newFileRef = r}
                name="tmp[newFile]"
                fullWidth
                value=""
                handleBlur={() => this.setState({newFile: false})}
                handleKeyPress={this.handleNewFileKeyPress}
              />
            </div>
          )}
          <Tree
            ref={r => this.filesRef = r}
            tree={tree}
            renderNode={this.renderNode}
            paddingLeft={0}
          />
        </div>
      </div>
    );
  }
}
