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
