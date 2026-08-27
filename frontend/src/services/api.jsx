import axios from 'axios'

const api = axios.create({
    baseURL : 'http://127.0.0.1:8000',
});

// Adiciona o token automaticamente a todas as requisições
api.interceptors.request.use((config)=>{
    const token = localStorage.getItem('@Memorizer:token');
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor de resposta para capturar tokens expirados/inválidos (401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('@Memorizer:token');
            delete api.defaults.headers.common['Authorization'];
            // Redireciona para o login se não estiver já lá
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;