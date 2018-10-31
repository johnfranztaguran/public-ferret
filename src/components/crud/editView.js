import React from 'react';
import PropTypes from 'prop-types';
import Input from '../uielements/input';
import { CrudCardWrapper } from './crudCard.style';

const renderFormFields = (item, onItemChange, customInputs) => {
    return Object.keys(item)
        .filter(key => key != 'id' && key != '_id')
        .map(attribute => {
            return (
                <div className="isoCrudCardInfos" key={attribute}>
                    <p className="isoInfoLabel">{`${attribute}`}</p>
                    {(customInputs && customInputs[attribute])
                        ? customInputs[attribute]
                        : <Input
                            placeholder={`${attribute}`}
                            value={item[attribute] || ''}
                            onChange={event => onItemChange(attribute, event.target.value)}
                        />
                    }
                </div>
            );
        });
};

const EditView = ({ item, customInputs, onItemChange}) => {
    const title = (item.first || item.last)
        ? `${item.first}${item.last}`
        : item.name ? item.name : 'No Name';

    const formFields = [];

    return (
        <CrudCardWrapper className="isoCrudCard">
            <div className="isoCrudCardHead">
                <h1 className="isoPersonName">{title}</h1>
            </div>
            <div className="isoCrudInfoWrapper">{renderFormFields(item, onItemChange, customInputs)}</div>
        </CrudCardWrapper>
    );
}

EditView.propTypes = {
    item: PropTypes.object.isRequired,
    onItemChange: PropTypes.func.isRequired,
    customInputs: PropTypes.shape({
        attribute: PropTypes.string.isRequired,
        input: PropTypes.element.isRequired
    })
}

export default EditView;
