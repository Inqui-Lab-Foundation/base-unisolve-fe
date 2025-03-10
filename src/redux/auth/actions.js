import axios from 'axios';

import { LOGIN_USER, LOGIN_USER_SUCCESS, LOGIN_USER_ERROR, STEP_TWO_DATA } from '../actions';
import { URL, KEY } from '../../constants/defaultValues';
import {
    setCurrentUser,
    getNormalHeaders,
    openNotificationWithIcon
} from '../../helpers/Utils';

export const loginUserSuccess = (user) => async (dispatch) => {
    dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: user
    });
};
export const registerStepData = (stepData) => async (dispatch) => {
    dispatch({
        type: STEP_TWO_DATA,
        payload: stepData
    });
};
export const loginUserError = (message) => async (dispatch) => {
    dispatch({
        type: LOGIN_USER_ERROR,
        payload: { message }
    });
};

export const loginUser = (data, history,module) => async (dispatch) => {
    console.log('========data', URL.login);
    try {
        const loginData = {
            ...data,
            passwordConfirmation: data.password
        };
        dispatch({ type: LOGIN_USER });
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);

        const result = await axios
            .post(`${URL.login}`, loginData, axiosConfig)
            .then((user) => user)
            .catch((err) => {
                return err.response;
            });
        if (result && result.status === 200) {
            const item = result.data;
            console.log('============', item);
            setCurrentUser(item);
            localStorage.setItem("module",module);
            dispatch(loginUserSuccess(result));
            history.push('/dashboard');
        } else {
            dispatch(loginUserError(result.statusText));
            openNotificationWithIcon(
                'error',
                'Enter the correct credentials'
            );
        }
    } catch (error) {
        dispatch(loginUserError({}));
        // NotificationManager.error(
        //   "Server down! Please try again later.",
        //   "Error",
        //   3000
        // );
    }
};

export const loginUserLogOut = (history) => async () => {
    try {
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);
        const result = await axios
            .get(`${URL.logOut}`, axiosConfig)
            .then((user) => user)
            .catch((err) => {
                return err.response;
            });
        if (result && result.status === 200) {
            setCurrentUser();
            localStorage.removeItem('headerOption');
            history.push('/login');
        }
    } catch (error) {
        console.log('error');
    }
};
