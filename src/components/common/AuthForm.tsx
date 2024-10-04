import React, { useState,useEffect} from 'react';
import { FaEye, FaEyeSlash, FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import { login,register } from '../../api/apiClient';
import { useMutation } from '@tanstack/react-query';
import { setLogin } from '../../store/slices/authSlice';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

interface RootState {
    auth: {
        userLoggedin: boolean;
    };
}

const AuthForm: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const { userLoggedin } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (userLoggedin) {
            navigate("/home");
        }
    }, [userLoggedin]);

    const navigate= useNavigate()
    const dispatch= useDispatch()

    const { mutate: signup } = useMutation({
        mutationFn: register,
        onSuccess: (response) => {
            if (response?.status === 201) {
                setIsLogin(true)
            }
        }
    })

    const { mutate: signin } = useMutation({
        mutationFn: login,
        onSuccess: (response) => {
            if (response?.status === 200) {
                console.log(response.data.data.user.role)
                const role = response.data.data.user.role
                const data={
                    id:response.data.data.user.id,
                    role:response.data.data.user.role
                }
                dispatch(setLogin({ userId: data.id, role: role, userLoggedin: data }))
               navigate('/home')
            }
        }
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(`${isLogin ? 'Login' : 'Signup'} submitted:`, formData);
        if(isLogin){
            signin(formData)
        }else{
            signup(formData)
        }
    };

    return (
        <div className="w-[400px] mx-auto mt-10 overflow-hidden border rounded-lg shadow-lg">
            <div className="bg-blue-600 text-white text-2xl font-bold text-center py-6">
                Tasker
            </div>
            <div className="p-6">
                <div className="flex justify-center mb-6">
                    <button
                        className={`mr-2 p-2 ${isLogin ? 'bg-blue-100' : ''}`}
                        onClick={() => setIsLogin(true)}
                    >
                        Login
                    </button>
                    <button
                        className={`ml-2 p-2 ${!isLogin ? 'bg-blue-100' : ''}`}
                        onClick={() => setIsLogin(false)}
                    >
                        Sign Up
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div className="relative">
                            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                className="pl-10 w-full border rounded-md"
                                value={formData.name}
                                onChange={handleInputChange}
                                required={!isLogin}
                            />
                        </div>
                    )}
                    <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="pl-10 w-full border rounded-md"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            className="pl-10 pr-10 w-full border rounded-md"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </button>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md">
                        {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                </form>
            </div>
            <div className="bg-gray-50 py-4 text-center text-sm text-gray-600">
                {isLogin ? (
                    <p>Don't have an account? <button className="p-0 text-blue-600" onClick={() => setIsLogin(false)}>Sign up</button></p>
                ) : (
                    <p>Already have an account? <button className="p-0 text-blue-600" onClick={() => setIsLogin(true)}>Login</button></p>
                )}
            </div>
        </div>
    );
};

export default AuthForm;