import axios from "axios";
import { toast } from "react-toastify";

export const getOrders = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/farmer/orders`,
      { withCredentials: true } // ✅ send cookie to backend
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    toast.error(error.response.data.error);
    console.error(error.response.data.error);
    throw error;
  }
};

export const getProducts = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/farmer/products`,
      { withCredentials: true } // ✅ send cookie to backend
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    toast.error(error.response.data.error);
    console.error(error.response.data.error);
    throw error;
  }
};

// Add product
export const addProduct = async (formData) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/farmer/products`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return res.data;
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.error || "Failed to add product");
    throw error;
  }
};

export const updateProducts = async (id, formData) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_SERVER_URL}/farmer/products/${id}`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.error || "Update failed");
    console.error(error);
    throw error;
  }
};
