import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import  'leaflet-routing-machine';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  
  map!: L.Map;
  routingControl: any;
  origin: string = '';
  destination: string = '';
  transportMode: string = 'foot';
  
  ngOnInit(): void {
    // console.log(L.Routing);
    this.initializeMap();
  }

  initializeMap(): void {
    this.map = L.map('map').setView([-12.9777, -38.5016], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);
  }

  handleRoutePlannerFormSubmit(): void {
    if (!this.origin || !this.destination) {
      alert('Por favor, insira os endereços de origem e destino.');
      return;
    }

    this.fetchCoordinates(this.origin, this.destination)
      .then((coords) => this.setupRouting(coords))
      .catch((err) => alert(err.message));
  }

  async fetchCoordinates(origin: string, destination: string): Promise<any> {
    const originUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(origin)}&format=json`;
    const destinationUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destination)}&format=json`;

    return Promise.all([
      fetch(originUrl).then((res) => res.json()),
      fetch(destinationUrl).then((res) => res.json()),
    ]).then(([originResults, destinationResults]) => {
      if (!originResults.length || !destinationResults.length) {
        throw new Error('Não foi possível encontrar uma localização. Verifique os endereços.');
      }

      const originCoords = [
        parseFloat(originResults[0].lat),
        parseFloat(originResults[0].lon),
      ];
      const destinationCoords = [
        parseFloat(destinationResults[0].lat),
        parseFloat(destinationResults[0].lon),
      ];

      return { originCoords, destinationCoords };
    });
  }

  setupRouting({ originCoords, destinationCoords }: any): void {
    if (this.routingControl) {
      this.map.removeControl(this.routingControl);
    }

    // this.routingControl = L.Routing.control({
    //   waypoints: [
    //     L.latLng(originCoords),
    //     L.latLng(destinationCoords),
    //   ],
    //   lineOptions: {
    //     styles: [{ color: 'blue', opacity: 0.6, weight: 4 }],
    //   },
    //   routeWhileDragging: true,
    //   addWaypoints: false,
    // }).addTo(this.map);
  }

  locateUser(): void {
    this.map.locate({ setView: true, maxZoom: 16 });
  }

  resetMap(): void {
    this.map.setView([-12.9777, -38.5016], 13);
    if (this.routingControl) {
      this.map.removeControl(this.routingControl);
      this.routingControl = null;
    }
  }

}
