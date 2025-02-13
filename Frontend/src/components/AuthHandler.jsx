import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { baseUrl } from '../baseurl';
import Swal from 'sweetalert2';

const AuthHandler = ({ setToken }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTokenAndNavigate = async () => {
            const storedId = localStorage.getItem('_id');

            if (storedId) {
                try {
                    const response = await axios.post(`${baseUrl}/api/def-token`, { id: storedId });

                    if (response.data.token) {
                        Cookies.set('token', response.data.token, { expires: 7, sameSite: 'strict' });
                        localStorage.setItem('cookie', response.data.token);
                        setToken(response.data.token);
                        navigate('/user');  
                    } else {
                        navigate('/search');
                    }
                } catch (error) {
                    console.error('Error fetching token:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to generate a new token.',
                    });
                    navigate('/search');
                }
            } else {
                navigate('/search'); // No _id in local storage, go to homepage
            }
            setLoading(false);
        };

        fetchTokenAndNavigate();
    }, [navigate, setToken]);

    if (loading) {
        return <div>Loading...</div>; // Show loading state while checking
    }

    return null; // This component does not render anything visible
};

export default AuthHandler;
