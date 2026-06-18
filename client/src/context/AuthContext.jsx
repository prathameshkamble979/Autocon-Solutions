
import { createContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                const adminData = localStorage.getItem('adminInfo')
                    ? JSON.parse(localStorage.getItem('adminInfo'))
                    : { email: 'Admin', name: 'Administrator' };

                setAdmin(adminData);
            }
            setLoading(false);
        };

        checkLoggedIn();
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            const info = { email: data.email, _id: data._id, name: data.name || 'Administrator' };
            localStorage.setItem('token', data.token);
            localStorage.setItem('adminInfo', JSON.stringify(info));
            setAdmin({ ...data, ...info });
            navigate('/admin/dashboard');
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const googleLogin = async (credentialResponse) => {
        try {
            const { data } = await api.post('/auth/google', { tokenId: credentialResponse.credential });
            const info = { email: data.email, _id: data._id, name: data.name || 'Administrator' };
            localStorage.setItem('token', data.token);
            localStorage.setItem('adminInfo', JSON.stringify(info));
            setAdmin({ ...data, ...info });
            navigate('/admin/dashboard');
            return { success: true };
        } catch (error) {
            console.error("Google Login Error Context:", error);
            return {
                success: false,
                message: error.response?.data?.message || 'Google Sign-In failed'
            };
        }
    };

    const updateProfile = async (profileData) => {
        try {
            const { data } = await api.put('/auth/profile', profileData);
            const info = { email: data.email, _id: data._id, name: data.name || 'Administrator' };
            localStorage.setItem('token', data.token);
            localStorage.setItem('adminInfo', JSON.stringify(info));
            setAdmin(prev => ({ ...prev, ...info }));
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Profile update failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('adminInfo');
        setAdmin(null);
        navigate('/admin/login');
    };

    return (
        <AuthContext.Provider value={{ admin, user: admin, loading, login, googleLogin, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
