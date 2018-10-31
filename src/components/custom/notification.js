import React from 'react';
import { notification, Spin, Button } from 'antd';
const noop = () => { };

const Notify = (props) => {
    const {
        children,
        hasAction = true,
        show,
        message,
        description,
        duration = 0,
        key = `open${Date.now()}`,
        onClick = noop,
        buttonText = 'Close'
    } = props;

    const btn = hasAction ? <Button type="primary" size="small" onClick={() => {
        notification.close(key);
        onClick();
    }}>
        {buttonText}
    </Button> : <span />

    const notify = () => notification.open({
        message,
        description,
        duration,
        btn,
        key
    });

    show && notify();
    !show && notification.destroy();

    return children;
}

export default Notify;
