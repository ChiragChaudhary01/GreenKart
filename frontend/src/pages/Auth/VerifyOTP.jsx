import { Form, Formik, Field, ErrorMessage } from "formik";
import { object, string, ref } from "yup";
import { useAuth } from "../../api/authApi.jsx";
import Button from "../../UI/Button.jsx";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";

const otpSchema = object().shape({
    otp: string()
        .required('otp is required')
        .min(6, 'otp Must be at least 6 characters')
});


export default function verifyOTP() {
    const { verifyOTP, resendOTP } = useAuth();
    const isLoading = useSelector((state) => state.login.loading);
    const email = useSelector((state) => state.login.email);
    console.log("email", email);

    const navigate = useNavigate();

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            values.email = email;
            const response = await verifyOTP(values);
            console.log("Email verified successfully", response);
            navigate("/products");
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleResendOTP = async () => {
        try {
            const response = await resendOTP({ email });
            console.log("Email verified successfully", response);
            toast.success("OTP resended successfully");
        } catch (error) {
            console.error(error);
        }
    };

    const goSignup = () => {
        navigate("/signup");
    };

    return (
        <div className="bg-gray-50 flex justify-center items-center h-lvh">
            <div className="flex justify-center flex-col gap-6 items-center">
                <div className="flex flex-col items-center gap-2">
                    <h2>GreenKart Marketplace</h2>
                    <p className="opacity-90 text-[15px]">verify you account, OTP has sended to Your email ({email}).</p>
                </div>
                <div className="bg-white rounded-[10px] shadow-2xl shadow-gray-200">
                    <Formik initialValues={{ otp: '' }} validationSchema={otpSchema} onSubmit={handleSubmit}>
                        <Form className="flex flex-col justify-between px-9 pt-5 pb-7">
                            <div className="formItemDiv">
                                <label htmlFor="otp">OTP</label>
                                <Field type="string" name="otp" placeholder="Enter otp" className="field" />
                                <ErrorMessage name="otp" component="div" className="errorMessage" />
                            </div>
                            <div className="flex gap-4">
                                <Button variant="primary" size="md" more="w-[100%] mt-5">Verify</Button>
                                <button className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 text-base rounded-lg font-medium transition-colors w-[100%] mt-5" onClick={handleResendOTP} variant="primary" size="md" more="w-[100%] mt-5">Resend OTP</button>
                            </div>
                        </Form>
                    </Formik>
                </div>
                <div className="flex items-center">
                    <p className="opacity-60 text-[15px] font-bold">Sign up with diffrent mail <span className="text-green-600 cursor-pointer hover:text-green-500" onClick={goSignup}>Sign up</span></p>
                </div>
            </div>
            {isLoading ? <LoadingSpinner /> : <></>}
        </div>
    );
};