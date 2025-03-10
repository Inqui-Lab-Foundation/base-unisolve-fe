import axios from 'axios';

import {
    ADMIN_LOGIN_USER,
    ADMIN_LOGIN_USER_SUCCESS,
    ADMIN_LOGIN_USER_ERROR,
    ADMIN_LANGUAGE,
    GET_ADMINS
} from '../../../redux/actions.js';
import { URL, KEY } from '../../../constants/defaultValues.js';
import {
    setCurrentUser,
    getNormalHeaders,
    openNotificationWithIcon
} from '../../../helpers/Utils.js';

export const getAdminSuccess = (user) => async (dispatch) => {
    dispatch({
        type: ADMIN_LOGIN_USER_SUCCESS,
        payload: user
    });
};

export const getAdminError = (message) => async (dispatch) => {
    dispatch({
        type: ADMIN_LOGIN_USER_ERROR,
        payload: { message }
    });
};

export const getAdminByIdData = (id) => async (dispatch) => {
    try {
        dispatch({ type: GET_ADMINS });
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);
        const result = await axios
            .get(`${URL.getStudentById}${id}`, axiosConfig)
            .then((user) => user)
            .catch((err) => {
                return err.response;
            });
        if (result && result.status === 200) {
            const data =
                result.data && result.data.data[0] && result.data.data[0];
            dispatch(getAdminSuccess(data));
        } else {
            dispatch(getAdminError(result.statusText));
        }
    } catch (error) {
        dispatch(getAdminError({}));
    }
};

export const adminLoginUserSuccess = (user) => async (dispatch) => {
    dispatch({
        type: ADMIN_LOGIN_USER_SUCCESS,
        payload: user
    });
};

export const getAdminGlobalLanguage = (language) => async (dispatch) => {
    dispatch({
        type: ADMIN_LANGUAGE,
        payload: language
    });
};
export const adminLoginUserError = (message) => async (dispatch) => {
    dispatch({
        type: ADMIN_LOGIN_USER_ERROR,
        payload: { message }
    });
};

export const adminLoginUser = (data, history,module) => async (dispatch) => {
    try {
        const loginData = {
            ...data,
            passwordConfirmation: data.password
        };
        dispatch({ type: ADMIN_LOGIN_USER });
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);
        const result = await axios
            .post(`${URL.adminLogin}`, loginData, axiosConfig)
            .then((user) => user)
            .catch((err) => {
                return err.response;
            });
        if (result && result.status === 200) {
            const item = result.data;
            setCurrentUser(item);
            localStorage.setItem("module",module);
            dispatch(adminLoginUserSuccess(result));

            history.push('/admin/dashboard');
        } else {
            openNotificationWithIcon('error', 'Enter the correct credentials');
            dispatch(adminLoginUserError(result.statusText));
        }
    } catch (error) {
        dispatch(adminLoginUserError({}));
        // NotificationManager.error(
        //   "Server down! Please try again later.",
        //   "Error",
        //   3000
        // );
    }
};

export const adminLoginUserLogOut = (history) => async () => {
    try {
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);
        console.log(URL.adminLogOut);
        const result = await axios

            .get(`${URL.adminLogOut}`, axiosConfig)
            .then((user) => user)
            .catch((err) => {
                return err.response;
            });
        if (result && result.status === 200) {
            alert('hii');
            history.push('/admin');
            setCurrentUser();
            localStorage.removeItem('headerOption');
        }
    } catch (error) {
        console.log(error);
    }
};

export const deleteTempMentorById = async (id) => {
    try {
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);
        const result = await axios
            .delete(`${URL.deleteTempMentor}${id}/deleteAllData`, axiosConfig)
            .then((res) => res)
            .catch((err) => {
                return err.response;
            });
        console.log(result);
        if (result && result.status === 202) {
            openNotificationWithIcon(
                'success',
                result.data && result.data?.message
            );
        } else {
            openNotificationWithIcon(
                'error',
                result.data && result.data?.message
            );
        }
    } catch (error) {
        openNotificationWithIcon(
            'error',
            error.response.data && error.response.data?.message
        );
    }
};
