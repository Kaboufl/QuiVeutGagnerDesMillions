import axios from 'axios';

class DataService {
    private baseURL: string;

    constructor() {
        this.baseURL = 'localhost:3000'; 
    }

    async getData(endpoint: string) {
        try {
            const response = await axios.get(`${this.baseURL}/${endpoint}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }

    async postData(endpoint: string, data: any) {
        try {
            const response = await axios.post(`${this.baseURL}/${endpoint}`, data);
            return response.data;
        } catch (error) {
            console.error('Error posting data:', error);
            throw error;
        }
    }

    async putData(endpoint: string, data: any) {
        try {
            const response = await axios.put(`${this.baseURL}/${endpoint}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating data:', error);
            throw error;
        }
    }

    async deleteData(endpoint: string) {
        try {
            const response = await axios.delete(`${this.baseURL}/${endpoint}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting data:', error);
            throw error;
        }
    }
}

export default new DataService();