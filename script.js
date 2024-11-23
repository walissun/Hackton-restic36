// Inicializa o mapa
const map = L.map("map").setView([-12.9777, -38.5016], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

let routingControl; // Controle de rota global
let selectedTransportMode = "walking"; // Modalidade padrão

// Modos de transporte e seus equivalentes no OSRM
const transportModes = {
  walking: "foot",
  bicycling: "bike",
  driving: "car",
};

// Abrir o modal
document.getElementById("openModal").addEventListener("click", () => {
  document.getElementById("transportModal").style.display = "flex";
});

// Fechar o modal
document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("transportModal").style.display = "none";
});

// Selecionar o modo de transporte
document.querySelectorAll(".transport-option").forEach((button) => {
  button.addEventListener("click", (e) => {
    selectedTransportMode = e.target.getAttribute("data-mode");
    document.getElementById("transportModal").style.display = "none";
    alert(`Modo de transporte selecionado: ${selectedTransportMode}`);
  });
});

// Calcular rota
document.getElementById("routePlannerForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const origin = document.getElementById("origin").value;
  const destination = document.getElementById("destination").value;

  if (!origin || !destination) {
    alert("Por favor, insira os endereços de origem e destino.");
    return;
  }

  // Obter coordenadas dos endereços usando Nominatim
  Promise.all([
    fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        origin
      )}&format=json`
    ).then((res) => res.json()),
    fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        destination
      )}&format=json`
    ).then((res) => res.json()),
  ])
    .then(([originResults, destinationResults]) => {
      if (!originResults.length || !destinationResults.length) {
        alert(
          "Não foi possível encontrar uma localização. Verifique os endereços."
        );
        return;
      }

      const originCoords = [
        parseFloat(originResults[0].lat),
        parseFloat(originResults[0].lon),
      ];
      const destinationCoords = [
        parseFloat(destinationResults[0].lat),
        parseFloat(destinationResults[0].lon),
      ];

      // Remover rota anterior, se existir
      if (routingControl) map.removeControl(routingControl);

      // Criar nova rota
      routingControl = L.Routing.control({
        waypoints: [
          L.latLng(originCoords),
          L.latLng(destinationCoords),
        ],
        router: L.Routing.osrmv1({
          serviceUrl: `https://router.project-osrm.org/route/v1/${transportModes[selectedTransportMode]}`,
        }),
        lineOptions: {
          styles: [{ color: "blue", opacity: 0.6, weight: 4 }],
        },
        routeWhileDragging: true,
        showAlternatives: false,
        addWaypoints: false,
      }).addTo(map);
    })
    .catch((error) => {
      console.error("Erro ao calcular rota:", error);
      alert("Erro ao calcular a rota. Tente novamente.");
    });
});

// Localizar o usuário
function locateUser() {
  map.locate({ setView: true, maxZoom: 16 });
  map.on("locationfound", (e) => {
    L.marker(e.latlng).addTo(map).bindPopup("Você está aqui!").openPopup();
  });
}

// Resetar o mapa
function resetMap() {
  map.setView([-12.9777, -38.5016], 13);
  if (routingControl) map.removeControl(routingControl);
}
