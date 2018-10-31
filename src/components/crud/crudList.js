import React, { Component } from 'react';
import { InputSearch } from '../uielements/input';
import DeleteButton from './deleteButton';
import { PropTypes } from 'prop-types';
import { CrudListWrapper } from './crudList.style';
import Scrollbar from '../utility/customScrollBar';

function filterItems(items, search) {
    search = search.toUpperCase();
    return search
        ? items.filter(item => item.name.toUpperCase().includes(search))
        : items;
}

export default class CrudList extends Component {
    constructor(props) {
        super(props);
        this.singleItem = this.singleItem.bind(this);
        this.onChange = this.onChange.bind(this);
        this.state = {
            search: ''
        };
    }
    singleItem(item, index) {
        const { selectedId, deleteItem, changeItem, getItemName } = this.props;
        const activeClass = selectedId === item.id ? 'active' : '';
        const onChange = () => changeItem(item);
        const itemName = getItemName ? getItemName(item) : item.name;
        return (
            <div
                key={index}
                className={`${activeClass} isoSingleItem`}
                onClick={onChange}
            >
                <div className="isoAvatar">
                    {item.avatar ? <img alt="#" src={item.avatar} /> : ''}
                </div>
                <div className="isoCrudName">
                    <h3>{itemName}</h3>
                </div>
                <DeleteButton deleteItem={deleteItem} item={item} />
            </div>
        );
    }
    onChange(event) {
        const { onSearch } = this.props;
        this.setState({ search: event.target.value });
        onSearch && onSearch(event.target.value);
    }
    render() {
        const { search } = this.state;
        const { items } = this.props;

        return (
            <CrudListWrapper className="isoCrudListWrapper">
                <InputSearch
                    placeholder="Search"
                    value={search}
                    onChange={this.onChange}
                    className="isoSearchBar"
                />
                {items && items.length > 0 ? (
                    <div className="isoCrudList">
                        <Scrollbar className="itemListScrollbar">
                            {items.map((item, i) => this.singleItem(item, i))}
                        </Scrollbar>
                    </div>
                ) : (
                    <span className="isoNoResultMsg">None Found</span>
                )}
            </CrudListWrapper>
        );
    }
}
