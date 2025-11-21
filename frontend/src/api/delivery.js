import axios from "axios";
import { toast } from "react-toastify";

export const getOrders = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/delivery/orders`,
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

export const updateStatus = async (id, status) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_SERVER_URL}/delivery/orders/${id}`,
      { status },
      { withCredentials: true } // ✅ send cookie to backend
    );
    toast.success(`Delivery status updated to ${status}`);
    return response.data;
  } catch (error) {
    toast.error(error.response.data.error);
    console.error(error.response.data.error);
    throw error;
  }
};
