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

const windowWidth = window.innerWidth;
const initialEditorCodeWidth = Math.floor(windowWidth * 0.75);
const maxWidth = windowWidth - 170;
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
      width: initialEditorCodeWidth,
      height: initialHeight,
      code,
      mode: multiline ? 'editor' : mode,
    };
  }

  componentDidMount() {
    if (this.props.fullWidth) {
      this.setState({width: this.boxRef.getBoundingClientRect().width});
    }
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

  handleEditorChange = code => this.changeCode(code);

  render() {
    const {lang, fullWidth, initialHeight, name} = this.props;
    const {width, height, editorMode, code, mode} = this.state;
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
            placeholder=" "
          />
        </div>
        <div className="CodeEditor__editor">
          <ResizableBox
            width={fullWidth ? width : initialEditorCodeWidth}
            height={initialHeight}
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
              onChange={this.handleEditorChange}
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
