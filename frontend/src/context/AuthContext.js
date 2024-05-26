import { createContext } from 'react';

const AuthContext = createContext({
    isAuthenticated: false,
    handleLogin: () => { },
    handleLogout: () => { }
});

export default AuthContext;
