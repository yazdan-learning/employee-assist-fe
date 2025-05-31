import axios from 'axios';
import { API_CONFIG } from '../config/api.config';

export const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: API_CONFIG.HEADERS,
}); 