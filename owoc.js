const API_URL = 'https://script.google.com/macros/s/AKfycbwAmFJkJCc0jx4zP4nHday78jejaIpEWd7054tO1USmiOEQ0zE-MKGx0y8aJj7yWt6Bgw/exec';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('entry-form');
  const tbody = document.getElementById('entries');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = document.getElementById('data').value;
    const czas = document.getElementById('czas').value;

    if (!data || !czas) return;

    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, czas })
    });

    form.reset();
    renderEntries();
  });

  function parseTimeToMinutes(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  }

  function formatMinutesToHM(mins) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}:${m.toString().padStart(2, '0')}`;
  }

  async function render() {
  const entries = await fetchEntries();
  const tbody = document.getElementById('entries');
  tbody.innerHTML = '';
  let monthTotal = 0;
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  entries.forEach(e => {
    const tr = document.createElement('tr');
    const td1 = document.createElement('td');
    const td2 = document.createElement('td');
    td1.textContent = e.data;
    td2.textContent = e.czas;
    tr.append(td1, td2);
    tbody.appendChild(tr);

    // Wyciągamy datę tylko do porównania miesiąca
    const [day, month, year] = e.data.split('.').map(Number);
    const fullYear = 2000 + year; // z "25" zrobimy "2025"

    if (fullYear === currentYear && month - 1 === currentMonth) {
      const [h, m] = e.czas.split(':').map(Number);
      monthTotal += h * 60 + m;
    }
  });

  const goalMinutes = 30 * 60;
  const toGoal = goalMinutes - monthTotal;
  const daysLeft = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate();
  const avgPerDay = daysLeft > 0 ? Math.ceil(toGoal / daysLeft) : 0;

  document.getElementById('total-month').textContent = minutesToHM(monthTotal);
  document.getElementById('left-to-goal').textContent = minutesToHM(Math.max(toGoal, 0));
  document.getElementById('avg-daily').textContent = minutesToHM(avgPerDay);
}

  renderEntries();
});

