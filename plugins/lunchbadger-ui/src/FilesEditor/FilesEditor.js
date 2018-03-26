import React, {PureComponent} from 'react';
import {PropTypes} from 'prop-types';
import Tree from 'react-ui-tree';
import cx from 'classnames';
import {CodeEditor} from '../';
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
      active: Object.keys(this.props.files)[0] || null,
    };
    this.codeEditorRefs = {};
  }

  renderNode = (node) => {
    const active = node.module === this.state.active;
    return (
      <span
        className={cx('node', {active})}
        onClick={this.onClickNode(node.module)}
      >
        {node.module}
      </span>
    );
  };

  onClickNode = active => () => {
    if (!active) return;
    this.setState({active}, this.dispatchResizeEvent);
  };

  dispatchResizeEvent = () => window.dispatchEvent(new Event('rndresized'));

  handleResize = size => this.setState({size});

  render () {
    const {lang, onChange, files} = this.props;
    const tree = {
      children: Object.keys(files).map(file => ({
        module: file,
        leaf: true,
      }))
    };
    const {active, size} = this.state;
    return (
      <div className="FilesEditor">
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
          <Tree
            tree={tree}
            renderNode={this.renderNode}
            paddingLeft={0}
          />
        </div>
      </div>
    );
  }
}
