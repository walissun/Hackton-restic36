declare module 'leaflet-routing-machine' {
  import * as L from 'leaflet';

  namespace Routing {
    interface ControlOptions extends L.ControlOptions {
      waypoints: L.LatLng[];
      lineOptions?: L.PathOptions;
      routeWhileDragging?: boolean;
      addWaypoints?: boolean;
    }

    class Control extends L.Control {
      constructor(options: ControlOptions);
    }
  }

  const Routing: {
    control(options: Routing.ControlOptions): Routing.Control;
  };

  export = Routing;
}