const API_URL = 'https://script.google.com/macros/s/AKfycbyC1xwBKI-B-fylF_r7gM5ch6UuHnC8tHzSP22TEYcGTdVirHkXyFX6xctHYmCoj3Ftsg/exec';

document.addEventListener('DOMContentLoaded', () => {
  pobierzDane();

  const form = document.getElementById('entry-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = document.getElementById('data').value;
    const czas = document.getElementById('czas').value;
    if (!data || !czas) return;

    await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ data, czas }),
      headers: { 'Content-Type': 'application/json' }
    });

    form.reset();
    pobierzDane();
  });
});

async function pobierzDane() {
  try {
    const res = await fetch(API_URL);
    const dane = await res.json();
    console.log("📥 Odebrano dane z serwera:", dane);

    const tbody = document.getElementById('entries');
    tbody.innerHTML = '';

    let totalMinutes = 0;

    dane.forEach(entry => {
      const row = document.createElement('tr');

      // 👇 Data: już jako string dd.mm.yy – nie trzeba Date()
      const cellDate = document.createElement('td');
      cellDate.textContent = entry.data;

      // 👇 Czas: też gotowy string (np. "1:30")
      const cellTime = document.createElement('td');
      cellTime.textContent = entry.czas;

      row.appendChild(cellDate);
      row.appendChild(cellTime);
      tbody.appendChild(row);

      // 💡 Dodaj do sumy:
      const [h, m] = entry.czas.split(':').map(Number);
      totalMinutes += h * 60 + m;
    });

    aktualizujPodsumowanie(totalMinutes);
  } catch (err) {
    console.error('❌ Błąd podczas pobierania danych:', err);
  }
}

function aktualizujPodsumowanie(totalMinutes) {
  const totalHours = Math.floor(totalMinutes / 60);
  const totalRemainingMinutes = totalMinutes % 60;

  document.getElementById('total-month').textContent = `${totalHours}:${totalRemainingMinutes.toString().padStart(2, '0')}`;

  const celMinut = 30 * 60;
  const left = celMinut - totalMinutes;
  const leftHours = Math.floor(left / 60);
  const leftMinutes = left % 60;

  document.getElementById('left-to-goal').textContent = `${leftHours}:${leftMinutes.toString().padStart(2, '0')}`;

  const dzisiaj = new Date();
  const dniWRoku = new Date(dzisiaj.getFullYear(), dzisiaj.getMonth() + 1, 0).getDate();
  const dzis = dzisiaj.getDate();
  const dniPozostale = dniWRoku - dzis;

  const avgDaily = dniPozostale > 0 ? left / dniPozostale : 0;
  const avgHours = Math.floor(avgDaily / 60);
  const avgMinutes = Math.round(avgDaily % 60);

  document.getElementById('avg-daily').textContent = `${avgHours}:${avgMinutes.toString().padStart(2, '0')}`;

  console.log(`✅ Suma: ${totalHours}:${totalRemainingMinutes.toString().padStart(2, '0')}`);
}

