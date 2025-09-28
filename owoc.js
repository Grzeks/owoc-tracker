const API_URL = 'https://script.google.com/macros/s/AKfycbxZBWYgelwnO1T5m-T-xYxH7Z04gr3H1JF8h6Q1fDb_jlj4lv5UR3TLImcBXJXCTkYvgQ/exec';

const CEL_GODZIN = 30;

document.addEventListener('DOMContentLoaded', () => {
  fetchData();

  document.getElementById('entry-form').addEventListener('submit', e => {
    e.preventDefault();
    const data = document.getElementById('data').value;
    const czas = document.getElementById('czas').value;
    if (!data || !czas) return alert('Wpisz datę i czas.');

    const parsedData = formatDateForServer(data);
    const payload = { data: parsedData, czas };

    fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(() => {
      document.getElementById('data').value = '';
      document.getElementById('czas').value = '';
      fetchData();
    })
    .catch(err => {
      console.error('❌ Błąd zapisu:', err);
      alert('Błąd podczas zapisu! Sprawdź połączenie i uprawnienia API.');
    });
  });
});

function fetchData() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      console.info('📦 Odebrano dane z serwera:', data);
      displayEntries(data);
      calculateSummary(data);
    })
    .catch(err => {
      console.error('❌ Błąd pobierania:', err);
      alert('Nie udało się pobrać danych z serwera.');
    });
}

function displayEntries(entries) {
  const tbody = document.getElementById('entries');
  tbody.innerHTML = '';

  entries.forEach(entry => {
    const tr = document.createElement('tr');
    const tdData = document.createElement('td');
    const tdCzas = document.createElement('td');
    tdData.textContent = entry.data;
    tdCzas.textContent = entry.czas;
    tr.append(tdData, tdCzas);
    tbody.appendChild(tr);
  });
}

function calculateSummary(entries) {
  let totalMinutes = 0;

  for (const entry of entries) {
    const [h, m] = entry.czas.split(':').map(Number);
    totalMinutes += h * 60 + m;
  }

  const totalHours = Math.floor(totalMinutes / 60);
  const totalRest = totalMinutes % 60;

  document.getElementById('total-month').textContent = `${totalHours}:${totalRest.toString().padStart(2, '0')}`;

  const minutesGoal = CEL_GODZIN * 60;
  const minutesLeft = Math.max(0, minutesGoal - totalMinutes);
  const leftHours = Math.floor(minutesLeft / 60);
  const leftRest = minutesLeft % 60;
  document.getElementById('left-to-goal').textContent = `${leftHours}:${leftRest.toString().padStart(2, '0')}`;

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-based
  const lastDay = new Date(year, month + 1, 0).getDate();
  const daysLeft = Math.max(1, lastDay - today.getDate() + 1);
  const avgPerDay = Math.ceil(minutesLeft / daysLeft);
  const avgH = Math.floor(avgPerDay / 60);
  const avgM = avgPerDay % 60;

  document.getElementById('avg-daily').textContent = `${avgH}:${avgM.toString().padStart(2, '0')}`;
}

function formatDateForServer(dateStr) {
  const [year, month, day] = dateStr.split('-');
  return `${day}.${month}.${year.slice(-2)}`;
}








