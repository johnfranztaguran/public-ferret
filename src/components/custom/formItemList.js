import React from 'react';
import PropTypes from 'prop-types';
import { Button, Divider, Icon } from 'antd';

class FormItemList extends React.Component {
    addItem = () => {
        const { items, newItemTemplate, fieldKey, onChange } = this.props;
        let newItem = { ...newItemTemplate, id: `new${items.length}` };
        items.push(newItem);
        onChange(fieldKey, items);
    };

    removeItem = index => {
        const { items, onChange, fieldKey } = this.props;
        items.splice(index, 1);
        onChange(fieldKey, items);
    };

    makePrimary = item => {
        const { onChange, primaryKey } = this.props;
        onChange(primaryKey, item || undefined);
    };

    render() {
        const {
            items,
            title,
            primaryId,
            primaryKey,
            renderItemFields
        } = this.props;
        return (
            <fieldset>
                <Divider />
                <h4>{title}</h4>
                {items.map((item, index) => (
                    <div key={index}>
                        {renderItemFields(item, index, items)}

                        <Button
                            onClick={() => {
                                if (primaryKey && item.id === primaryId) {
                                    this.makePrimary();
                                }
                                this.removeItem(index);
                            }}
                        >
                            <Icon type="minus" theme="outlined" />
                        </Button>
                        {primaryKey &&
                            (item.id !== primaryId ? (
                                <Button
                                    onClick={() => {
                                        this.makePrimary(item);
                                    }}
                                >
                                    <Icon type="star" theme="outlined" /> Make
                                    Primary
                                </Button>
                            ) : (
                                <p>Primary</p>
                            ))}
                        <Divider />
                    </div>
                ))}
                <Button onClick={this.addItem}>
                    <Icon type="plus" theme="outlined" />
                </Button>
            </fieldset>
        );
    }
}

FormItemList.propTypes = {
    items: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    renderItemFields: PropTypes.func.isRequired,
    fieldKey: PropTypes.string.isRequired,
    primaryKey: PropTypes.string,
    primaryId: PropTypes.string
};

export default FormItemList;
