document.addEventListener("DOMContentLoaded", () => {
  initializeMap();
  setupEventListeners();
});

function initializeMap() {
  const map = L.map("map").setView([-12.9777, -38.5016], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  window.map = map;
  window.routingControl = null;
}

function setupEventListeners() {
  document.getElementById("routePlannerForm").addEventListener("submit", handleRoutePlannerFormSubmit);
  document.getElementById("locateUserButton").addEventListener("click", locateUser);
  document.getElementById("resetMapButton").addEventListener("click", resetMap);
}

function handleRoutePlannerFormSubmit(e) {
  e.preventDefault();

  const origin = document.getElementById("origin").value;
  const destination = document.getElementById("destination").value;
  const transportMode = document.getElementById("transportMode").value;

  if (!origin || !destination) {
    alert("Por favor, insira os endereços de origem e destino.");
    return;
  }

  fetchCoordinates(origin, destination, transportMode)
    .then(setupRouting)
    .catch(handleRoutingError);
}

function fetchCoordinates(origin, destination, transportMode) {
  const originUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(origin)}&format=json`;
  const destinationUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destination)}&format=json`;

  return Promise.all([
    fetch(originUrl).then(res => res.json()),
    fetch(destinationUrl).then(res => res.json())
  ]).then(([originResults, destinationResults]) => {
    if (!originResults.length || !destinationResults.length) {
      throw new Error("Não foi possível encontrar uma localização. Verifique os endereços.");
    }

    const originCoords = [parseFloat(originResults[0].lat), parseFloat(originResults[0].lon)];
    const destinationCoords = [parseFloat(destinationResults[0].lat), parseFloat(destinationResults[0].lon)];

    return { originCoords, destinationCoords, transportMode };
  });
}

function setupRouting({ originCoords, destinationCoords, transportMode }) {
  // Remover rota anterior, se existir
  if (window.routingControl) window.map.removeControl(window.routingControl);

// Criar nova rota
window.routingControl = L.Routing.control({
  waypoints: [
    L.latLng(originCoords),
    L.latLng(destinationCoords),
  ],
  router: L.Routing.osrmv1({
    serviceUrl: `https://router.project-osrm.org/route/v1/`,
  }),
  lineOptions: {
    styles: [{ color: "blue", opacity: 0.6, weight: 4 }],
  },
  routeWhileDragging: true,
  showAlternatives: false,
  addWaypoints: false,
}).addTo(map);
}

/* ${transportMode} Resolver erro de depuração desse objeto*/