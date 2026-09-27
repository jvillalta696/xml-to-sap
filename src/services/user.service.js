import axios from 'axios';
import { baseUrl } from '../libs/Tools';

const userService = {
    login: async (data) => {
        try {
            const response = await axios.post(baseUrl + '/api/login/authenticate', {
                Username: data.user,
                Password: data.password,
                CodeDB: data.company,
            });

            const token = response.data;
            //const token = 'your-fake-jwt-token';
            return token;
        } catch (error) {
            console.error('Error logging in:', error.message);
            throw error;
        }
    },
};

export default userService;