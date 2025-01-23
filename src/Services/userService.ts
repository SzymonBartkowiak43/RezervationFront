import axios from 'axios';

interface User {
    email: string;
    name: string;
    password: string;
}

export const registerUser = async (user: User) => {
    try {
        const response = await axios.post('http://localhost:8080/register', user, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};


export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
    try {
        const response = await axios.post('http://localhost:8080/token', { email, password }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};