import { useState, useEffect } from 'react';
import { generateId } from '../utils/helpers';

const API_URL = 'http://localhost:3000/api';
const TOKEN_KEY = 'remember_token';
const USER_KEY = 'remember_user';

// ─── User (Authentification sécurisée) ───────────────────────────────────────
export function useAuth() {
    const [user, setUser] = useState(() => {
        try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const signup = async (name, email, password) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            localStorage.setItem(TOKEN_KEY, data.token);
            localStorage.setItem(USER_KEY, JSON.stringify(data.user));
            setUser(data.user);
            return data.user;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            localStorage.setItem(TOKEN_KEY, data.token);
            localStorage.setItem(USER_KEY, JSON.stringify(data.user));
            setUser(data.user);
            return data.user;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
    };

    return { user, login, signup, logout, loading, error };
}

// ─── Documents (API Backend) ──────────────────────────────────────────────────
export function useDocuments() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getToken = () => localStorage.getItem(TOKEN_KEY);

    // Récupérer les documents du serveur
    const fetchDocuments = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = getToken();
            if (!token) return;

            const res = await fetch(`${API_URL}/documents`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setDocuments(data);
        } catch (err) {
            setError(err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Au montage, récupérer les documents
    useEffect(() => {
        fetchDocuments();
    }, []);

    const addDocument = async (doc) => {
        try {
            const token = getToken();
            const res = await fetch(`${API_URL}/documents`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(doc)
            });
            const newDoc = await res.json();
            if (!res.ok) throw new Error(newDoc.error);

            setDocuments(prev => [...prev, newDoc]);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const updateDocument = async (id, updates) => {
        try {
            const token = getToken();
            const res = await fetch(`${API_URL}/documents/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updates)
            });
            const updated = await res.json();
            if (!res.ok) throw new Error(updated.error);

            setDocuments(prev => prev.map(d => d.id === id ? updated : d));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const deleteDocument = async (id) => {
        try {
            const token = getToken();
            const res = await fetch(`${API_URL}/documents/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setDocuments(prev => prev.filter(d => d.id !== id));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    return { documents, addDocument, updateDocument, deleteDocument, loading, error, fetchDocuments };
}

// ─── Toast ───────────────────────────────────────────────────────────────────
export function useToast() {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'info') => {
        const id = generateId();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    };

    return { toasts, addToast };
}
