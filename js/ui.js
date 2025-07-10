// ui.js

const main = document.getElementById('main');

function clearMain() {
  main.innerHTML = '';
}

function createInlineForm(fields, onSubmit, submitText = 'Save') {
  const form = document.createElement('form');
  form.className = 'inline-form';

  fields.forEach(f => {
    let el;
    if (f.type === 'select') {
      el = document.createElement('select');
      f.options.forEach(o => el.add(new Option(o.text, o.value)));
    } else if (f.multiline) {
      el = document.createElement('textarea');
      el.rows = 2;
      el.placeholder = f.placeholder || '';
    } else {
      el = document.createElement('input');
      el.type = f.type || 'text';
      el.placeholder = f.placeholder || '';
    }
    el.name = f.name;
    el.value = f.value || '';
    form.appendChild(el);
  });

  const btn = document.createElement('button');
  btn.type = 'submit';
  btn.textContent = submitText;
  form.appendChild(btn);

  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = {};
    fields.forEach(f => {
      data[f.name] = form.elements[f.name].value.trim();
    });
    onSubmit(data);
  });

  return form;
}

async function renderSuites() {
  clearMain();
  const suites = await TestSuite.getAll();
  const div = document.createElement('div');

  div.append(createInlineForm([
    { name: 'name', type: 'text', placeholder: 'Suite name' },
    { name: 'description', type: 'text', placeholder: 'Description' }
  ], async data => {
    await TestSuite.create(data);
    renderSuites();
  }, 'Add Suite'));

  const table = document.createElement('table');
  table.innerHTML = `<tr><th>#</th><th>Name</th><th>Description</th><th>Actions</th></tr>`;

  suites.forEach((s, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td><input value="${s.name}"></td>
      <td><input value="${s.description}"></td>
    `;
    const actions = document.createElement('td');
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.addEventListener('click', async () => {
      await TestSuite.update({
        id: s.id,
        name: tr.children[1].firstElementChild.value,
        description: tr.children[2].firstElementChild.value
      });
      renderSuites();
    });
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', async () => {
      await TestSuite.delete(s.id);
      renderSuites();
    });
    actions.append(saveBtn, delBtn);
    tr.append(actions);
    table.append(tr);
  });

  div.append(table);
  main.append(div);
}

async function renderCases() {
  clearMain();
  const suites = await TestSuite.getAll();
  await Requirement.getAll();  // currently unused
  const cases = await TestCase.getAll();
  const div = document.createElement('div');

  div.append(createInlineForm([
    { name: 'tcId', type: 'text', placeholder: 'TC ID' },
    { name: 'referenceReq', type: 'text', placeholder: 'Reference Req' },
    { name: 'module', type: 'text', placeholder: 'Module/Submodule' },
    { name: 'scenario', type: 'text', placeholder: 'Test Scenario', multiline: true },
    { name: 'description', type: 'text', placeholder: 'Description' },
    { name: 'prerequisites', type: 'text', placeholder: 'Pre-requisites' },
    { name: 'steps', type: 'text', placeholder: 'Steps', multiline: true },
    { name: 'expectedResult', type: 'text', placeholder: 'Expected Result', multiline: true },
    {
      name: 'suiteId',
      type: 'select',
      options: [{ text: 'NA', value: 'NA' }]
        .concat(suites.map(s => ({ text: s.name, value: s.id })))
    }
  ], async data => {
    const mandatory = ['tcId', 'module', 'scenario', 'steps', 'expectedResult', 'suiteId'];
    const missing = mandatory.filter(k => !data[k]?.trim());
    if (missing.length) {
      return alert(`Fill these required fields: ${missing.join(', ')}`);
    }
    data.status = 'to-do';
    await TestCase.create(data);
    renderCases();
  }, 'Add Case'));

  const table = document.createElement('table');
  table.innerHTML = `
    <tr>
      <th>TC ID</th><th>Reference Req</th><th>Module</th><th>Scenario</th>
      <th>Description</th><th>Pre-req</th><th>Steps</th><th>Expected Result</th>
      <th>Status</th><th>Actions</th>
    </tr>`;

  cases.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${c.tcId || ''}</td>
      <td>${c.referenceReq || ''}</td>
      <td>${c.module || ''}</td>
      <td>${c.scenario || ''}</td>
      <td>${c.description || ''}</td>
      <td>${c.prerequisites || ''}</td>
      <td>${(c.steps || '').replace(/\n/g, '<br>')}</td>
      <td>${(c.expectedResult || '').replace(/\n/g, '<br>')}</td>
      <td class="status-td ${c.status.replace(/\s/g, '_')}">${c.status}</td>
    `;
    const actions = document.createElement('td');
    ['To-Do', 'In Progress', 'Pass', 'Fail', 'NA'].forEach(st => {
      const btn = document.createElement('button');
      btn.textContent = st;
      btn.addEventListener('click', async () => {
        c.status = st;
        await TestCase.update(c);
        await Execution.record(c.id, st);
        const stEl = tr.querySelector('.status-td');
        stEl.textContent = st;
        stEl.className = `status-td ${st.replace(/\s/g, '_')}`;
      });
      actions.append(btn);
    });
    const del = document.createElement('button');
    del.textContent = 'Delete';
    del.addEventListener('click', async () => {
      await TestCase.delete(c.id);
      renderCases();
    });
    actions.append(del);
    tr.append(actions);
    table.append(tr);
  });

  div.append(table);
  main.append(div);
}

