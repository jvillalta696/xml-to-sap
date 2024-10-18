import axios from 'axios';
import { port } from '../libs/Tools';

const userService = {
    login: async (data) => {
        try {
            const response = await axios.post('https://db.cloud.delserint.com:' + port + '/api/login/authenticate', {
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