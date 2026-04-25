import { differenceInDays, isPast, parseISO } from 'date-fns';

/**
 * Returns status info for a given expiry date string (YYYY-MM-DD)
 */
export function getDocumentStatus(expiryDate) {
    const expiry = parseISO(expiryDate);
    const daysLeft = differenceInDays(expiry, new Date());

    if (isPast(expiry) && daysLeft < 0) {
        return { key: 'expired', label: 'Expiré', cssClass: 'badge-expired', daysLeft };
    }
    if (daysLeft < 30) {
        return { key: 'critical', label: 'Urgent', cssClass: 'badge-critical', daysLeft };
    }
    if (daysLeft < 90) {
        return { key: 'warning', label: 'Bientôt', cssClass: 'badge-warning', daysLeft };
    }
    return { key: 'ok', label: 'Valide', cssClass: 'badge-ok', daysLeft };
}

export function formatDaysLeft(daysLeft) {
    if (daysLeft < 0) return `Expiré depuis ${Math.abs(daysLeft)} j`;
    if (daysLeft === 0) return 'Expire aujourd\'hui !';
    if (daysLeft === 1) return 'Expire demain';
    return `${daysLeft} jours restants`;
}

export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
