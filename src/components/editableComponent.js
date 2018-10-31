import React, { Component } from 'react';
import { Icon } from 'antd';
import { Textarea as Input } from './uielements/input';

export default class EditableComponent extends Component {
  state = {
    value: this.props.value,
    editable: false,
  };
  handleChange = ({target: {value}}) => this.setState({ value });
  edit = () => this.setState({ editable: true });
  check =() => {
    this.setState({ editable: false });
    if (this.props.onChange) {
      this.props.onChange(this.props.itemKey, this.state.value);
    }
  }

  render() {
    const { value, editable } = this.state;
    return (
      <div className="isoNoteContent">
        {editable ? (
          <div className="isoNoteEditWrapper">
            <Input
              rows={3}
              value={value}
              onChange={this.handleChange}
              onPressEnter={this.check}
            />
            <Icon
              type="check"
              className="isoNoteEditIcon"
              onClick={this.check}
            />
          </div>
        ) : (
          <p className="isoNoteTextWrapper" onClick={this.edit}>
            {value || ' '}
            <Icon type="edit" className="isoNoteEditIcon" />
          </p>
        )}
      </div>
    );
  }
}
