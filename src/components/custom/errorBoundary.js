import React from 'react';
import {ErrorPage} from '../../';
class ErrorBoundary extends React.Component {
    state = {hasError:false}
    componentDidCatch(error, info) {
        this.setState({hasError:true, error, info}, () => console.error('error', error, 'info', info));
    }

    render() {
        const {hasError, ...rest} = this.state, {children} = this.props;
        return hasError ? <ErrorPage {...rest}  /> : children;
    }
}

export default ErrorBoundary;