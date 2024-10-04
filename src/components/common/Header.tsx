import React from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../api/apiClient';
import { userLogout } from '../../store/slices/authSlice';

const Header: React.FC = () => {

  function dateData(): string {
    const now = new Date(Date.now());
    const monthNames: string[] = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();
    return `${month} ${year}`;
  }

  const dispatch= useDispatch()
  const navigate= useNavigate()

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(userLogout());
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="flex items-center justify-between p-4 bg-blue-600 text-white shadow-md border-blue-700">
      <div className="flex items-center">
        <h1 className="text-3xl font-bold tracking-wide">Tasker</h1>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-lg font-medium">{dateData()}</span>
        <button
          className="p-2 hover:bg-red-500 rounded-full transition duration-200 flex items-center"
          onClick={handleLogout}
        >
          <LogOut className="h-6 w-6" />
          <span className="ml-2">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
