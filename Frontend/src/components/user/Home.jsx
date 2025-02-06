import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch ,useSelector } from "react-redux";
import { userLogout } from "../../store/slice/userAuthSlice";
import axiosInstance from "../../config/axiosConfig";
import { toast } from "react-toastify";
import fileNameExtractor from './ImageUrl'

const apiUrl = import.meta.env.VITE_API_URL

export default function HomePage() {
  const userID = useSelector((state)=>state.userAuth.userInfo)
  const dispatch = useDispatch();
  const [user, setUser] = useState({});
  const [imgSrc,setImgsrc] = useState("")

  




  useEffect(()=>{
    const fetchUser = async () => {
        try {
        const response = await axiosInstance.get(`/${userID._id}`);
        console.log(response.data);
        setUser(response.data)
        setImgsrc(fileNameExtractor(response.data.image))
        console.log(imgSrc)

        } catch (error) {
          console.log(error.message)
        }
    }
    fetchUser()
  },[userID._id])


  const handleLogout = async() =>{
    try {

    const response = await axiosInstance.post('/logout')
    if(response){
      dispatch(userLogout());
      toast.success('Logout successfull')
    }

    } catch (error) {
      console.log("logout error",error.message)
    }
  }
  console.log(`${apiUrl}/uploads/${imgSrc}`)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 p-4 flex items-center justify-center">
      <div className="w-full max-w-[400px] bg-white rounded-xl p-8 shadow-xl text-center">
        <img
          src={`${apiUrl}/uploads/${imgSrc}`}
          alt="Profile"
          className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-purple-600"
        />
        <h1 className="text-2xl font-bold mt-4">{user.name}</h1>
        <p className="text-gray-600 mt-2">{user.email}</p>
        <p className="text-gray-600">{user.phone}</p>

        <Link
          to="/edit-profile"
          className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
        >
          Edit Profile
        </Link>
        &nbsp; &nbsp;        
        <button
          onClick={handleLogout}
          className="mt-6 inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
