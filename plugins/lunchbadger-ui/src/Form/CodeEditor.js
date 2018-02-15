import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import AceEditor from 'react-ace';
import {ResizableBox} from 'react-resizable';
import brace from 'brace';
import 'brace/mode/javascript';
import 'brace/mode/java';
import 'brace/mode/python';
import 'brace/mode/csharp';
import 'brace/theme/monokai';
import './CodeEditor.scss';
import {EntityProperty, IconButton} from '../';

const options = {
  enableBasicAutocompletion: true,
  enableLiveAutocompletion: true,
  enableSnippets: true,
  showLineNumbers: true,
  tabSize: 2,
};
const isMultiline = str => /[\n\r]/g.test(str);

export default class CodeEditor extends PureComponent {
  static propTypes = {
    lang: PropTypes.string,
    onChange: PropTypes.func,
    onTab: PropTypes.func,
    value: PropTypes.string,
    fullWidth: PropTypes.bool,
    initialHeight: PropTypes.number,
    name: PropTypes.string,
    mode: PropTypes.string,
  };

  static defaultProps = {
    lang: 'javascript',
    fullWidth: false,
    initialHeight: 350,
    mode: 'both',
  };

  constructor(props) {
    super(props);
    const {mode, initialHeight, value: code} = props;
    const multiline = isMultiline(code);
    this.state = {
      editorMode: multiline || mode === 'editor',
      width: 9999,
      maxWidth: 0,
      height: initialHeight,
      code,
      mode: multiline ? 'editor' : mode,
    };
  }

  componentDidMount() {
    this.recalculateWidth();
    window.addEventListener('rndresized', this.recalculateWidth);
  }

  componentWillUnmount() {
    window.removeEventListener('rndresized', this.recalculateWidth);
  }

  recalculateWidth = () => {
    const {width, maxWidth} = this.state;
    const max = this.boxRef.getBoundingClientRect().width - 5;
    const state = {maxWidth: max};
    if (width > max || width === maxWidth) {
      state.width = max;
    }
    this.setState(state);
  }

  discardChanges = () => this.setState({code: this.props.value, mode: this.props.mode});

  changeCode = code => {
    const state = {code};
    if (this.props.mode === 'both') {
      state.mode = isMultiline(code) ? 'editor' : 'both';
    }
    this.setState(state, () => this.props.onChange(code));
  }

  handleModeSwitch = () => this.setState({editorMode: !this.state.editorMode});

  handleFunctionCodeResize = (_, {size: {width, height}}) => this.setState({width, height});

  handleInputChange = ({target: {value}}) => this.changeCode(value);

  handleEditorChange = (_, editor) => this.changeCode(editor.getValue());

  render() {
    const {lang, fullWidth, name, onTab} = this.props;
    const {width, maxWidth, height, editorMode, code, mode} = this.state;
    const icon = editorMode ? 'iconTextField' : 'iconCodeEditor';
    return (
      <div
        ref={r => this.boxRef = r}
        className={cs('CodeEditor', {editorMode})}
      >
        <div className="CodeEditor__input">
          <EntityProperty
            name={name}
            value={code}
            width="100%"
            onBlur={this.handleInputChange}
            onTab={onTab}
            placeholder=" "
          />
        </div>
        <div className="CodeEditor__editor">
          <ResizableBox
            width={width}
            height={height}
            minConstraints={[200, 100]}
            maxConstraints={[maxWidth, 2000]}
            onResize={this.handleFunctionCodeResize}
            axis={fullWidth ? 'y' : 'both'}
          >
            <AceEditor
              width={`${width}px`}
              height={`${height}px`}
              theme="monokai"
              mode={lang}
              value={code}
              onBlur={this.handleEditorChange}
              setOptions={options}
            />
          </ResizableBox>
        </div>
        {mode === 'both' && (
          <div className="CodeEditor__button">
            <IconButton icon={icon} onClick={this.handleModeSwitch} />
          </div>
        )}
      </div>
    );
  }
}
