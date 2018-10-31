import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Popover} from 'antd';
import authAction from '../../../reducers/auth/actions';
import appAction from '../../../reducers/app/actions';
import TopbarDropdownWrapper from './topbarDropdown.style';
import {history} from '../../../store';
import {Link} from '../../../router';
import { auth } from '../../../authService';
import Icon from '../Icon';

const {logout} = authAction;
const {closeAll} = appAction;

class TopbarUser extends Component {
    state = {
        visible: false
    };
    logout = () => {
        this.props.logout();

        setTimeout(() => {
            history.push('/signin');
        }, 100);
    }
    resetPassword = () =>
    hide = () => this.setState({visible: false});
    handleVisibleChange = () => this.setState({visible: !this.state.visible});
    render() {
        let user = auth.currentUser;
        const name = user && (user.name || user.username || user.email) || 'Guest';
        const content = (
            <TopbarDropdownWrapper className="isoUserDropdown">
                <a className="isoDropdownLink">
                    Settings
                </a>
                <a className="isoDropdownLink">
                    Feedback
                </a>
                <Link className="isoDropdownLink" to="/resetpassword">Reset Password</Link>
                <a className="isoDropdownLink" onClick={this.logout}>
                    Logout
                </a>
            </TopbarDropdownWrapper>
        );

        return user ?
            <Popover
                content={content}
                trigger="click"
                visible={this.state.visible}
                onVisibleChange={this.handleVisibleChange}
                arrowPointAtCenter={true}
                placement="bottomLeft"
            >
                <div style={{display: 'flex'}}>
                    <p style={{paddingRight: 15}}>Hello, {name}!</p>
                    <div className="isoImgWrapper">
                        <Icon iconSet='fa' name='user-circle' style={{fontSize:'3.5em', marginTop: '.5rem'}} />
                        <span className="userActivity online"/>
                    </div>
                </div>
            </Popover> : <Link to="/signin">Sign In</Link>
    }
}

export default connect(({Auth}) => ({...Auth}), {logout, closeAll})(TopbarUser);
