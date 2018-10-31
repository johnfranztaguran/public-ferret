import React from 'react';
import PropTypes from 'prop-types';
import search from '../../search';
import _debounce from 'lodash.debounce';
import { Select, Spin, Form } from 'antd';

const Option = Select.Option;
const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
};
const page = { start: 1, limit: 10 };

class RelatedObjectSelector extends React.Component {
    state = {
        data: [],
        fetching: false
    };

    onSearch = async searchText => {
        const { model, getName } = this.props;
        this.setState({ data: [], fetching: true });
        const results = await search(model, ['name'], searchText, page);
        const data = results.map(result => ({
            text: getName ? getName(result) : result.name,
            value: result.id
        }));
        this.setState({ data, fetching: false });
    };

    handleChange = value => {
        const { onChange, fieldKey } = this.props;
        this.setState({ data: [], fetching: false });
        let newObj = null;
        if (Array.isArray(value)) {
            newObj = value.map(obj => ({
                name: obj.label,
                id: obj.key
            }));
            onChange(fieldKey, newObj.map(obj => obj.id));
        } else {
            newObj = {
                name: value.label,
                id: value.key
            };
            onChange(fieldKey, newObj.id);
        }
        onChange(`relatedObjects.${fieldKey}`, newObj);
    };

    render() {
        const { fetching, data } = this.state;
        const { mode, value, label } = this.props;
        const renderedValue =
            value &&
            (Array.isArray(value)
                ? value.map(obj => ({
                      key: obj.id,
                      label: obj.name
                  }))
                : { key: value.id, label: value.name });
        const layout = this.props.formItemLayout || formItemLayout;
        return (
            <Form.Item label={label} {...layout}>
                <Select
                    showSearch
                    mode={mode || 'default'}
                    labelInValue
                    value={renderedValue}
                    notFoundContent={fetching ? <Spin size="small" /> : null}
                    filterOption={false}
                    onSearch={_debounce(this.onSearch, 200)}
                    onChange={this.handleChange}
                    style={{ width: '100%' }}
                >
                    {data.map(d => (
                        <Option key={d.value} value={d.value}>
                            {d.text}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
        );
    }
}

RelatedObjectSelector.propTypes = {
    model: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    mode: PropTypes.string,
    fieldKey: PropTypes.string.isRequired,
    formItemLayout: PropTypes.object
};

export default RelatedObjectSelector;
