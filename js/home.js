if (!sessionStorage.getItem('loggedIn')) {
  window.location.href = 'index.html';
}


document.getElementById('logout-btn').addEventListener('click', () => {
  sessionStorage.removeItem('loggedIn');
  localStorage.removeItem('rememberMe');
  window.location.href = 'index.html';
});

document.getElementById('notification-bell').addEventListener('click', () => {
  populateNotifications();
  document.getElementById('notification-modal').classList.remove('hidden');
});

function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
}

function populateNotifications() {
  const notifications = [
    { type: 'Test Suite', id: 'TS_001' },
    { type: 'Test Execution', id: 'TE_003' },
    { type: 'Test Plan', id: 'TP_005' }
  ];

  const ul = document.getElementById('notification-list');
  ul.innerHTML = '';
  notifications.forEach(n => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#`; // Replace with actual routing logic if needed
    a.textContent = `${n.type} ${n.id} created`;
    a.addEventListener('mouseover', () => {
      a.style.textDecoration = 'underline';
    });
    a.addEventListener('mouseout', () => {
      a.style.textDecoration = 'none';
    });
    li.appendChild(a);
    ul.appendChild(li);
  });
}
