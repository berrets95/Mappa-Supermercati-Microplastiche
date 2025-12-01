/* ==========================================================
   INIZIALIZZAZIONE MAPPA LEAFLET
   ========================================================== */

const map = L.map('map').setView([41.8719, 12.5674], 6); // Italia

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap Contributors'
}).addTo(map);

let markerGroup = L.layerGroup().addTo(map);


/* ==========================================================
   CARICAMENTO DATI SUPERMERCATI (da JSON)
   ========================================================== */

fetch('supermercati.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(item => {
            const marker = L.marker([item.lat, item.lng]).addTo(markerGroup);

            marker.bindPopup(`
                <b>${item.nome}</b><br>
                ${item.indirizzo}<br>
                Microplastiche: <b>${item.microplastiche}</b>
            `);

            item.marker = marker;
        });

        // salvo i dati globalmente per la ricerca
        window.supermercatiData = data;
    });


/* ==========================================================
   FUNZIONE DI RICERCA SUPERMERCATI
   ========================================================== */

const searchInput = document.getElementById('search');

searchInput.addEventListener('input', function () {
    const query = this.value.toLowerCase();

    if (!window.supermercatiData) return;

    markerGroup.clearLayers();

    window.supermercatiData.forEach(item => {
        const match =
            item.nome.toLowerCase().includes(query) ||
            item.indirizzo.toLowerCase().includes(query);

        if (match) {
            item.marker.addTo(markerGroup);
        }
    });
});


/* ==========================================================
   GESTIONE PDF
   ========================================================== */

// Pulsante Contenitori
document.getElementById('btn-contenitori').addEventListener('click', function () {
    showPDF('pdf/contenitori.pdf');
});

// Pulsante Informative
document.getElementById('btn-informative').addEventListener('click', function () {
    showPDF('pdf/informative.pdf');
});

// Pulsante Indietro
document.getElementById('btn-back').addEventListener('click', function () {
    hidePDF();
});


/* ==========================================================
   FUNZIONI PDF
   ========================================================== */

function showPDF(path) {
    document.getElementById('map').style.display = 'none';
    document.getElementById('header').style.display = 'none';

    const viewer = document.getElementById('pdf-viewer');
    viewer.style.display = 'block';

    const frame = document.getElementById('pdf-frame');
    frame.src = path;
}

function hidePDF() {
    document.getElementById('pdf-frame').src = '';
    document.getElementById('pdf-viewer').style.display = 'none';

    document.getElementById('map').style.display = 'block';
    document.getElementById('header').style.display = 'flex';
}
