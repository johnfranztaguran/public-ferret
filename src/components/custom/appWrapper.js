import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import { Debounce } from 'react-throttle';
import authAction from '../../reducers/auth/actions';
import appActions from '../../reducers/app/actions';
import Sidebar from './Sidebar/Sidebar';
import Topbar from './Topbar/Topbar';
import AppHolder from './appWrapper.style';
import ErrorBoundary from './errorBoundary';
import { themeConfig, siteConfig } from '../../settings';
import themes from "../../settings/themes";
const { Content, Footer } = Layout;
const { logout } = authAction;
const { toggleAll } = appActions;

class WindowResizeListener extends React.Component {
    componentDidMount() {
        this.props.toggleAll(window.innerWidth, window.innerHeight);
        window.addEventListener('resize', () => this.props.toggleAll(window.innerWidth, window.innerHeight))
    }

    componentWillUnmount() {
        window.removeEventListener('resize', () => this.props.toggleAll(window.innerWidth, window.innerHeight))
    }

    render() {
        return <div>{this.props.children}</div>;
    }
}

export class App extends Component {
    static propTypes = {
        toggleAll: PropTypes.func,
        options: PropTypes.array
    };

    render() {
        const { height, children, options, toggleAll, match: { url } } = this.props;
        const appHeight = window.innerHeight;

        return (
            <AppHolder>
                <Layout style={{ height: appHeight }}>
                    <Debounce time="1000" handler="onResize">
                        <WindowResizeListener toggleAll={toggleAll} />
                    </Debounce>
                    <Topbar themes={themes} themeConfig={themeConfig} url={url} />
                    <Layout style={{ flexDirection: 'row', overflowX: 'hidden' }}>
                        <Sidebar
                            options={options}
                            url={url}
                            siteConfig={siteConfig}
                            themeConfig={themeConfig}
                            themes={themes}
                        />
                        <Layout className="isoContentMainLayout" style={{ height }}>
                            <Content
                                className="isomorphicContent"
                                style={{
                                    padding: '70px 0 0',
                                    flexShrink: '0',
                                    background: '#f1f3f6',
                                    position: 'relative'
                                }}
                            >
                                <ErrorBoundary>{children}</ErrorBoundary>
                            </Content>
                            <Footer
                                style={{
                                    background: '#ffffff',
                                    textAlign: 'center',
                                    borderTop: '1px solid #ededed'
                                }}
                            >
                                {siteConfig.footerText}
                            </Footer>
                        </Layout>
                    </Layout>
                </Layout>
            </AppHolder>
        );
    }
}

export default connect(
    state => ({
        auth: state.Auth,
        height: state.App.height
    }),
    { logout, toggleAll }
)(App);
