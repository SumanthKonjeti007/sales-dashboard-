import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const fetchSummary = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/sales-summary`);
        return response.data;
    } catch (error) {
        console.error('Error fetching summary:', error);
        throw error;
    }
};
