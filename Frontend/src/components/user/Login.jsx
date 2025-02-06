import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../../config/axiosConfig";
import { useDispatch } from "react-redux";
import { setUserCredentials } from "../../store/slice/userAuthSlice";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";

    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axiosInstance.post("/login", formData);

        const { success, message } = response.data;

        if (success) {
          toast.success(message);
          dispatch(setUserCredentials(response.data));
          setTimeout(() => {
            navigate("/");
          }, 1000);
        }
      } catch (error) {
        if (error.message) toast.error(error.response.data.message);
      }
    } else {
      toast.error("Invalid Form data");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 p-4 flex items-center justify-center">
      <div className="w-full max-w-[400px] bg-white rounded-xl p-8 shadow-xl">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-gray-500">
            Don't have an account?{" "}
            <a href="/signup" className="text-purple-600 hover:underline">
              Sign up
            </a>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="email" className="block font-medium">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full p-2 border rounded"
              required
              onChange={handleInputChange}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block font-medium">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full p-2 border rounded"
                required
                onChange={handleInputChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <div className="flex justify-between text-sm">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span>Remember me</span>
            </label>
          </div>

          <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white p-2 rounded">
            Login
          </button>
        </form>

        {/* Go to Admin Side Button */}
        <button
          onClick={() => navigate("/admin")}
          className="mt-4 w-full bg-gray-600 hover:bg-gray-700 text-white p-2 rounded transition duration-300 shadow-md hover:shadow-lg"
        >
          Go to Admin Side
        </button>
      </div>
    </div>
  );
}