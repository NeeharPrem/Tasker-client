import axios from "axios";


const Api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

//baseURL: `${import.meta.env.VITE_AXIOS_URL}`,

export default Api;