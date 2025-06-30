// app.js

// Assumes ui.js attached renderSuites, renderCases, renderReport to window

openDB().then(() => console.log("DB initialized"));

document.getElementById('nav-suites').addEventListener('click', () => {
  setActiveNav('nav-suites');
  window.renderSuites();
});
document.getElementById('nav-cases').addEventListener('click', () => {
  setActiveNav('nav-cases');
  window.renderCases();
});
document.getElementById('nav-report').addEventListener('click', () => {
  setActiveNav('nav-report');
  window.renderReport();
});

function setActiveNav(id) {
  document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

window.addEventListener('DOMContentLoaded', () => {
  window.renderSuites();
});
