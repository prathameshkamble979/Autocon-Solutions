
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api'), // Uses env variable for prod, falls back to relative or local
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }


        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        // Standardize generic payload wrapper: extract `.data` to avoid breaking old UI hooks.
        if (response.data && response.data.success !== undefined && response.data.data !== undefined) {
            const returnedData = response.data.data;
            // Inject meta into the array or object natively to satisfy "total count" requirements
            if (response.data.meta) {
                returnedData.meta = response.data.meta;
            }
            response.data = returnedData; 
        }
        return response;
    },
    (error) => Promise.reject(error)
);

// Product Service Methods
export const getProductBySlug = (slug) => api.get(`/products/slug/${slug}`);
export const getProducts = () => api.get('/products');
export const getFeaturedProducts = () => api.get('/products/featured');

// Case Study Service Methods
export const getCaseStudies = () => api.get('/case-studies');
export const getCaseStudyBySlug = (slug) => api.get(`/case-studies/slug/${slug}`);

export default api;
