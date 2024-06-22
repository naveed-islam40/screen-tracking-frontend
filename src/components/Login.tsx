import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";

interface LoginForm {
  email: string;
  password: string;
}

const loginFormValidation = yup.object().shape({
  email: yup.string().email("Invalid email").required("email is required"),
  password: yup.string().required("password is required"),
});

const Login: React.FC = () => {
  const initialValues = {
    email: "",
    password: "",
  };

  const navigate = useNavigate();

  const handleSubmit = async (
    value: LoginForm,
    { resetForm }: { resetForm: () => void }
  ) => {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/login`,
      value
    );

    console.log(response);
    

    if (response.data.user.userType === "admin") {
      toast.success(`Admin login successfully`);
      resetForm();
      localStorage.setItem("adminId", response.data.user._id);
      localStorage.setItem("token", response.data.token);

      navigate("/dashboard/admin");
    } else {
      toast.success(`Employee login successfully`);
      resetForm();
      localStorage.setItem("employeeId", response.data.user._id);
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard/employee");
    }
  };
  return (
    <div className="flex justify-center items-center h-screen bg-slate-200">
      <div className="p-4 pt-6 pb-8 mb-4 bg-white rounded shadow-md px-10">
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={loginFormValidation}
        >
          <Form>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email:
              </label>
              <Field
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
              />
              <ErrorMessage
                className="text-red-500 text-xs italic"
                name="email"
                component="div"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password:
              </label>
              <Field
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
              />
              <ErrorMessage
                className="text-red-500 text-xs italic"
                name="password"
                component="div"
              />
            </div>
            <button
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded m-auto w-full"
              type="submit"
            >
              Sign In
            </button>
            <Link
              to={"/"}
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              Don't have an account? Sign up
            </Link>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Login;
