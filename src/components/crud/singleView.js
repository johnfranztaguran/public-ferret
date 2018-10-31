import React, { Component } from 'react';
import { CrudCardWrapper } from './crudCard.style';

export default class extends Component {
  render() {
    const { item } = this.props;
    const name = item.name ? item.name : 'No Name';
    const extraInfos = [];
    Object.keys(item).forEach(attribute => {
      const value = item[attribute];
      if (value) {
        extraInfos.push(
          <div className="isoCrudCardInfos" key={attribute}>
            <p className="isoInfoLabel">{`${attribute}`}</p>
            <p className="isoInfoDetails">{value}</p>
          </div>
        );
      }
    });
    return (
      <CrudCardWrapper className="isoCrudCard">
        <div className="isoCrudCardHead">
          <h1 className="isoPersonName">{name}</h1>
        </div>
        <div className="isoCrudInfoWrapper">{extraInfos}</div>
      </CrudCardWrapper>
    );
  }
}
