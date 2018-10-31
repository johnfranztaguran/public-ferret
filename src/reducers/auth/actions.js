const actions = {
    CHECK_AUTHORIZATION: 'CHECK_AUTHORIZATION',
    LOGIN_REQUEST: 'LOGIN_REQUEST',
    LOGOUT: 'LOGOUT',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_ERROR: 'LOGIN_ERROR',
    SET_CURRENT_USER: 'SET_CURRENT_USER',
    CLEAR_LOGIN: 'CLEAR_LOGIN',
    checkAuthorization: () => ({type: actions.CHECK_AUTHORIZATION}),
    login: () => ({
        type: actions.LOGIN_REQUEST
    }),
    logout: () => {
        return ({
            type: actions.LOGOUT
        })
    }
};
export default actions;
