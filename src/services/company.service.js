import mockCompanies from '../mocks/companies.mock.json';
// import axios from 'axios';
// import { port } from '../libs/Tools';

export const getCompanies = async () => {
    return mockCompanies; // local mock — comment out and uncomment below for production
    // const response = await axios.get('https://db.cloud.delserint.com:' + port + '/api/companies');
    // return response.data.map(c => ({ codedb: c.codedb, name: c.name, identificacion: c.id }));
};
