const API_URL = 'https://script.google.com/macros/s/AKfycbwAmFJkJCc0jx4zP4nHday78jejaIpEWd7054tO1USmiOEQ0zE-MKGx0y8aJj7yWt6Bgw/exec';
const MONTH_GOAL_HOURS = 30;

// ⏳ Funkcja formatowania minut na "hh:mm"
function formatMinutes(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// 🧾 Ładowanie danych z arkusza i aktualizacja tabeli
async function loadData() {
    const res = await fetch(API_URL + '?action=get');
    const data = await res.json();

    const tableBody = document.querySelector('#details tbody');
    tableBody.innerHTML = '';

    let totalMinutes = 0;
    const today = new Date();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const currentDay = today.getDate();
    const daysLeft = lastDay - currentDay + 1;

    for (const row of data) {
        const tr = document.createElement('tr');
        const tdDate = document.createElement('td');
        const tdTime = document.createElement('td');

        tdDate.textContent = row.data;
        tdTime.textContent = row.czas;
        tr.appendChild(tdDate);
        tr.appendChild(tdTime);
        tableBody.appendChild(tr);

        const [h, m] = row.czas.split(':').map(Number);
        totalMinutes += h * 60 + m;
    }

    const totalHours = totalMinutes / 60;
    const goalMinutes = MONTH_GOAL_HOURS * 60;
    const remainingMinutes = Math.max(0, goalMinutes - totalMinutes);
    const avgPerDay = daysLeft > 0 ? remainingMinutes / daysLeft : 0;

    document.getElementById('total').textContent = formatMinutes(totalMinutes);
    document.getElementById('remaining').textContent = formatMinutes(remainingMinutes);
    document.getElementById('avg').textContent = formatMinutes(Math.round(avgPerDay));
}

// 💾 Obsługa zapisu danych po kliknięciu "Zapisz"
document.getElementById('saveBtn').addEventListener('click', async () => {
    const date = document.getElementById('dateInput').value;
    const time = document.getElementById('timeInput').value;

    if (!date || !time) {
        alert('Uzupełnij datę i czas');
        return;
    }

    const formData = new FormData();
    formData.append('data', date);
    formData.append('czas', time);
    formData.append('action', 'add');

    const res = await fetch(API_URL, {
        method: 'POST',
        body: formData
    });

    const result = await res.json();
    if (result.status === 'ok') {
        loadData();
        document.getElementById('dateInput').value = '';
        document.getElementById('timeInput').value = '';
    } else {
        alert('Błąd podczas zapisu');
    }
});

// ⏱ Start
loadData();
