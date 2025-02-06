import { useState } from "react";
import { Eye, EyeOff, Upload } from "lucide-react";
import axiosInstance from "../../config/axiosConfig";
import axios from "axios";
import {toast } from 'react-toastify'
import { useNavigate } from "react-router-dom";


export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    phone: "",
    password: "",
    image : null,
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
    setFormData((prev)=>({...prev , image : file}))
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";

    if (!formData.username) newErrors.username = "Username is required";

    if (!formData.phone) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Invalid phone number";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);

      const data = new FormData();
      data.append('name',formData.username);
      data.append('password',formData.password);
      data.append('email',formData.email);
      data.append('phone',formData.phone); 
      if(formData?.image) data.append('image',formData.image);

      console.log(formData)

      try {

        const response = await axiosInstance.post('/signup',data,
          {
            headers :{
              'Content-Type' : 'multipart/form-data'
            },
          }
        );

        const {success , message , user} = response.data

        if(success){
          console.log(message ,user);
          toast.success('Signup success , Redirecting to login')
          setTimeout(()=>{
            navigate('/login');
          },1500)
          
        }
        
      } catch (error) {
        console.log("error in form submission", error.message);
        if(error.response && error.response.status===409){
          toast.error('User already exists')
          console.log(error)
        }
        else {
          console.log('signup error ',error)
          toast.error('Something went wrong')
        }
      }

    }
    else{
      toast.error('Invalid Form Entry')
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 p-4 flex items-center justify-center">
      <div className="w-full max-w-[450px] bg-white rounded-xl p-8 shadow-xl">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Sign up</h1>
          <p className="text-gray-500">
            Create an account or{" "}
            <a href="/login" className="text-purple-600 hover:underline">
              sign in
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
            <label htmlFor="username" className="block font-medium">
              Username
            </label>
            <input
              id="username"
              placeholder="Choose a username"
              className="w-full p-2 border rounded"
              required
              onChange={handleInputChange}
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="block font-medium">
              Phone number
            </label>
            <input
              id="phone"
              type="number"
              placeholder="Enter your phone number"
              className="w-full p-2 border rounded"
              required
              onChange={handleInputChange}
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block font-medium">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
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

          <div className="space-y-2">
            <label htmlFor="image" className="block font-medium">
              Profile Image
            </label>
            <div className="flex flex-col items-center gap-4">
              {previewUrl && (
                <img src={previewUrl} alt="Profile preview" className="w-24 h-24 rounded-full object-cover" />
              )}
              <div className="w-full">
                <input id="image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                <button
                  type="button"
                  className="w-full bg-gray-200 p-2 rounded flex items-center justify-center gap-2"
                  onClick={() => document.getElementById("image").click()}
                >
                  <Upload className="h-4 w-4" />
                  Upload Image
                </button>
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white p-2 rounded">
            Sign up
          </button>

          <p className="text-sm text-center text-gray-500">
            By signing up to create an account, you are accepting our{" "}
            <a href="/terms" className="text-purple-600 hover:underline">
              terms of service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-purple-600 hover:underline">
              privacy policy
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
