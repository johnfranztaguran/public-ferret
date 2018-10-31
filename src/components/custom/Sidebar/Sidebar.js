import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import clone from 'clone';
import { Layout, Menu } from 'antd';
import { CustomScrollBar as Scrollbars, Logo, Icon } from '../../../';
import SidebarWrapper from './sidebar.style';
import appActions from '../../../reducers/app/actions';
import { Link } from '../../../router';
const { Sider } = Layout;
const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;
const {
    toggleOpenDrawer,
    changeOpenKeys,
    changeCurrent,
    toggleCollapsed
} = appActions;

const stripTrailingSlash = str => {
    if (str.substr(-1) === '/') {
        return str.substr(0, str.length - 1);
    }
    return str;
};

class Sidebar extends Component {
    static propTypes = {
        themes: PropTypes.object,
        themConfig: PropTypes.object,
        siteConfig: PropTypes.object
    };

    handleClick = e => {
        this.props.changeCurrent([e.key]);
        if (this.props.app.view === 'MobileView') {
            setTimeout(() => {
                this.props.toggleCollapsed();
                this.props.toggleOpenDrawer();
            }, 100);
        }
    }

    onOpenChange = newOpenKeys => {
        const { app, changeOpenKeys } = this.props;
        const latestOpenKey = newOpenKeys.find(
            key => !(app.openKeys.indexOf(key) > -1)
        );
        const latestCloseKey = app.openKeys.find(
            key => !(newOpenKeys.indexOf(key) > -1)
        );
        let nextOpenKeys = [];
        if (latestOpenKey) {
            nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
        }
        if (latestCloseKey) {
            nextOpenKeys = this.getAncestorKeys(latestCloseKey);
        }
        changeOpenKeys(nextOpenKeys);
    }

    getAncestorKeys = key => {
        const map = {
            sub3: ['sub2']
        };
        return map[key] || [];
    };

    getMenuItem = ({ singleOption, submenuStyle, submenuColor }, key) => {
        const { path, label, leftIcon, children, ...rest } = singleOption;
        if (children) {
            return (
                <SubMenu
                    key={key}
                    title={
                        <span className="isoMenuHolder" style={submenuColor}>
                            <Icon name={leftIcon} {...rest} />
                            <span className="nav-text">
                                {label}
                            </span>
                        </span>
                    }
                >
                    {children.map((child, i) => {
                        return (
                            <MenuItem style={submenuStyle} key={i}>
                                <Link style={submenuColor} to={child.path}>
                                    {child.label}
                                </Link>
                            </MenuItem>
                        );
                    })}
                </SubMenu>
            );
        }
        return (
            <MenuItem key={key}>
                <Link to={path}>
                    <span className="isoMenuHolder" style={submenuColor}>
                        <Icon name={leftIcon} {...rest} />
                        <span className="nav-text">
                            {label}
                        </span>
                    </span>
                </Link>
            </MenuItem>
        );
    };

    render() {
        const { app, toggleOpenDrawer, height, themes, themeConfig, siteConfig, options } = this.props;
        const collapsed = clone(app.collapsed) && !clone(app.openDrawer);
        const { openDrawer } = app;
        const mode = collapsed === true ? 'vertical' : 'inline';
        const onMouseEnter = event => {
            if (openDrawer === false) {
                toggleOpenDrawer();
            }
            return;
        };
        const onMouseLeave = () => {
            if (openDrawer === true) {
                toggleOpenDrawer();
            }
            return;
        };
        const customizedTheme = themes[themeConfig.theme];
        const styling = {
            backgroundColor: customizedTheme.backgroundColor
        };
        const submenuStyle = {
            backgroundColor: 'rgba(0,0,0,0.3)',
            color: customizedTheme.textColor
        };
        const submenuColor = {
            color: customizedTheme.textColor
        };

        return (
            <SidebarWrapper>
                <Sider
                    trigger={null}
                    collapsible={true}
                    collapsed={collapsed}
                    width={240}
                    className="isomorphicSidebar"
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    style={styling}
                >
                    <Logo collapsed={collapsed} siteConfig={siteConfig} />
                    <Scrollbars style={{ height: height - 70 }}>
                        <Menu
                            onClick={this.handleClick}
                            theme="dark"
                            className="isoDashboardMenu"
                            mode={mode}
                            openKeys={collapsed ? [] : app.openKeys}
                            selectedKeys={[`/${window.location.pathname.slice(1)}`]}
                            onOpenChange={this.onOpenChange}
                        >
                            {options.map((singleOption, i) => this.getMenuItem({
                                submenuStyle,
                                submenuColor,
                                singleOption
                            }, i))}
                        </Menu>
                    </Scrollbars>
                </Sider>
            </SidebarWrapper>
        );
    }
}

export default connect(
    state => ({
        app: state.App,
        height: state.App.height
    }),
    { toggleOpenDrawer, changeOpenKeys, changeCurrent, toggleCollapsed }
)(Sidebar);
