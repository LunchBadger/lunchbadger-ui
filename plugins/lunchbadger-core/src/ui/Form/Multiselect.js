import React, {Component} from 'react';
import Select from 'react-select-plus';
import cs from 'classnames';
import 'react-select-plus/dist/react-select-plus.css';
import getPlainText from '../utils/getPlainText';
import './Multiselect.scss';

class Multiselect extends Component {

  handleChange = (values) => {
    this.props.onChange(values);
    setTimeout(this.repositionMenu);
  };

  handleOpen = () => this.repositionMenu();

  repositionMenu = () => {
    if (!this.selectRef) return;
    setTimeout(() => {
      const selectDOM = this.selectRef.select.wrapper;
      const {bottom, left, width} = selectDOM.getBoundingClientRect();
      const menuDOM = selectDOM.getElementsByClassName('Select-menu-outer')[0];
      if (!menuDOM) return;
      let offsetLeft = 0;
      let offsetTop = 0;
      const RnDDOM = document.getElementsByClassName('RnD');
      if (RnDDOM.length === 1) {
        const {x, y} = RnDDOM[0].getBoundingClientRect();
        offsetLeft = x;
        offsetTop = y;
      }
      Object.assign(menuDOM.style, {
        position: 'fixed',
        top: `${bottom - offsetTop}px`,
        left: `${left - offsetLeft}px`,
        width: `${width}px`,
      });
    });
  };

  render() {
    const {
      name,
      options,
      multi,
      onChange,
      placeholder,
      value,
    } = this.props;
    const closeOnSelect = options.length === 0;
    return (
      <div className={cs('Multiselect', value.map(label => getPlainText(label)))}>
        <Select.Creatable
          ref={r => this.selectRef = r}
          multi={multi}
          name={name}
          options={options}
          value={value.map(label => ({label, value: label}))}
          clearable={multi}
          onChange={this.handleChange}
          closeOnSelect={closeOnSelect}
          placeholder={placeholder}
          onOpen={this.handleOpen}
          clearable={false}
        />
      </div>
    );
  }
}

export default Multiselect;
