import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_BASEURL || 'http://localhost:8000'
})

export default api;

export const backendUrl = import.meta.env.VITE_BASEURL || 'http://localhost:8000';

