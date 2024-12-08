import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
// import * as mapboxgl from 'mapbox-gl';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule],
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.scss'
})
export class MapaComponent {
  map: google.maps.Map | undefined;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    console.log('Ambiente detectado:', this.isBrowser ? 'Navegador' : 'SSR');
  }

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      console.warn('Este código só deve ser executado no navegador.');
      return;
    }

    this.loadGoogleMaps().then(() => {
      const mapOptions: google.maps.MapOptions = {
        zoom: 10,
        center: { lat: 40.7128, lng: -74.006 },
      };

      this.map = new google.maps.Map(
        document.getElementById('map') as HTMLElement,
        mapOptions
      );

      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer();
      directionsRenderer.setMap(this.map);

      const routeRequest: google.maps.DirectionsRequest = {
        origin: { lat: -12.975392, lng: -38.501316 },
        destination: { lat: -12.965769, lng: -38.513417 },
        travelMode: google.maps.TravelMode.DRIVING,
      };

      directionsService.route(routeRequest, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          directionsRenderer.setDirections(result);
        } else {
          console.error('Erro ao traçar rota:', status);
        }
      });
    });
  }

  loadGoogleMaps(): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') {
        // Evita execução no SSR
        resolve();
        return;
      }
  
      if (typeof window.google !== 'undefined') {
        resolve();
        return;
      } 

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDZXh7-sUunfyVpOo8gA4PqX99QW_xw9qA`;
      script.async = true;
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  }

}
