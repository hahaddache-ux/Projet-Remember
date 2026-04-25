// Document types with emoji icons and colors
export const DOCUMENT_TYPES = [
    { id: 'cni', label: "Carte d'identité", icon: '🪪', color: '#6366f1' },
    { id: 'passport', label: 'Passeport', icon: '📘', color: '#3b82f6' },
    { id: 'permis', label: 'Permis de conduire', icon: '🚗', color: '#10b981' },
    { id: 'vitale', label: 'Carte Vitale', icon: '💊', color: '#ec4899' },
    { id: 'sejour', label: 'Titre de séjour', icon: '🏠', color: '#f59e0b' },
    { id: 'visa', label: 'Visa', icon: '✈️', color: '#8b5cf6' },
    { id: 'assurance', label: 'Assurance', icon: '🛡️', color: '#06b6d4' },
    { id: 'other', label: 'Autre', icon: '📄', color: '#64748b' },
];

export const getDocumentType = (id) =>
    DOCUMENT_TYPES.find(t => t.id === id) || DOCUMENT_TYPES[DOCUMENT_TYPES.length - 1];
