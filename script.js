const map = L.map('map').setView([41.9, 12.5], 6);

// Aggiungo le tiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Provo a centrare sulla posizione dell’utente
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(pos => {
    map.setView([pos.coords.latitude, pos.coords.longitude], 13);
  });
}

// Carico i punti di interesse
fetch('pois.json')
  .then(res => res.json())
  .then(pois => {
    const list = document.getElementById('poi-list');
    pois.sort((a, b) => a.comune.localeCompare(b.comune));

    pois.forEach(poi => {
      const li = document.createElement('li');
      li.textContent = `${poi.comune} – ${poi.nome}`;
      list.appendChild(li);

      const marker = L.marker([poi.lat, poi.lng])
        .addTo(map)
        .bindPopup(`<b>${poi.nome}</b><br>${poi.comune}`);

      li.addEventListener('click', () => {
        map.setView([poi.lat, poi.lng], 15);
        marker.openPopup();
      });
    });
  });

// Aggiungo ricerca semplice
document.getElementById('search').addEventListener('input', function () {
  const query = this.value.toLowerCase();
  document.querySelectorAll('#poi-list li').forEach(li => {
    li.style.display = li.textContent.toLowerCase().includes(query) ? '' : 'none';
  });
});
