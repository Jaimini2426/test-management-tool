const main = document.getElementById('main');
function clearMain() { main.innerHTML = ''; }
function createInlineForm(fields, onSubmit, submitText='Save') {
  const form = document.createElement('form');
  form.className = 'inline-form';
  fields.forEach(f => {
    let el;
    if (f.type==='select') {
      el = document.createElement('select');
      f.options.forEach(o => el.add(new Option(o.text, o.value)));
    } else {
      el = document.createElement('input');
      el.type = f.type;
      el.placeholder = f.placeholder || '';
    }
    el.name = f.name;
    el.value = f.value || '';
    form.append(el);
  });
  const btn = document.createElement('button');
  btn.type = 'submit';
  btn.textContent = submitText;
  form.append(btn);
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = {};
    fields.forEach(f => data[f.name] = form.elements[f.name].value);
    onSubmit(data);
  });
  return form;
}

async function renderSuites() {
  clearMain();
  const suites = await TestSuite.getAll();
  const div = document.createElement('div');
  div.append(createInlineForm([
    { name:'name', type:'text', placeholder:'Suite name' },
    { name:'description', type:'text', placeholder:'Description' }
  ], async data => {
    await TestSuite.create(data);
    renderSuites();
  }, 'Add Suite'));

  const table = document.createElement('table');
  table.innerHTML = `<tr><th>ID</th><th>Name</th><th>Description</th><th>Actions</th></tr>`;
  suites.forEach(s => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${s.id}</td><td><input value="${s.name}" /></td><td><input value="${s.description}" /></td>`;
    const tdActs = document.createElement('td');
    tdActs.className = 'actions';
    const saveBtn = document.createElement('button'); saveBtn.textContent='Save';
    saveBtn.addEventListener('click', async () => {
      await TestSuite.update({ id:s.id, name:tr.children[1].firstElementChild.value, description:tr.children[2].firstElementChild.value });
      renderSuites();
    });
    const delBtn = document.createElement('button'); delBtn.textContent='Delete';
    delBtn.addEventListener('click', async () => {
      await TestSuite.delete(s.id);
      renderSuites();
    });
    tdActs.append(saveBtn, delBtn);
    tr.append(tdActs);
    table.append(tr);
  });
  div.append(table);
  main.append(div);
}

async function renderCases() {
  clearMain();
  const suites = await TestSuite.getAll();
  const reqs = await Requirement.getAll();
  const cases = await TestCase.getAll();
  const div = document.createElement('div');
  div.append(createInlineForm([
  { name:'tcId', type:'text', placeholder:'TC ID' },
  { name:'referenceReq', type:'text', placeholder:'Reference Req' },
  { name:'module', type:'text', placeholder:'Module/Sub-module' },
  { name:'scenario', type:'text', placeholder:'Test Scenario' },
  {name: 'description', type:'text', placeholder:'Description'},
  { name:'prerequisites', type:'text', placeholder:'Pre-requisites' },
  { name:'steps', type:'text', placeholder:'Steps' },
  { name:'expectedResult', type:'text', placeholder:'Expected Result' },
  { name:'suiteId', type:'select', options: suites.map(s => ({ text: s.name, value: s.id })) },
], async data => {
  data.status = 'to-do';
  await TestCase.create(data);
  renderCases();
}, 'Add Case'));


  const table = document.createElement('table');
 table.innerHTML = `
  <tr>
    <th>TC ID</th>
    <th>Reference Req</th>
    <th>Module</th>
    <th>Scenario</th>
    <th>Description</th>
    <th>Pre-req</th>
    <th>Steps</th>
    <th>Expected Result</th>
    <th>Status</th>
    <th>Actions</th>
  </tr>
`;
  for (const c of cases) {
    const suite = suites.find(s=>s.id==c.suiteId)?.name||'';
    const req = reqs.find(r=>r.id==c.requirementLink)?.title||'';
    const tr = document.createElement('tr');
   tr.innerHTML = `
  <td>${c.tcId || ''}</td>
  <td>${c.referenceReq || ''}</td>
  <td>${c.module || ''}</td>
  <td>${c.scenario || ''}</td>
  <td>${c.description|| ''}</td>
  <td>${c.prerequisites || ''}</td>
  <td>${c.steps || ''}</td>
  <td>${c.expectedResult || ''}</td>
  <td class="status-td">${c.status}</td>
`;
const tdActs = document.createElement('td');
    tdActs.className = 'actions';
    ['to-do','in progress','pass','fail','NA'].forEach(st=>{
      const btn = document.createElement('button');
      btn.textContent = st;
      btn.addEventListener('click', async ()=>{
        c.status = st;
        await TestCase.update(c);
        await Execution.record(c.id, st);
        renderCases();
      });
      tdActs.append(btn);
    });
    const delBtn = document.createElement('button'); delBtn.textContent='Delete';
    delBtn.addEventListener('click', async ()=>{ await TestCase.delete(c.id); renderCases(); });
    tdActs.append(delBtn);
    tr.append(tdActs);
    table.append(tr);
  }
  div.append(table);
  main.append(div);
}

async function renderReport() {
  clearMain();
  const cases = await TestCase.getAll();
  const suites = await TestSuite.getAll();
  const headers = ['TC ID','Reference Req','Module','Scenario','Description','Pre-req','Steps','Expected','Status'];
const rows = cases.map(c => [
  c.tcId, c.referenceReq, c.module, c.scenario, c.description, c.prerequisites,
  c.steps, c.expectedResult, c.status
]);
const div = document.createElement('div');
  const exportCSVBtn = document.createElement('button'); exportCSVBtn.textContent='Export CSV';
  exportCSVBtn.addEventListener('click', () => exportCSV(rows, headers));
  div.append(exportCSVBtn);
  const exportPDFBtn = document.createElement('button'); exportPDFBtn.textContent='Export PDF';
  exportPDFBtn.addEventListener('click', () => exportPDF(rows.map(r => r.join(' | ')).join('\n'), 'report.pdf'));
  div.append(exportPDFBtn);
  main.append(div);
}

export { renderSuites, renderCases, renderReport };
