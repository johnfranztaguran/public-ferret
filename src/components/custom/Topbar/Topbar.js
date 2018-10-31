import React, {Component} from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {Layout, Icon} from "antd";
import appActions from "../../../reducers/app/actions";
import TopbarUser from "./topbarUser";
import TopbarWrapper from "./topbar.style";

const {Header} = Layout;
const {toggleCollapsed} = appActions;


class Topbar extends Component {
    static propTypes = {
        themes: PropTypes.object,
        themeConfig: PropTypes.object
    };

    render() {
        const {toggleCollapsed, themes, themeConfig} = this.props;
        const customizedTheme = themes[themeConfig.theme];
        const collapsed = this.props.collapsed && !this.props.openDrawer;
        const styling = {
            background: customizedTheme.backgroundColor,
            position: "fixed",
            width: "100%",
            height: 70
        };

        return (
            <TopbarWrapper>
                <Header
                    style={styling}
                    className={
                        collapsed ? "isomorphicTopbar collapsed" : "isomorphicTopbar"
                    }
                >
                    <div className="isoLeft">
                        <button
                            className={collapsed ? "triggerBtn " : "triggerBtn "}
                            style={{border:'none', background:'transparent'}}
                            onClick={toggleCollapsed}
                        ><Icon style={{fontSize:'2em'}} type={collapsed ? 'menu-unfold' : 'menu-fold'}/></button>
                    </div>

                    <ul className="isoRight" style={{listStyleType:'none'}}>
                        <li
                            onClick={() => this.setState({selectedItem: "user"})}
                            className="isoUser"
                        >
                            <TopbarUser/>
                        </li>
                    </ul>
                </Header>
            </TopbarWrapper>
        );
    }
}

export default connect(state => ({...state.App}), {toggleCollapsed})(Topbar);
