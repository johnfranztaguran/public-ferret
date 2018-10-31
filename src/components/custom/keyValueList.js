import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';

const KeyValueList = ({ items, keyFormat, valueFormat }) => {
    keyFormat = keyFormat || {
        sm: { span: 8 },
        md: { span: 24 },
        lg: 8
    };
    valueFormat = valueFormat || {
        sm: { span: 15, offset: 1 },
        md: { span: 24, offset: 0 },
        lg: 15
    };
    return (
        <React.Fragment>
            {Object.keys(items).map(key => (
                <Row key={key}>
                    <Col {...keyFormat} className="detailsLabel">
                        {key}
                    </Col>
                    <Col {...valueFormat} className="detailsField">
                        {items[key]}
                    </Col>
                </Row>
            ))}
        </React.Fragment>
    );
};

KeyValueList.propTypes = {
    items: PropTypes.object.isRequired,
    keyFormat: PropTypes.object,
    valueFormat: PropTypes.object
};

export default KeyValueList;
