import axios from "axios";
import { toast } from "react-toastify";

export const getAllUsers = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/admin/users`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    toast.error(error.response.data.error);
    console.error(error.response.data.error);
    throw error;
  }
};

export const getAllProducts = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/admin/products`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    toast.error(error.response.data.error);
    console.error(error.response.data.error);
    throw error;
  }
};

export const getAllOrders = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/admin/orders`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    toast.error(error.response.data.error);
    console.error(error.response.data.error);
    throw error;
  }
};

export const approveProduct = async (id) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_SERVER_URL}/admin/products/${id}/approve`,
      { status: "approved" },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    toast.error(error.response.data.error);
    console.error(error.response.data.error);
    throw error;
  }
};

export const rejecteProduct = async (id) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_SERVER_URL}/admin/products/${id}/approve`,
      { status: "rejected" },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    toast.error(error.response.data.error);
    console.error(error.response.data.error);
    throw error;
  }
};

export const assignOrder = async (order_id, delivery_person_id) => {
  console.log(order_id, delivery_person_id);
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/admin/orders/${order_id}/assign`,
      { delivery_person_id },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    toast.error(error.response.data.error);
    console.error(error.response.data.error);
    throw error;
  }
};
