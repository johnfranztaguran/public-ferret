import React from 'react';
import PropTypes from 'prop-types';
import {registerReducer, store} from '../../store';

export default class AsyncReducerLoader extends React.PureComponent {
    static propTypes = {
        namespace:PropTypes.string.isRequired,
        reducer: PropTypes.func.isRequired,
    };

    componentWillMount() {
        const { namespace, reducer} = this.props;
        registerReducer(store, namespace, reducer);
    }
    render() {
        const { namespace, reducer, ...rest} = this.props;
        return <this.props.component {...rest} />;
    }
}