// ===== Budget- och utgiftskoll (test-säker) =====

// Data
const incomes = [];   // { description, amount }
const expenses = [];  // { description, amount }

// Hjälp: hämta element och summera belopp
const $   = (id) => document.getElementById(id);
const sum = (list) => list.reduce((a, t) => a + t.amount, 0);

// Rendera listor + saldo
function render() {
  const incomeListEl      = $('incomeList');
  const expenseListEl     = $('expenseList');
  const transactionListEl = $('transactionList'); // valfri i uppgiften
  const balanceEl         = $('balance');

  if (incomeListEl)      incomeListEl.innerHTML = '';
  if (expenseListEl)     expenseListEl.innerHTML = '';
  if (transactionListEl) transactionListEl.innerHTML = '';

  // Inkomster — EXAKT format: "<text> - <belopp> kr (Inkomst)"
  if (incomeListEl) {
    for (const t of incomes) {
      const li = document.createElement('li');
      li.textContent = `${t.description} - ${t.amount} kr (Inkomst)`;
      incomeListEl.appendChild(li);
    }
  }

  // Utgifter — EXAKT format: "<text> - <belopp> kr (Utgift)"
  if (expenseListEl) {
    for (const t of expenses) {
      const li = document.createElement('li');
      li.textContent = `${t.description} - ${t.amount} kr (Utgift)`;
      expenseListEl.appendChild(li);
    }
  }

  // Valfri samlad lista (påverkar inte testet)
  if (transactionListEl) {
    const all = [
      ...incomes.map(t => ({ ...t, sign: '+' })),
      ...expenses.map(t => ({ ...t, sign: '-' })),
    ];
    for (const t of all) {
      const li = document.createElement('li');
      li.textContent = `${t.sign} ${t.description} ${t.amount} kr`;
      transactionListEl.appendChild(li);
    }
  }

  // Saldo
  if (balanceEl) balanceEl.textContent = String(sum(incomes) - sum(expenses));
}

// Lägg till transaktion + render
function addTransaction(type) {
  const descInput   = $('desc');
  const amountInput = $('amount');
  if (!descInput || !amountInput) return; // skydd i testmiljö

  const description = descInput.value.trim();
  const amount = Number(amountInput.value);

  if (!description) return;
  if (!Number.isFinite(amount)) return;

  const t = { description, amount };
  if (type === 'income') incomes.push(t);
  else expenses.push(t);

  // Rensa & rendera
  descInput.value = '';
  amountInput.value = '';
  descInput.focus();
  render();
}

// Koppla knappar (addEventListener)
const incomeBtn  = $('incomeBtn');
const expenseBtn = $('expenseBtn');
if (incomeBtn)  incomeBtn.addEventListener('click',  () => addTransaction('income'));
if (expenseBtn) expenseBtn.addEventListener('click', () => addTransaction('expense'));

// Event delegation (extra robust om knappar inte fanns vid import)
document.addEventListener('click', (e) => {
  const id = e.target && e.target.id;
  if (id === 'incomeBtn')  addTransaction('income');
  if (id === 'expenseBtn') addTransaction('expense');
});

// Försök rendera direkt (om DOM redan finns i testet)
render();