async function renderReport() {
  clearMain();
  const cases = await TestCase.getAll();
  const headers = ['TC ID', 'Reference Req', 'Module', 'Scenario', 'Description', 'Pre-req', 'Steps', 'Expected Result', 'Status'];
  const rows = cases.map(c => [c.tcId, c.referenceReq, c.module, c.scenario, c.description, c.prerequisites, c.steps, c.expectedResult, c.status]);

  const div = document.createElement('div');
  ['CSV', 'PDF', 'Excel'].forEach(type => {
    const btn = document.createElement('button');
    btn.textContent = `Export ${type}`;
    btn.addEventListener('click', () => {
      if (type === 'CSV') exportCSV(rows, headers);
      if (type === 'PDF') {
        const text = [headers.join(' | '), ...rows.map(r => r.join(' | '))].join('\n');
        exportPDF(text);
      }
      if (type === 'Excel') exportExcel(rows, headers);
    });
    div.append(btn);
  });

  main.append(div);
}

// Expose globally
window.renderSuites = renderSuites;
window.renderCases = renderCases;
window.renderReport = renderReport;
// Create‑button dropdown logic
const createBtn = document.getElementById('create-btn');
const createMenu = document.getElementById('create-menu');

createBtn.addEventListener('click', () => createMenu.classList.toggle('hidden'));

// Close menu when clicking outside
document.addEventListener('click', e => {
  if (!createBtn.contains(e.target) && !createMenu.contains(e.target)) {
    createMenu.classList.add('hidden');
  }
});

// On selecting a menu item
createMenu.querySelectorAll('li').forEach(li => {
  li.addEventListener('click', () => {
    createMenu.classList.add('hidden');
    const type = li.dataset.type;
    openCreateModal(type);
  });
});

// Function to open appropriate modal
function openCreateModal(type) {
  switch (type) {
    case 'plan':
      return openPlanModal();
    case 'suite':
      return openSuiteModal();
    case 'execution':
      return openExecutionModal();
  }
}
function openPlanModal() {
  document.getElementById('modal-plan').classList.remove('hidden');
}
function openSuiteModal() {
  document.getElementById('modal-suite').classList.remove('hidden');
}
function openExecutionModal() {
  document.getElementById('modal-execution').classList.remove('hidden');
}
function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
}