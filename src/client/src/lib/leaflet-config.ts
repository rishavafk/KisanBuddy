import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Global Leaflet configuration - should only be run once
let leafletConfigured = false;

export function configureLeaflet() {
  if (leafletConfigured) return;
  
  // Fix for Leaflet default markers
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
  
  leafletConfigured = true;
}

export { L };

