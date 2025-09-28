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

  async function renderEntries() {
    const res = await fetch(API_URL);
    const data = await res.json();
    tbody.innerHTML = '';
    let totalMinutes = 0;
    const now = new Date();
    const currentMonth = now.getMonth();

    data.forEach(row => {
      const tr = document.createElement('tr');
      const td1 = document.createElement('td');
      const td2 = document.createElement('td');
      td1.textContent = row.data;
      td2.textContent = row.czas;
      tr.append(td1, td2);
      tbody.appendChild(tr);

      const rowDate = new Date(row.data);
      if (rowDate.getMonth() === currentMonth) {
        totalMinutes += parseTimeToMinutes(row.czas);
      }
    });

    const totalMonth = formatMinutesToHM(totalMinutes);
    const goalMinutes = 30 * 60;
    const leftToGoal = Math.max(goalMinutes - totalMinutes, 0);
    const daysLeft = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate();
    const avgDaily = daysLeft > 0 ? Math.ceil(leftToGoal / daysLeft) : 0;

    document.getElementById('total-month').textContent = totalMonth;
    document.getElementById('left-to-goal').textContent = formatMinutesToHM(leftToGoal);
    document.getElementById('avg-daily').textContent = formatMinutesToHM(avgDaily);
  }

  renderEntries();
});
