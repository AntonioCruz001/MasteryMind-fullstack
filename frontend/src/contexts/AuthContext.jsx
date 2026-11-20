import { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { isTokenExpired } from '../functions/token';

export const AuthContext = createContext({});

function getInitialUser() {
    const token = localStorage.getItem('@Memorizer:token');
    if (!token || isTokenExpired(token)) {
        localStorage.removeItem('@Memorizer:token');
        delete api.defaults.headers.common['Authorization'];
        return null;
    }

    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return { authenticated: true };
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(getInitialUser);
    const [loading] = useState(false);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const { access_token } = response.data;

        localStorage.setItem('@Memorizer:token', access_token);
        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        setUser({ email });
    };

    const logout = useCallback(() => {
        localStorage.removeItem('@Memorizer:token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;

