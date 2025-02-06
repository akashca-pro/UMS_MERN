import { useEffect, useState } from "react";
import { Pencil, Trash, Plus, LogOut, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminLogout } from "../../store/slice/adminAuthSlice";
import { toast } from "react-toastify";
import axiosInstance from "../../config/axiosConfig";
import { useContext } from "react";
import { UserDetails } from "../../store/slice/UserDetails";
import DeleteModal from "./DeleteModal";

const apiUrl = import.meta.env.VITE_API_URL;

export default function AdminDashboard() {
  const { setUser } = useContext(UserDetails);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchInp, setSearchInp] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(
        `/admin/dashboard?page=${currentPage}&limit=${limit}&search=${searchInp}`
      );
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log("fetching users failed", error.message);
      setUsers([]);
      setTotalPages(1);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, searchInp]);

  const handleSearch = (e) => {
    e.preventDefault(); // Prevent form submission
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleDelete = (id) => {
    setDeleteUserId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axiosInstance.delete(`/admin/delete/${deleteUserId}`);
      if (response.data) {
        await fetchData(); // Refresh the data after deletion
        setIsModalOpen(false);
        toast.success('User deleted successfully');
      }
    } catch (error) {
      toast.error('Failed to delete user');
      console.log(error);
    }
  };

  const handleEdit = (id) => {
    setUser(id);
    navigate(`/admin/edit-user`);
  };

  const handleAddUser = () => {
    navigate("/admin/add-user");
  };

  const handleLogout = () => {
    dispatch(adminLogout());
    toast.success("logout successful");
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <DeleteModal 
        isOpen={isModalOpen} 
        onRequestClose={() => setIsModalOpen(false)} 
        onConfirm={confirmDelete} 
      />
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <form onSubmit={handleSearch} className="flex space-x-2">
            <input
              type="text"
              value={searchInp}
              onChange={(e) => setSearchInp(e.target.value)}
              placeholder="Search by name or email"
              className="px-4 py-2 rounded bg-gray-700 text-white border border-gray-600"
            />
            <button
              type="button"
              onClick={handleAddUser}
              className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
            >
              <Plus className="h-5 w-5 mr-2" /> Add User
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              <LogOut className="h-5 w-5 mr-2" /> Logout
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {Array.isArray(users) && users.length > 0 ? (
            users.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between bg-gray-700 p-4 rounded-lg shadow"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={`${apiUrl}/uploads/${user.image}`}
                    alt={user.name}
                    className="w-12 h-12 rounded-full border-2 border-purple-600"
                  />
                  <div>
                    <p className="font-bold text-lg">{user.name}</p>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                    <p className="text-gray-400 text-sm">{user.phone}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(user._id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400">No users found</p>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded ${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded ${
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}