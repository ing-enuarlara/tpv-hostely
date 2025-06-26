import axios from 'axios';
import Constants from 'expo-constants';

const api = axios.create({
    baseURL: Constants.expoConfig?.extra?.apiUrl || 'http://192.168.0.33:8080',
});

export default api;