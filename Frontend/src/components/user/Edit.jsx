import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import fileNameExtractor from './ImageUrl';
import axiosInstance from "../../config/axiosConfig";
import { toast } from "react-toastify";
import { setUserCredentials } from "../../store/slice/userAuthSlice"; // Make sure this import exists

const apiUrl = import.meta.env.VITE_API_URL;

export default function EditPage() {
  const userID = useSelector((state) => state.userAuth.userInfo);
  const imgURL = fileNameExtractor(userID.image);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    _id: userID._id,
    name: userID.name,
    email: userID.email,
    phone: userID.phone,
    image: null  
  });
  
  const [errors, setErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setFormData(prev => ({ ...prev, image: file }));  
    }
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    else if (!/^\+?[1-9]\d{9,14}$/.test(formData.phone)) newErrors.phone = "Invalid phone number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Create a new FormData instance
        const data = new FormData();
        data.append('_id', formData._id);
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('phone', formData.phone);
        
        // Only append image if a new one was selected
        if (formData.image instanceof File) {
          data.append('image', formData.image);
        }

        const response = await axiosInstance.post('/edit-profile', data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.data) {
          toast.success(response.data.message);
          dispatch(setUserCredentials(response.data));
          navigate('/');
        }
      } catch (error) {
        console.error('Update error:', error);
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Failed to update profile');
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 p-4 flex items-center justify-center">
      <div className="w-full max-w-[400px] bg-white rounded-xl p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-center">Edit Profile</h1>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center">
            <img
              src={previewUrl || `${apiUrl}/uploads/${imgURL}`}
              alt="Profile Preview"
              className="w-24 h-24 rounded-full object-cover border-2 border-purple-600"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '#'; // Add a default avatar image
              }}
            />
            <input 
              type="file" 
              id="image" 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageChange}
            />
            <button
              type="button"
              className="mt-2 bg-purple-600 text-white px-4 py-1 rounded"
              onClick={() => document.getElementById("image").click()}
            >
              Change Image
            </button>
          </div>

          {/* Rest of the form fields remain the same */}
          <div className="space-y-2">
            <label className="block font-medium" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              className="w-full p-2 border rounded"
              value={formData.name}
              onChange={handleInputChange}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <label className="block font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full p-2 border rounded"
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label className="block font-medium" htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              className="w-full p-2 border rounded"
              value={formData.phone}
              onChange={handleInputChange}
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>

          <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white p-2 rounded">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}