const Auth = {
  getToken() { return localStorage.getItem('umiya_token'); },

  getUser() {
    try { return JSON.parse(localStorage.getItem('umiya_user') || 'null'); }
    catch { return null; }
  },

  isLoggedIn() { return !!Auth.getToken(); },

  isAdmin() { return Auth.getUser()?.role === 'admin'; },

  save(token, userData) {
    localStorage.setItem('umiya_token', token);
    localStorage.setItem('umiya_user', JSON.stringify(userData));
  },

  logout() {
    localStorage.removeItem('umiya_token');
    localStorage.removeItem('umiya_user');
    window.location.href = '/login.html';
  },

  requireAdmin() {
    if (!Auth.isAdmin()) {
      window.location.href = '/login.html';
      return false;
    }
    return true;
  },

  requireLogin() {
    if (!Auth.isLoggedIn()) {
      window.location.href = '/login.html';
      return false;
    }
    return true;
  },

  updateNavUI() {
    const user = Auth.getUser();
    const loginLink = document.getElementById('nav-login-link');
    const userInfo = document.getElementById('nav-user-info');
    const userName = document.getElementById('nav-user-name');

    if (user && Auth.isLoggedIn()) {
      if (loginLink) loginLink.style.display = 'none';
      if (userInfo) userInfo.style.display = 'flex';
      if (userName) userName.textContent = user.name;
    } else {
      if (loginLink) loginLink.style.display = 'inline-flex';
      if (userInfo) userInfo.style.display = 'none';
    }
  }
};

document.addEventListener('DOMContentLoaded', () => Auth.updateNavUI());
