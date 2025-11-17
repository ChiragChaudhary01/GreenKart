import axios from "axios";
import { toast } from "react-toastify";

export const getAllProducts = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/products`,
      { withCredentials: true } // ✅ send cookie to backend
    );
    return response.data;
  } catch (error) {
    toast.error(error.response.data.error);
    console.error(error.response.data.error);
    throw error;
  }
};

export const getAllByPincode = async (pincode) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/products/bypincode/${pincode}`,
      {
        withCredentials: true,
      } // ✅ send cookie to backend
    );
    console.log("adfdas", pincode, response.data);
    return response.data;
  } catch (error) {
    toast.error(error.response.data.error);
    console.error(error.response.data.error);
    throw error;
  }
};

export const getAllFilteredProducts = async (pincode, name) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/products/filter`,
      {
        params: { name, pincode },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    toast.error(error.response.data.error);
    console.error(error.response.data.error);
    throw error;
  }
};

export const getProductDetails = async (id) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/product/${id}`,
      {
        withCredentials: true,
      } // ✅ send cookie to backend
    );
    return response.data;
  } catch (error) {
    toast.error(error.response.data.error);
    console.error(error.response.data.error);
    throw error;
  }
};

export const addToCart = async (id, quantity) => {
  console.log(id, quantity);
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/cart`,
      {
        product_id: id,
        quantity: quantity,
      },
      { withCredentials: true }
    );
    toast.success("Product added to cart succssesfully");
    return response.data;
  } catch (error) {
    toast.error(error.response.data.error);
    console.error(error.response.data.error);
    throw error;
  }
};

export const setQuantity = async (id, quantity) => {
  console.log(id, quantity);
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_SERVER_URL}/cart/${id}`,
      {
        quantity: quantity,
      },
      { withCredentials: true }
    );
    toast.success("Product added to cart succssesfully");
    return response.data;
  } catch (error) {
    toast.error(error.response.data.error);
    console.error(error.response.data.error);
    throw error;
  }
};

export const deleteFromCart = async (id) => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_SERVER_URL}/cart/${id}`,
      {
        withCredentials: true,
      } // ✅ send cookie to backend
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    toast.error(error.response.data.error);
    console.error(error.response.data.error);
    throw error;
  }
};

export const viewCart = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/cart`,
      {
        withCredentials: true,
      } // ✅ send cookie to backend
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    toast.error(error.response.data.error);
    console.error(error.response.data.error);
    throw error;
  }
};

export const viewAddress = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/address`,
      {
        withCredentials: true,
      } // ✅ send cookie to backend
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    toast.error(error.response.data.error);
    console.error(error.response.data.error);
    throw error;
  }
};

export const checkoutOrder = async (FormData) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/checkout`,
      {
        FormData,
      },
      {
        withCredentials: true,
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    toast.error(error.response.data.error);
    console.error(error.response.data.error);
    throw error;
  }
};
