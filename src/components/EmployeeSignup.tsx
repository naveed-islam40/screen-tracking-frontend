import axios from "axios";
import { Form, Field, ErrorMessage, Formik } from "formik";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

interface SignupForm {
  employeeName: string;
  email: string;
  password: string;
}

const validateSchema = yup.object().shape({
  employeeName: yup.string().required("employeeName is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const EmployeeSignup: React.FC = () => {
  const initialValues: SignupForm = {
    employeeName: "",
    email: "",
    password: "",
  };

  const adminId = localStorage.getItem("adminId")

  const navigate = useNavigate();

  const handleSubmit = async (
    values: SignupForm,
    {
      setSubmitting,
      resetForm,
    }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void }
  ) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/register/employee/${adminId}`,
        values
      );

      if (response) {
        toast.success(" registered successfully");
        resetForm();
        navigate("/dashboard/admin");
      }
    } catch (error:any) {
      console.error("Error:", error);
      toast.error(error.response.data.message);
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
                htmlFor="employeeName"
              >
                Employee:
              </label>
              <Field
                className="shadow appearance-none border rounded w-[300px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                id="employeeName"
                name="employeeName"
                placeholder="Enter your name"
              />
              <ErrorMessage
                className="text-red-500 text-xs italic"
                name="employeeName"
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
            {/* <Link to={"/login"} className="text-blue-600 hover:text-blue-800 underline text-sm">
              Already have account? Click here
            </Link> */}
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default EmployeeSignup;
