export const isAdminAuthenticated = (): boolean => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('isAdminAuthenticated') === 'true';
  }
  return false;
};

export const logoutAdmin = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('isAdminAuthenticated');
    window.location.href = '/';
  }
};
