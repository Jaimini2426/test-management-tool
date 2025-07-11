document.getElementById('login-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (username === 'admin' && password === 'admin') {
    if (document.getElementById('remember-me').checked) {
      localStorage.setItem('rememberMe', 'true');
    }
    sessionStorage.setItem('loggedIn', 'true');
    window.location.href = 'home.html';
  } else {
    document.getElementById('login-error').textContent = 'Invalid credentials.';
  }
});
