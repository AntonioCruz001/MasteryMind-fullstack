import { createContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('@Memorizer:token')
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/login', { email, password });
        const { access_token } = response.data;

        localStorage.setItem('@Memorizer:token', access_token);

        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

        // Atualiza o estado do usuário na aplicação
        setUser({ email });
    }

    const logout = () => {
        localStorage.removeItem('@Memorizer:token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

