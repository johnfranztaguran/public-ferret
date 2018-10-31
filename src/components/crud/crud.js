import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Layout, Icon } from 'antd';
import Button from '../uielements/button';
import CrudList from './crudList';
import DeleteButton from './deleteButton';
import { CrudWrapper } from './crud.style';
import Scrollbar from '../utility/customScrollBar.js';
import _set from 'lodash.set';
import search from '../../search';

const SHOW = 'SHOW';
const EDIT = 'EDIT';
const ADD = 'ADD';

const { Content } = Layout;
const page = { start: 1, limit: 10 };

class CRUD extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeView: SHOW,
            selectedItem: undefined,
            newItem: {},
            items: props.stubbedItems || [],
            searchText: ''
        };
    }

    componentDidMount() {
        this.fetchItems();
    }

    fetchItems = async () => {
        try {
            const items =
                this.props.stubbedItems ||
                (await search(this.props.model, [], '', page));
            this.setState({ items });
        } catch (err) {
            console.error('Error while fetching items:', err);
        }
    };

    onSearch = async searchText => {
        const { searchFields, stubbedItems, model } = this.props;
        const items =
            (stubbedItems &&
                stubbedItems.filter(item => {
                    return searchFields.some(field =>
                        item[field].includes(searchText)
                    );
                })) ||
            (await search(model, searchFields, searchText, page));
        this.setState({ items, searchText });
    };

    afterChangeItems = async item => {
        const { searchText } = this.state;
        const fieldsToSearch = searchText ? this.props.searchFields : [];
        const newItems =
            this.props.stubbedItems ||
            (await search(this.props.model, fieldsToSearch, searchText, page));
        if (item) {
            const itemIndex = newItems.findIndex(
                itemInList => itemInList.id === item.id
            );
            if (!(itemIndex > -1)) {
                newItems.unshift(item);
            }
        }
        this.setState({
            items: newItems
        });
    };

    saveEdits = async (item, operation) => {
        const updatedItem =
            (this.props.stubbedItems && item) ||
            (await operation({
                conditions: { id: item.id },
                fields: item
            }));
        await this.afterChangeItems(updatedItem);
        return updatedItem;
    };

    addItem = async newItem =>
        await this.saveEdits(newItem, this.props.model.insertOne);

    editItem = async selectedItem =>
        await this.saveEdits(selectedItem, this.props.model.updateOne);

    deleteItem = async itemId => {
        if (!this.props.stubbedItems) {
            await this.props.model.removeOne({
                conditions: { id: itemId }
            });
            await this.afterChangeItems();
        } else {
            const { items } = this.state;
            const itemIndex = items.findIndex(item => item.id === itemId);
            items.splice(itemIndex);
        }
        this.switchItem();
    };

    refreshItem = async itemId => {
        const refreshedItem = await this.props.model.findOne({
            conditions: { id: itemId }
        });
        await this.afterChangeItems(refreshedItem);
        this.switchItem(refreshedItem);
    };

    componentDidUpdate = (prevProps, prevState) => {
        if (
            prevState.items.length === 0 &&
            this.state.items.length != 0 &&
            !prevState.selectedItem
        ) {
            this.switchItem(this.state.items[0]);
        }
    };

    onChange = (field, value) => {
        const { activeView } = this.state;
        const stateKey = activeView === ADD ? 'newItem' : 'selectedItem';
        const fieldKey = Array.isArray(field)
            ? (field.unshift(stateKey), field)
            : `${stateKey}.${field}`;
        const newState = _set(this.state, fieldKey, value);
        this.setState(newState);
    };

    removePlaceholderIds = (objectWithPlaceholders, prefix) => {
        Object.keys(objectWithPlaceholders).forEach(key => {
            if (typeof objectWithPlaceholders[key] === 'object') {
                this.removePlaceholderIds(objectWithPlaceholders[key], prefix);
            } else {
                if (
                    key === 'id' &&
                    typeof objectWithPlaceholders[key] === 'string' &&
                    objectWithPlaceholders[key].indexOf(prefix) === 0
                ) {
                    delete objectWithPlaceholders[key];
                }
            }
        }, this);
    };

    setRelatedObject = async (
        query,
        modelOperation,
        field,
        selects = ['name', 'id']
    ) => {
        try {
            const relatedObject = await modelOperation({
                conditions: { id: query },
                selects
            });
            const newSelectedItem = _set(
                this.state.selectedItem,
                'relatedObjects.' + field,
                relatedObject
            );
            this.setState({
                selectedItem: newSelectedItem
            });
        } catch (err) {
            console.error('Error while fetching related objects:', err);
        }
    };

    switchItem = selectedItem => {
        const { getRelatedObjects } = this.props;
        const { items } = this.state;
        const newItem = selectedItem || (items && items[0]) || undefined;
        this.setState({
            selectedItem: newItem,
            newItem: {}
        });
        if (getRelatedObjects && newItem) {
            getRelatedObjects(newItem, this.setRelatedObject);
        }
        this.setView(SHOW);
    };

    setView = view => this.setState({ activeView: view });

    actionButtons = () => {
        const { activeView, selectedItem, newItem } = this.state;
        return activeView === EDIT || activeView === ADD ? (
            <Button
                type="button"
                onClick={async () => {
                    let isEdit = activeView === EDIT;
                    this.removePlaceholderIds(
                        isEdit ? selectedItem : newItem,
                        'new'
                    );
                    const selected = isEdit
                        ? await this.editItem(selectedItem)
                        : await this.addItem(newItem);
                    this.switchItem(selected);
                }}
            >
                <Icon type="check" />
            </Button>
        ) : (
            <Button type="button" onClick={() => this.setView(EDIT)}>
                <Icon type="edit" />}
            </Button>
        );
    };

    render() {
        const {
            showView,
            editView,
            addView,
            getItemName,
            secondaryControls
        } = this.props;
        const { items, activeView, selectedItem, newItem } = this.state;

        return (
            <CrudWrapper
                className="isomorphicItems"
                style={{ background: 'none' }}
            >
                <div className="isoCrudListBar">
                    <CrudList
                        items={items}
                        getItemName={getItemName}
                        selectedId={selectedItem && selectedItem.id}
                        changeItem={this.switchItem}
                        deleteItem={this.deleteItem}
                        onSearch={this.onSearch}
                    />
                </div>
                <Layout className="isoCrudBoxWrapper">
                    {selectedItem ? (
                        <Content className="isoCrudBox">
                            <div className="isoCrudControl">
                                {this.actionButtons()}
                                <DeleteButton
                                    deleteItem={this.deleteItem}
                                    item={selectedItem}
                                />
                                {secondaryControls && (
                                    <div className="secondaryControls">
                                        {secondaryControls(selectedItem)}
                                    </div>
                                )}

                                <Button
                                    type="primary"
                                    onClick={() => {
                                        this.setState({
                                            selectedItem: undefined
                                        });
                                        this.setView(ADD);
                                    }}
                                    className="isoAddItemBtn"
                                >
                                    New
                                </Button>
                            </div>

                            <Scrollbar className="crudBoxScrollbar">
                                {activeView === SHOW &&
                                    showView(selectedItem, this.refreshItem)}
                                {activeView === EDIT &&
                                    editView(selectedItem, this.onChange)}
                                {activeView === ADD &&
                                    addView(newItem, this.onChange)}
                            </Scrollbar>
                        </Content>
                    ) : (
                        <Content className="isoCrudBox">
                            <div className="isoCrudControl">
                                {activeView === ADD && this.actionButtons()}
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        this.setState({
                                            selectedItem: undefined
                                        });
                                        this.setView(ADD);
                                    }}
                                    className="isoAddItemBtn"
                                >
                                    New
                                </Button>
                            </div>

                            {activeView === ADD && (
                                <Scrollbar className="crudBoxScrollbar">
                                    {addView(
                                        newItem,
                                        this.onChange,
                                        newItem.relatedObjects
                                    )}
                                </Scrollbar>
                            )}
                        </Content>
                    )}
                </Layout>
            </CrudWrapper>
        );
    }
}

CRUD.propTypes = {
    showView: PropTypes.func.isRequired,
    editView: PropTypes.func.isRequired,
    addView: PropTypes.func.isRequired,
    model: PropTypes.object.isRequired,
    searchFields: PropTypes.array.isRequired,
    getItemName: PropTypes.func,
    stubbedItems: PropTypes.array,
    secondaryControls: PropTypes.func
};

CRUD.defaultProps = {
    showView: () => {},
    editView: () => {},
    addView: () => {}
};

export default CRUD;
