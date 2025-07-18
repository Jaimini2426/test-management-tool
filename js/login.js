// login.js
document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const remember = document.getElementById('remember-me').checked;
  
  if (username === 'admin' && password === 'admin') {
    sessionStorage.setItem('loggedIn', 'true');
    if (remember) localStorage.setItem('rememberMe', 'true');
    window.location.href = 'home.html';
  } else {
    document.getElementById('login-error').textContent = 'Invalid credentials.';
  }
});

// Forgot password modal open/close
document.getElementById('forgot-password-link').addEventListener('click', () => {
  document.getElementById('forgot-modal').classList.remove('hidden');
});

document.getElementById('forgot-close').addEventListener('click', () => {
  document.getElementById('forgot-modal').classList.add('hidden');
});

// Handle forgot password form
document.getElementById('forgot-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const email = document.getElementById('reset-email').value.trim();
  const msg = document.getElementById('reset-msg');

  if (email) {
    msg.textContent = `Password reset link sent to ${email}`;
    this.reset();
  }
});

// Back to login
document.getElementById('back-to-login').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('forgot-modal').classList.add('hidden');
});

