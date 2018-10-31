import Cookies from 'universal-cookie';
import actions from './actions';
import jwtDecode from 'jwt-decode';
import {history} from '../../store';;

const cookie = new Cookies();
const initState = cookie.get('hsjwt', {path: '/'}) ? jwtDecode(cookie.get('hsjwt', {path: '/'})) : {
    name: '',
    email: '',
    roles: [],
    exp: null
};

export default function authReducer(state = initState, action) {
    switch (action.type) {
        case actions.SET_CURRENT_USER: {
            delete action.data._id;
            delete action.data.iat;
            return {...state, ...action.data};
        }
        case actions.LOGOUT: {
            cookie.remove('hsjwt', {path: '/'})
            return initState;
        }
        default:
            return state;
    }
}

