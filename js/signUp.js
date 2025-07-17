// signup.js

document.getElementById('open-signup').addEventListener('click', () => {
  generateCaptcha();
  document.getElementById('signup-modal').classList.remove('hidden');
});

document.getElementById('sign-close').addEventListener('click', () => {
  document.getElementById('signup-modal').classList.add('hidden');
});

function generateCaptcha() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let captcha = '';
  for (let i = 0; i < 6; i++) captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  document.getElementById('captcha-container').textContent = captcha;
  document.getElementById('signup-modal').dataset.captcha = captcha;
}

document.getElementById('signup-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const fullName = document.getElementById('fullName').value.trim();
  const dob = document.getElementById('dob').value.trim();
  const country = document.getElementById('country').value.trim();
  const email = document.getElementById('email').value.trim();
  const mobile = document.getElementById('mobile').value.trim();
  const pass = document.getElementById('pass').value;
  const confirmPass = document.getElementById('confirmPass').value;
  const captchaInput = document.getElementById('captchaInput').value.trim();
  const realCaptcha = document.getElementById('signup-modal').dataset.captcha;

  const errElm = document.getElementById('signup-error');
  const successElm = document.getElementById('signup-success');
  errElm.textContent = '';
  successElm.textContent = '';

  // Validation
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dob)) return errElm.textContent = 'Invalid Date format, use DD/MM/YYYY.';
  if (!/^\d+$/.test(mobile)) return errElm.textContent = 'Mobile no must be numeric.';
  if (pass !== confirmPass) return errElm.textContent = 'Password mismatch.';
  if (captchaInput !== realCaptcha) {
    generateCaptcha();
    return errElm.textContent = 'Captcha mismatch.';
  }

  // TODO: Send confirmation email backend call placeholder
  successElm.textContent = `User ${fullName} registered! A confirmation email sent to ${email}.`;

  this.reset();
  generateCaptcha();
});

// Basic date of birth entry formatting assistance
document.getElementById('dob').addEventListener('input', e => {
  e.target.value = e.target.value.replace(/[^\d\/]/g, '').replace(/(\d\d)(?!\/)/g, '$1/');
});
