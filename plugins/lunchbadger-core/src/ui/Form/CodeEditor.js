import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import AceEditor from 'react-ace';
import brace from 'brace';
import 'brace/mode/dot';
import 'brace/mode/golang';
import 'brace/mode/java';
import 'brace/mode/javascript';
import 'brace/mode/php';
import 'brace/mode/python';
import 'brace/mode/ruby';
import 'brace/theme/monokai';
import 'brace/ext/language_tools';
import 'brace/ext/searchbox';
import './CodeEditor.scss';
import {EntityProperty, IconButton, Resizable} from '../';

const options = {
  enableBasicAutocompletion: true,
  enableLiveAutocompletion: true,
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
    onResize: PropTypes.func,
    size: PropTypes.object,
    inline: PropTypes.bool,
  };

  static defaultProps = {
    lang: 'javascript',
    fullWidth: false,
    initialHeight: 350,
    mode: 'both',
    inline: false,
  };

  constructor(props) {
    super(props);
    const {mode, initialHeight, value: code, inline} = props;
    const multiline = isMultiline(code);
    const editorMode = inline ? false : (multiline || mode === 'editor');
    this.state = {
      editorMode,
      width: 9999,
      maxWidth: 0,
      height: initialHeight,
      code,
      mode: inline ? 'both' : (multiline ? 'editor' : mode),
    };
  }

  componentDidMount() {
    this.recalculateWidth();
    window.addEventListener('rndresized', this.recalculateWidth);
    window.addEventListener('rnddragged', this.recalculateTooltips);
  }

  componentWillReceiveProps(nextProps) {
    const {size} = nextProps;
    if (size) {
      const {width, height} = size;
      if (this.state.width !== width || this.state.height !== height) {
        this.setState({width, height});
      };
    }
  }

  componentWillUnmount() {
    window.removeEventListener('rndresized', this.recalculateWidth);
    window.removeEventListener('rnddragged', this.recalculateTooltips);
    if (this.style) {
      document.getElementsByTagName('head')[0].removeChild(this.style);
    }
  }

  recalculateWidth = () => {
    const {width, maxWidth} = this.state;
    const rect = this.boxRef.getBoundingClientRect();
    const max = Math.max(0, Math.round(rect.width) - 55);
    const state = {maxWidth: max};
    if (width > max || width === maxWidth) {
      state.width = max;
    }
    this.setState(state);
  }

  recalculateTooltips = () => {
    const RnDDOM = document.getElementsByClassName('RnD');
    if (RnDDOM.length === 1) {
      const {x, y} = RnDDOM[0].getBoundingClientRect();
      if (!this.style) {
        this.style = document.createElement('style');
        this.style.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(this.style);
      }
      this.style.innerHTML = `.ace_tooltip {transform: translate(${-x}px, ${-y}px);}`;
    }
  };

  discardChanges = () => this.setState({code: this.props.value, mode: this.props.mode});

  changeCode = code => {
    const {mode, onChange, inline} = this.props;
    const state = {code};
    if (!inline && mode === 'both') {
      state.mode = isMultiline(code) ? 'editor' : 'both';
    }
    this.setState(state, () => onChange && onChange(code));
  }

  handleModeSwitch = () => this.setState({editorMode: !this.state.editorMode});

  handleFunctionCodeResize = (_, {size}) => {
    this.inpRef.focus();
    this.inpRef.blur();
    const width = Math.floor(size.width);
    const height = Math.floor(size.height);
    this.setState({width, height});
  };

  handleResizeStop = (_, {size}) => {
    const {onResize} = this.props;
    onResize && onResize(size);
  };

  handleInputChange = ({target: {value}}) => this.changeCode(value);

  handleEditorChange = value => this.changeCode(value);

  render() {
    const {lang, fullWidth, name, onTab, inline} = this.props;
    const {width, maxWidth, height, editorMode, code, mode} = this.state;
    const icon = editorMode ? 'iconTextField' : 'iconCodeEditor';
    const multiline = isMultiline(code);
    const inlineMultiline = inline && multiline;
    return (
      <div
        ref={r => this.boxRef = r}
        className={cs('CodeEditor', {editorMode, inlineMultiline})}
      >
        <div className="CodeEditor__input">
          {inlineMultiline && (
            <div onClick={this.handleModeSwitch}>
              <EntityProperty
                name={name}
                value={code}
                hidden
              />
              <div className="CodeEditor__trimmed" style={{width: maxWidth}}>
                {code}
              </div>
            </div>
          )}
          {!inlineMultiline && (
            <EntityProperty
              name={name}
              value={code}
              width="100%"
              onBlur={this.handleInputChange}
              onTab={onTab}
              placeholder=" "
            />
          )}
        </div>
        <div className="CodeEditor__editor">
          <Resizable
            width={width}
            height={height}
            maxWidth={maxWidth}
            onResize={this.handleFunctionCodeResize}
            onResizeStop={this.handleResizeStop}
            fullWidth={fullWidth}
          >
            <AceEditor
              width={`${width}px`}
              height={`${height}px`}
              theme="monokai"
              mode={lang}
              value={code}
              onChange={this.handleEditorChange}
              setOptions={options}
              wrapEnabled
              editorProps={{
                $blockScrolling: Infinity
              }}
            />
          </Resizable>
        </div>
        {mode === 'both' && (
          <div className="CodeEditor__button">
            <IconButton icon={icon} onClick={this.handleModeSwitch} />
          </div>
        )}
        <input
          className="CodeEditor__indicator"
          ref={r => this.inpRef = r}
        />
      </div>
    );
  }
}
