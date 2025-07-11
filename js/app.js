window.addEventListener('DOMContentLoaded', () => {
  openDB().then(() => console.log("DB initialized"));

  // Handle dropdown toggle
  const createBtn = document.getElementById('create-btn');
  const createMenu = document.getElementById('create-menu');

  createBtn.addEventListener('click', () => {
    createMenu.classList.toggle('hidden');
  });

  document.addEventListener('click', e => {
    if (!createBtn.contains(e.target) && !createMenu.contains(e.target)) {
      createMenu.classList.add('hidden');
    }
  });

  // Handle dropdown item click
  createMenu.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', () => {
      createMenu.classList.add('hidden');
      const type = li.dataset.type;
      openCreateModal(type);
    });
  });

  // Navigation buttons
  document.getElementById('nav-cases')?.addEventListener('click', () => {
    setActiveNav('nav-cases');
    renderCases();
  });

  document.getElementById('nav-report')?.addEventListener('click', () => {
    setActiveNav('nav-report');
    renderReport();
  });

  setActiveNav('create-btn');
});

function setActiveNav(id) {
  document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
}


window.addEventListener('DOMContentLoaded', () => {
   const createBtn = document.getElementById('create-btn');
  const createMenu = document.getElementById('create-menu');
createBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent bubbling to document
    createMenu.classList.toggle('hidden');
  });
  document.addEventListener('click', (e) => {
    if (!createBtn.contains(e.target) && !createMenu.contains(e.target)) {
      createMenu.classList.add('hidden');
    }
  });
   createMenu.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', () => {
      createMenu.classList.add('hidden'); // auto close
      const type = li.dataset.type;
      openCreateModal(type); // open relevant modal
    });
  });
});