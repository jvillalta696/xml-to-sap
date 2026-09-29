import axios from 'axios';
import { baseUrl } from '../libs/Tools';

export const getCompanies = async () => {
    const response = await axios.get(baseUrl + '/api/companias');
    return response.data;
};
