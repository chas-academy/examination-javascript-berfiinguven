// ====== Budget- och utgiftskoll (test-säker) ======

// Data
const incomes = [];   // { description, amount, type: 'income' }
const expenses = [];  // { description, amount, type: 'expense' }

// Hjälpare: hämta element när de finns
function els() {
  return {
    descInput:        document.getElementById('desc'),
    amountInput:      document.getElementById('amount'),
    incomeBtn:        document.getElementById('incomeBtn'),
    expenseBtn:       document.getElementById('expenseBtn'),
    incomeListEl:     document.getElementById('incomeList'),
    expenseListEl:    document.getElementById('expenseList'),
    transactionListEl:document.getElementById('transactionList'),
    balanceEl:        document.getElementById('balance'),
  };
}

// Summera belopp i en lista
function sum(list) {
  return list.reduce((acc, t) => acc + t.amount, 0);
}

// Rendera alla listor + saldo (hoppar tyst om DOM saknas)
function render() {
  const { incomeListEl, expenseListEl, transactionListEl, balanceEl } = els();
  if (!incomeListEl || !expenseListEl || !transactionListEl || !balanceEl) return;

  incomeListEl.innerHTML = '';
  expenseListEl.innerHTML = '';
  transactionListEl.innerHTML = '';

  // EXAKT format som testen förväntar sig (obs: vanligt minus '-')
  for (const t of incomes) {
    const li = document.createElement('li');
    li.textContent = `${t.description} - ${t.amount} kr (Inkomst)`;
    incomeListEl.appendChild(li);
  }

  for (const t of expenses) {
    const li = document.createElement('li');
    li.textContent = `${t.description} - ${t.amount} kr (Utgift)`;
    expenseListEl.appendChild(li);
  }

  // Samlad lista (valfritt för test, men trevligt)
  const all = [
    ...incomes.map(t => ({ ...t, sign: '+' })),
    ...expenses.map(t => ({ ...t, sign: '-' })),
  ];
  for (const t of all) {
    const li = document.createElement('li');
    li.textContent = `${t.sign} ${t.description} - ${t.amount} kr`;
    transactionListEl.appendChild(li);
  }

  // Saldot = inkomster – utgifter
  const balance = sum(incomes) - sum(expenses);
  balanceEl.textContent = String(balance);
}

// Lägg till transaktion och rendera
function addTransaction(type) {
  const { descInput, amountInput } = els();
  if (!descInput || !amountInput) return; // skydd i Jest

  const description = descInput.value.trim();
  const amount = Number(amountInput.value);

  if (!description) return;
  if (!Number.isFinite(amount)) return;

  const t = { description, amount, type };
  if (type === 'income') incomes.push(t);
  else expenses.push(t);

  // Töm fälten (testen kontrollerar detta)
  descInput.value = '';
  amountInput.value = '';
  descInput.focus();

  render();
}

// ---- Koppla knappar (både direkt och via delegation som fallback) ----
(function wireUp() {
  // Direkt (om elementen finns nu)
  const { incomeBtn, expenseBtn } = els();
  if (incomeBtn) incomeBtn.addEventListener('click', () => addTransaction('income'));
  if (expenseBtn) expenseBtn.addEventListener('click', () => addTransaction('expense'));

  // Fallback: delegation (ifall knapparna saknas vid load i test)
  document.addEventListener('click', (e) => {
    const id = e.target && e.target.id;
    if (id === 'incomeBtn')  addTransaction('income');
    if (id === 'expenseBtn') addTransaction('expense');
  });

  // Försök rendera (om DOM redan finns)
  render();
})();
