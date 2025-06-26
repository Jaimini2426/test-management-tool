import { renderSuites, renderCases, renderReport } from './ui.js';
import './idb.js';
import './models.js'; // add this line to ensure models are loaded

openDB().then(() => console.log("DB initialized"));

document.getElementById('nav-suites').addEventListener('click', () => {
  setActiveNav('nav-suites');
  renderSuites();
});
document.getElementById('nav-cases').addEventListener('click', () => {
  setActiveNav('nav-cases');
  renderCases();
});
document.getElementById('nav-report').addEventListener('click', () => {
  setActiveNav('nav-report');
  renderReport();
});

function setActiveNav(id) {
  document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

window.addEventListener('DOMContentLoaded', () => {
  renderSuites();
});
