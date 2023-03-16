import React from 'react';
import { toast } from 'react-toastify';
import request from '../../utils/request';
import {
  SLIDER_CREATE_FAIL,
  SLIDER_CREATE_REQUEST,
  SLIDER_CREATE_RESET,
  SLIDER_CREATE_SUCCESS,
  SLIDER_DELETE_FAIL,
  SLIDER_DELETE_REQUEST,
  SLIDER_DELETE_SUCCESS,
  SLIDER_LIST_FAIL,
  SLIDER_LIST_REQUEST,
  SLIDER_LIST_SUCCESS,
} from '../Constants/SliderConstants';
import { logout } from './userActions';
const ToastObjects = {
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  autoClose: 2000,
};
export const ListSlider = () => async (dispatch) => {
  try {
    dispatch({ type: SLIDER_LIST_REQUEST });
    const { data } = await request.get(`/slider`);
    dispatch({ type: SLIDER_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: SLIDER_LIST_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const deleteSlider = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: SLIDER_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
    };
    await request.delete(`/slider/${id}`, config);
    toast.success('Delete banner success', ToastObjects);
    dispatch({ type: SLIDER_DELETE_SUCCESS });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    toast.error(message, ToastObjects);
    if (message === 'Not authorized, token failed') {
      dispatch(logout());
    }
    dispatch({
      type: SLIDER_DELETE_FAIL,
      payload: message,
    });
  }
};

export const createSlider =
  ({ slider }) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: SLIDER_CREATE_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.accessToken}`,
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      };

      const { data } = await request.post(`/slider/`, slider, config);
      toast.success('Add banner success', ToastObjects);
      dispatch({ type: SLIDER_CREATE_SUCCESS, payload: data });
    } catch (error) {
      const message = error.response && error.response.data.message ? error.response.data.message : error.message;
      toast.error(message, ToastObjects);
      if (message === 'Not authorized, token failed') {
        dispatch(logout());
      }
      dispatch({
        type: SLIDER_CREATE_FAIL,
        payload: message,
      });
    }
  };

export const updateSlider =
  ({ slider, id }) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: SLIDER_CREATE_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.accessToken}`,
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      };

      const { data } = await request.put(`/slider/${id}`, slider, config);
      toast.success('Update banner success', ToastObjects);

      dispatch({ type: SLIDER_CREATE_SUCCESS, payload: data });
    } catch (error) {
      const message = error.response && error.response.data.message ? error.response.data.message : error.message;
      toast.error(message, ToastObjects);

      if (message === 'Not authorized, token failed') {
        dispatch(logout());
      }
      dispatch({
        type: SLIDER_CREATE_FAIL,
        payload: message,
      });
    }
  };
