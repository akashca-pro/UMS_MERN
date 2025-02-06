import { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { useContext } from "react";
import { UserDetails } from "../../store/slice/UserDetails";
import axiosInstance from "../../config/axiosConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdminEditUser() {
  const navigate = useNavigate()
  const {user} = useContext(UserDetails);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formData, setFormData] = useState(
    {
      name: '',
      email: '',
      phone: '',
      image: null,
    }
  );
  const [errors, setErrors] = useState({});

 

  useEffect(()=>{
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`admin/${user}`)
        const userData = response.data
        console.log(userData)
        setFormData({
          name : userData.name,
          email : userData.email,
          phone : userData.phone,
          image : userData.image
        })
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  },[])


  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";

    if (!formData.phone) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Invalid phone number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (validateForm()) {
      try {

        const data = new FormData()
        data.append('_id',user)
        data.append('name' , formData.name);
        data.append('email',formData.email);
        data.append('phone',formData.phone);

        if (formData.image instanceof File) {
          data.append("image", formData.image);
        }
        
       console.log("form data",formData)

        const response = await axiosInstance.put(`/admin/edit-user/${user}`,data ,{
          headers :{
            'Content-Type': 'multipart/form-data'
          }
        })

        if(response.data){
          toast.success('Update Successfull')
          navigate(-1);
        }
        
      } catch (error) {
        toast.error(error.response.data.message)
        console.log(error)
      }
    }else{
      toast.error('Invalid Form data')
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 flex items-center justify-center">
      <div className="w-full max-w-[450px] bg-gray-800 rounded-xl p-8 shadow-xl text-white">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Edit User</h1>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="name" className="block font-medium">
              Name
            </label>
            <input
              id="name"
              placeholder="Enter user's name"
              className="w-full p-2 border rounded bg-gray-700 text-white"
              required
              onChange={handleInputChange}
              value={formData.name}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block font-medium">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter user's email"
              className="w-full p-2 border rounded bg-gray-700 text-white"
              required
              onChange={handleInputChange}
              value={formData.email}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="block font-medium">
              Phone number
            </label>
            <input
              id="phone"
              type="number"
              placeholder="Enter user's phone number"
              className="w-full p-2 border rounded bg-gray-700 text-white"
              required
              onChange={handleInputChange}
              value={formData.phone}
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
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
                  className="w-full bg-gray-600 p-2 rounded flex items-center justify-center gap-2 text-white"
                  onClick={() => document.getElementById("image").click()}
                >
                  <Upload className="h-4 w-4" />
                  Upload Image
                </button>
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white p-2 rounded">
            Update User
          </button>
        </form>
      </div>
    </div>
  );
}