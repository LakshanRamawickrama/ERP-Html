const API_BASE_URL = typeof window !== 'undefined' && (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')
  ? 'https://erp-html-production.up.railway.app/api'
  : 'http://127.0.0.1:8000/api';

export const API_ENDPOINTS = {
  BUSINESS: `${API_BASE_URL}/business/`,
  PROPERTY: `${API_BASE_URL}/property/`,
  FLEET: `${API_BASE_URL}/fleet/`,
  ACCOUNTING: `${API_BASE_URL}/accounting/`,
  INVENTORY: `${API_BASE_URL}/inventory/`,
  LEGAL: `${API_BASE_URL}/legal/`,
  REMINDERS: `${API_BASE_URL}/reminders/`,
  SUPPLIERS: `${API_BASE_URL}/suppliers/`,
  USERS: `${API_BASE_URL}/users/`,
  SYSTEM: `${API_BASE_URL}/system/`,
  EMAILS: `${API_BASE_URL}/system/emails/`,
  NOTES: `${API_BASE_URL}/system/notes/`,
  REPORTS: `${API_BASE_URL}/reports/`,
  LOGIN: `${API_BASE_URL}/users/login/`,
  DASHBOARD: `${API_BASE_URL}/reports/dashboard/`,
};

export default API_BASE_URL;
