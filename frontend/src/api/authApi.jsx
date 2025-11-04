import axios from "axios";
import { createContext, useContext } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { login_start, login_end, otp_start, otp_end } from "../store/loginSlice";

const authApi = createContext();

export default function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const signup = async (formData) => {
    dispatch(login_start());
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/auth/signup`,
        formData
      );
      console.log("singup:response", response);
      dispatch(login_end({ email: response.data.email, user_name: response.data.user_namem, role: response.data.role }));
      toast.success(`${response.data.user_name} first verify you account, OTP has sended to Your email.`);
      console.log("response", response);
      return response;
    } catch (error) {
      toast.error(error.response.data.error);
      console.error(error.response.data.error);
      dispatch(otp_end());
      throw error;
      // re-throw the error so handlesubmit can catch it in Signup
    }
  };

  const login = async (formData) => {
    dispatch(login_start());
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/auth/login`,
        formData
      );
      console.log("Login:response", response.data.message);
      if (response.data.isVerified) {
        toast.success(`${response.data.user_name} Wellcome to GreenKart`);
      } else {
        toast.success(`${response.data.user_name} first verify you account, OTP has sended to Your email.`);
      }
      dispatch(login_end({ email: response.data.email, user_name: response.data.user_name, role: response.data.role }));
      return response;
    } catch (error) {
      toast.error(error.response.data.error);
      console.error(error.response.data.error);
      dispatch(otp_end());
      throw error;
      // re-throw the error so handlesubmit can catch it in Login
    }
  };

  const verifyOTP = async (formData) => {
    dispatch(otp_start());
    console.log("formData", formData);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/auth/verify-otp`,
        formData
      );
      console.log("verifyOTP:response", response.data.message);
      toast.success(`${response.data.user_name} Wellcome to GreenKart`);
      dispatch(otp_end());
      return response;
    } catch (error) {
      toast.error(error.response.data.error);
      console.error(error.response.data.error);
      dispatch(otp_end());
      throw error;
      // re-throw the error so handlesubmit can catch it in Veryfy-OTP
    }
  };

  const resendOTP = async (formData) => {
    dispatch(otp_start());
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/auth/resend-otp`,
        formData
      );
      console.log("resendOTP:response", response.data.message);
      dispatch(otp_end());
      return response;
    } catch (error) {
      toast.error(error.response.data.error);
      console.error(error.response.data.error);
      dispatch(otp_end());
      throw error;
      // re-throw the error so handlesubmit can catch it in verify_OTP
    }
  };

  const changePassword = async (formData) => {
    dispatch(otp_start());
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/auth/change-password`,
        formData
      );
      console.log("changepassword:response", response);
      dispatch(otp_end());
      return response;
    } catch (error) {
      toast.error(error);
      console.error(error);
      dispatch(otp_end());
      throw error;
      // re-throw the error so handlesubmit can catch it in ChangePassword
    }
  };
  return (
    <authApi.Provider
      value={{ signup, login, verifyOTP, resendOTP, changePassword }}
    >
      {children}
    </authApi.Provider>
  );
};

export const useAuth = () => useContext(authApi);
