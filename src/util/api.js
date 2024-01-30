import PocketBase from 'pocketbase';

const api = new PocketBase(import.meta.env.VITE_BACKEND_API)

export default api;

