import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/userSlice';
import { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';
import { FaUserAlt, FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';

const LoginComponent: React.FC = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.user);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await dispatch(loginUser({ username: email, password }) as any).unwrap();
      // Redirect to the desired route after successful login
      navigate('/dashboard'); // Change '/dashboard' to your desired route
    } catch (err) {
      console.error('Login failed:', err);
      toast.error('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#000D0F]">
      <div className="w-full max-w-md p-8 space-y-8 bg-[#0D1B1E] rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-white">
          Login to Your Account
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="relative">
            <FaUserAlt className="absolute top-3 left-3 text-gray-400" />
            <input
              type="email"
              className="w-full px-10 py-3 bg-[#1A2A2F] text-white placeholder-gray-400 rounded-full focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <input
              type="password"
              className="w-full px-10 py-3 bg-[#1A2A2F] text-white placeholder-gray-400 rounded-full focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div className="text-red-500 text-center">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-white bg-[#4FD1C5] rounded-full hover:bg-[#38B2AC] focus:outline-none focus:ring-2 focus:ring-[#4FD1C5] transition-colors duration-200"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginComponent;
