import axios from 'axios';
import { port } from '../libs/Tools';

export const getCompanies = async () => {
    const response = await axios.get('https://db.cloud.delserint.com:' + port + '/api/companias');
    return response.data.map(c => ({ codedb: c.codedb, name: c.name, identificacion: c.id }));
};
