window.addEventListener('DOMContentLoaded', () => {
  openDB().then(() => console.log("DB initialized"));

    document.getElementById('nav-create')?.addEventListener('click', () => {
    document.querySelector('.dropdown')?.classList.toggle('show');
  });
  window.addEventListener('click', function(e) {
  const dropdown = document.querySelector('.dropdown');
  if (!dropdown.contains(e.target)) {
    dropdown.classList.remove('show');
  }
});

  // Create dropdown handlers
  document.getElementById('create-suite')?.addEventListener('click', () => {
    setActiveNav('nav-create');
    renderSuites();
  });

  document.getElementById('create-plan')?.addEventListener('click', () => {
    setActiveNav('nav-create');
    alert('Test Plan modal not implemented yet');
  });

  document.getElementById('create-execution')?.addEventListener('click', () => {
    setActiveNav('nav-create');
    alert('Test Execution modal not implemented yet');
  });

  // Other nav buttons
  document.getElementById('nav-cases')?.addEventListener('click', () => {
    setActiveNav('nav-cases');
    renderCases();
  });

  document.getElementById('nav-report')?.addEventListener('click', () => {
    setActiveNav('nav-report');
    renderReport();
  });

  // Default tab
  setActiveNav('nav-create');
  renderSuites(); // Default to suite creation page
});

function setActiveNav(id) {
  document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
}
