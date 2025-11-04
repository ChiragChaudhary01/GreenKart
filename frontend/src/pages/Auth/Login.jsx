import { Form, Formik, Field, ErrorMessage } from "formik";
import { object, string, ref } from "yup";
import { useAuth } from "../../api/authApi.jsx";
import Button from "../../UI/Button.jsx";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";

const loginSchema = object().shape({
    email: string()
        .email("Invalid email formet")
        .required("Email is required"),
    password: string()
        .required('Password is required')
        .min(8, 'Must be at least 8 characters')
        .matches(/[a-z]/, 'Must include a lowercase letter')
        .matches(/[A-Z]/, 'Must include an uppercase letter')
        .matches(/\d/, 'Must include a number')
        .matches(/[@$!%*?&]/, 'Must include a special character')
});


export default function Login() {
    const { login } = useAuth();
    const isLoading = useSelector((state) => state.login.loading);

    const navigate = useNavigate();

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await login(values);
            console.log("Login successfully", response);
            if (response.data.isVerified) {
                navigate("/");
            } else {
                navigate("/verify-otp");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
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
                    <p className="opacity-90 text-[15px]">Fresh produce straight from farmers</p>
                </div>
                <div className="bg-white rounded-[10px] shadow-2xl shadow-gray-200">
                    <Formik initialValues={{ email: '', password: '' }} validationSchema={loginSchema} onSubmit={handleSubmit}>
                        <Form className="flex flex-col justify-between px-9 pt-5 pb-7">
                            <div className="formItemDiv">
                                <label htmlFor="email">Email</label>
                                <Field type="email" name="email" placeholder="Enter eamil" className="field" />
                                <ErrorMessage name="email" component="div" className="errorMessage" />
                            </div>
                            <div className="formItemDiv">
                                <label htmlFor="password">Password</label>
                                <Field type="password" name="password" placeholder="Enter password" className="field" />
                                <ErrorMessage name="password" component="div" className="errorMessage" />
                            </div>
                            <Button variant="primary" size="md" more="w-[100%] mt-5">Submit</Button>
                        </Form>
                    </Formik>
                </div>
                <div className="flex items-center">
                    <p className="opacity-60 text-[15px] font-bold">Dosn't have an account? <span className="text-green-600 cursor-pointer hover:text-green-500" onClick={goSignup}>Sign up</span></p>
                </div>
            </div>
            {isLoading ? <LoadingSpinner /> : <></>}
        </div>
    );
};