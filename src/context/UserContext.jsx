import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
    const [username, setUsername] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Check localStorage on first load
    useEffect(() => {
        const saved = localStorage.getItem('ci_username');
        if (saved) {
            setUsername(saved);
        } else {
            setShowModal(true);
        }
    }, []);

    const saveUsername = (name) => {
        const cleaned = name
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9_]/g, '_');

        localStorage.setItem('ci_username', cleaned);
        setUsername(cleaned);
        setShowModal(false);
    };

    const logout = () => {
        localStorage.removeItem('ci_username');
        setUsername(null);
        setShowModal(true);
    };

    return (
        <UserContext.Provider
            value={{ username, showModal, saveUsername, logout }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}