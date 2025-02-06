import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axiosInstance from "../../config/axiosConfig";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAdminCredentials } from "../../store/slice/adminAuthSlice";
import { toast } from "react-toastify";

export default function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
        const response = await axiosInstance.post("/admin", formData);

        if (response.data) {
          dispatch(setAdminCredentials(response.data));
          toast.success("Login successful");
          setTimeout(() => {
            navigate("/admin/dashboard");
          }, 1000);
        }
      } catch (error) {
        if (error.response?.status === 409) toast.error(error.response.data.message);
        else {
          console.log(error);
        }
        toast.error(error.response?.data?.message || "An error occurred");
      }
    } else {
      toast.error("Invalid form data");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 flex items-center justify-center">
      <div className="w-full max-w-[400px] bg-gray-800 rounded-xl p-8 shadow-2xl border border-gray-700">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-white">Admin Login</h1>
          <p className="text-gray-400">Secure access for administrators only</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="email" className="block font-medium text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400"
              onChange={handleInputChange}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block font-medium text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400"
                onChange={handleInputChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-purple-700 hover:bg-purple-800 text-white p-2 rounded transition duration-300 shadow-md hover:shadow-lg"
          >
            Login
          </button>
        </form>

        {/* Go to User Side Button */}
        <button
          onClick={() => navigate("/")}
          className="mt-4 w-full bg-gray-600 hover:bg-gray-700 text-white p-2 rounded transition duration-300 shadow-md hover:shadow-lg"
        >
          Go to User Side
        </button>
      </div>
    </div>
  );
}