import axios from "axios";
import { Form, Field, ErrorMessage, Formik } from "formik";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

interface SignupForm {
  username: string;
  email: string;
  password: string;
}

const validateSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const Signup: React.FC = () => {
  const initialValues: SignupForm = {
    username: "",
    email: "",
    password: "",
  };

  const navigate = useNavigate()

  const handleSubmit = async (
    values: SignupForm,
    {
      setSubmitting,
      resetForm,
    }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void }
  ) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/register/admin`,
        values
      );
      console.log(response);

      if (response) {
        toast.success("Admin registered successfully");
        resetForm();
        localStorage.setItem("adminId", response.data.admin._id)
        if(response.data.admin.userType === "admin"){
          navigate("/dashboard/admin")
          } else {
            navigate("/dashboard/employee")
          }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error registering admin");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-slate-200">
      <div className="p-4 pt-6 pb-8 mb-4 bg-white rounded shadow-md px-10">
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validateSchema}
        >
          <Form>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="username"
              >
                Username:
              </label>
              <Field
                className="shadow appearance-none border rounded w-[300px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                id="username"
                name="username"
                placeholder="Enter your name"
              />
              <ErrorMessage
                className="text-red-500 text-xs italic"
                name="username"
                component="div"
              />
            </div>
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
              Sign Up
            </button>
            <Link to={"/login"} className="text-blue-600 hover:text-blue-800 underline text-sm">
              Already have account? Click here
            </Link>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Signup;
