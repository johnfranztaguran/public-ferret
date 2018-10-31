import React, { Component } from 'react';
import Popconfirm from '../feedback/popconfirm';
import Button from '../uielements/button';
import notification from '../notification';

export default class extends Component {
  render() {
      const { item, deleteItem } = this.props;
      let name = '';
      if (item.first) {
          name = `${item.first} `;
      }
      if (item.last) {
          name = `${name}${item.last}`;
      }
      if (item.name) {
          name = item.name;
      }
      if (!name) {
          name = 'No Name';
      }
      return (
          <Popconfirm
              title={`Delete ${name}?`}
              okText="DELETE"
              cancelText="No"
              onConfirm={() => {
                  notification('error', `${name} Deleted`, '');
                  deleteItem(item.id);
              }}
          >
              <Button icon="delete" type="button" className="isoDeleteBtn" />
          </Popconfirm>
      );
  }
}
