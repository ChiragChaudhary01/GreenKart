import { Form, Formik, Field, ErrorMessage } from "formik";
import { object, string, ref } from "yup";
import { useAuth } from "../../api/authApi.jsx";
import Button from "../../UI/Button.jsx";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";

const signupSchema = object().shape({
    user_name: string()
        .min(2, "The name can't be less than 2 letters")
        .required("Name is required"),
    phone: string()
        .matches(/^[0-9]{10}/, "Phone number is not valid")
        .required("Phone numbers is required"),
    email: string()
        .email("Invalid email formet")
        .required("Email is required"),
    password: string()
        .required('Password is required')
        .min(8, 'Must be at least 8 characters')
        .matches(/[a-z]/, 'Must include a lowercase letter')
        .matches(/[A-Z]/, 'Must include an uppercase letter')
        .matches(/\d/, 'Must include a number')
        .matches(/[@$!%*?&]/, 'Must include a special character'),
    confirmPassword: string()
        .oneOf([ref('password'), null], "Passwords must match")
        .required('Please conform your password'),
    role: string()
        .oneOf(["admin", "farmer", "consumer", "delivery"], "Role is not valid")
        .required("Role is required")
});


export default function Signup() {
    const { signup } = useAuth();
    const isLoading = useSelector((state) => state.login.loading);
    console.log("isLoading", isLoading);

    const navigate = useNavigate();

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await signup(values);
            console.log("signup successfully");
            navigate("/verify-otp");
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    const goLogin = () => {
        navigate("/login");
    };

    return (
        <div className="bg-gray-50 flex justify-center items-center h-lvh">
            <div className="flex justify-center flex-col gap-6 items-center">
                <div className="flex flex-col items-center gap-2">
                    <h2>Get Started for free</h2>
                    <p className="opacity-90 text-[15px]">create an account to buy the fresh frouts and vagitables</p>
                </div>
                <div className="bg-white rounded-[10px] shadow-2xl shadow-gray-200">
                    <Formik initialValues={{ user_name: '', phone: '', email: '', password: '', confirmPassword: '', role: 'consumer' }} validationSchema={signupSchema} onSubmit={handleSubmit}>
                        <Form className="flex flex-col justify-between px-9 pt-5 pb-7">
                            <div className="formItemDiv">
                                <label htmlFor="user_name">Name</label>
                                <Field type="text" name="user_name" placeholder="Enter name" className="field" />
                                <ErrorMessage name="user_name" component="div" className="errorMessage" />
                            </div>
                            <div className="formItemDiv">
                                <label htmlFor="phone">Phone</label>
                                <Field type="text" name="phone" placeholder="Enter name" className="field" />
                                <ErrorMessage name="phone" component="div" className="errorMessage" />
                            </div>
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
                            <div className="formItemDiv">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <Field type="password" name="confirmPassword" placeholder="Enter Confirm Password" className="field" />
                                <ErrorMessage name="confirmPassword" component="div" className="errorMessage" />
                            </div>
                            <div className="formItemDiv">
                                <label htmlFor="role">Role</label>
                                <Field as="select" name="role" className="field" >
                                    <option value="">-- Select role --</option>
                                    <option value="farmer">Farmer</option>
                                    <option value="consumer">Consumer</option>
                                    <option value="delivery">Delivery</option>
                                </Field>
                                <ErrorMessage name="role" component="div" className="errorMessage" />
                            </div>
                            <Button variant="primary" size="md" more="w-[100%] mt-5">Submit</Button>
                        </Form>
                    </Formik>
                </div>
                <div className="flex items-center">
                    <p className="opacity-60 text-[15px] font-bold">Allready have an account? <span className="text-green-600 cursor-pointer hover:text-green-500" onClick={goLogin}>Log in</span></p>
                </div>
            </div>
            {isLoading ? <LoadingSpinner /> : <></>}
        </div>
    );
};