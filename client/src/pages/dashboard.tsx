import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { withAuth } from "@/lib/auth";
import { configureLeaflet, L } from "@/lib/leaflet-config";
import { DroneIcon } from "@/components/ui/drone-icon";
import { 
  Map, 
  Wheat, 
  AlertTriangle, 
  ArrowUp, 
  ArrowDown,
  CheckCircle,
  TriangleAlert,
  Wifi,
  Sprout
} from "lucide-react";

interface DashboardStats {
  totalFields: number;
  healthyPlants: number;
  infectionRate: number;
  pesticideSaved: number;
}



export default function DashboardPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const droneMarkerRef = useRef<any>(null);
  
  // State management
  const [viewMode, setViewMode] = useState<'live' | 'historical'>('live');
  const [isScanning, setIsScanning] = useState(false);
  const [droneConnected, setDroneConnected] = useState(false);

  // Function to create animated drone marker
  const createDroneMarker = (map: any) => {
    const centerLat = (30.577888 + 30.581223) / 2;
    const centerLon = (75.921646 + 75.928211) / 2;
    
    // Create custom drone icon
    const droneIcon = L.divIcon({
      html: `
        <div class="drone-marker">
          <div class="drone-body"></div>
          <div class="drone-propeller drone-propeller-1"></div>
          <div class="drone-propeller drone-propeller-2"></div>
          <div class="drone-propeller drone-propeller-3"></div>
          <div class="drone-propeller drone-propeller-4"></div>
        </div>
      `,
      className: 'drone-icon',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    const droneMarker = L.marker([centerLat, centerLon], { icon: droneIcon }).addTo(map);
    
    // Animate drone movement in a scanning pattern
    let angle = 0;
    const radius = 0.0005; // Small radius for scanning pattern
    
    const animateDrone = () => {
      if (!isScanning) return;
      
      angle += 0.1;
      const newLat = centerLat + Math.cos(angle) * radius;
      const newLon = centerLon + Math.sin(angle) * radius;
      
      droneMarker.setLatLng([newLat, newLon]);
      
      if (isScanning) {
        setTimeout(animateDrone, 100);
      }
    };
    
    animateDrone();
    return droneMarker;
  };

  // Button handlers
  const handleConnectDrone = async () => {
    setDroneConnected(true);
    // Here you would typically make an API call to connect to a drone
    console.log('Connecting to drone...');
  };

  const handleStartFieldScan = () => {
    if (!mapInstanceRef.current) return;
    
    setIsScanning(!isScanning);
    
    if (!isScanning && !droneMarkerRef.current) {
      // Start scanning - create drone marker
      droneMarkerRef.current = createDroneMarker(mapInstanceRef.current);
    } else if (isScanning && droneMarkerRef.current) {
      // Stop scanning - remove drone marker
      mapInstanceRef.current.removeLayer(droneMarkerRef.current);
      droneMarkerRef.current = null;
    }
  };

  const handleViewModeChange = (mode: 'live' | 'historical') => {
    setViewMode(mode);
    console.log(`Switched to ${mode} view`);
    
    // Force map resize when switching views
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
        console.log('Map resized after view change');
      }, 100);
    }
  };

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/stats', {
        headers: withAuth(),
      });
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json() as Promise<DashboardStats>;
    },
  });

  const { data: fields } = useQuery({
    queryKey: ['/api/fields'],
    queryFn: async () => {
      const response = await fetch('/api/fields', {
        headers: withAuth(),
      });
      if (!response.ok) throw new Error('Failed to fetch fields');
      return response.json();
    },
  });

  const { data: healthRecords } = useQuery({
    queryKey: ['/api/health-records'],
    queryFn: async () => {
      const response = await fetch('/api/health-records', {
        headers: withAuth(),
      });
      if (!response.ok) throw new Error('Failed to fetch health records');
      return response.json();
    },
  });

  // Initialize Leaflet map for field overview
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Configure Leaflet first
    configureLeaflet();

    console.log('Initializing Dashboard Leaflet map...');

    // Use the provided coordinates as center point
    const centerLat = (30.577888 + 30.581223) / 2; // 30.5795555
    const centerLon = (75.921646 + 75.928211) / 2; // 75.9249285
    console.log('Dashboard map center:', centerLat, centerLon);

    const map = L.map(mapRef.current).setView([centerLat, centerLon], 14);

    // Add satellite layer for better field visualization
    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '© Esri',
      // name: 'Satellite'
    }).addTo(map);

    mapInstanceRef.current = map;

    // Add bounding box for the specified coordinates
    const boundingBox = L.rectangle([
      [30.577888, 75.921646], // Southwest corner
      [30.581223, 75.928211]  // Northeast corner
    ], {
      color: '#ff6b6b',
      fillColor: '#ff6b6b',
      fillOpacity: 0.1,
      weight: 2,
      dashArray: '5, 5'
    }).addTo(map);

    boundingBox.bindPopup(`
      <div class="p-2">
        <h4 class="font-bold text-sm">Monitoring Area</h4>
        <p class="text-xs">Lat: 30.577888 - 30.581223</p>
        <p class="text-xs">Lon: 75.921646 - 75.928211</p>
      </div>
    `);

    // Force map to recalculate its size after a short delay
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
        console.log('Dashboard map size invalidated');
      }
    }, 250);

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle map resize when component becomes visible or window resizes
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        setTimeout(() => {
          mapInstanceRef.current.invalidateSize();
          console.log('Dashboard map resized');
        }, 100);
      }
    };

    // Listen for window resize
    window.addEventListener('resize', handleResize);
    
    // Also trigger resize when component is mounted (in case it was hidden)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && mapInstanceRef.current) {
            setTimeout(() => {
              mapInstanceRef.current.invalidateSize();
              console.log('Dashboard map became visible - resized');
            }, 100);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (mapRef.current) {
      observer.observe(mapRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);

  // Add field boundaries and health data to overview map
  useEffect(() => {
    if (!mapInstanceRef.current || !fields || !healthRecords) return;

    // Clear existing layers
    mapInstanceRef.current.eachLayer((layer: any) => {
      if (layer.options && (layer.options.isField || layer.options.isHealthMarker)) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });

    // Add field boundaries
    fields.forEach((field: any) => {
      try {
        let boundaries;
        if (field.boundaries) {
          boundaries = JSON.parse(field.boundaries);
        } else {
          // Create default boundary around the field center
          const offset = 0.002;
          boundaries = [
            [field.latitude - offset, field.longitude - offset],
            [field.latitude + offset, field.longitude - offset],
            [field.latitude + offset, field.longitude + offset],
            [field.latitude - offset, field.longitude + offset],
          ];
        }

        const polygon = L.polygon(boundaries, {
          color: '#22c55e',
          fillColor: '#22c55e',
          fillOpacity: 0.3,
          weight: 2,
          // isField: true,
        }).addTo(mapInstanceRef.current);

        polygon.bindPopup(`
          <div class="p-2">
            <h3 class="font-bold text-sm">${field.name}</h3>
            <p class="text-xs">Area: ${field.area} hectares</p>
          </div>
        `);
      } catch (error) {
        console.error('Error parsing field boundaries:', error);
      }
    });

    // Add health record markers
    healthRecords.forEach((record: any) => {
      if (record.latitude && record.longitude) {
        const severityColors = {
          low: '#22c55e',
          medium: '#f59e0b',
          high: '#ef4444',
        };

        const color = severityColors[record.severity as keyof typeof severityColors] || '#6b7280';

        const marker = L.circleMarker([record.latitude, record.longitude], {
          radius: 6,
          fillColor: color,
          color: 'white',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8,
          // isHealthMarker: true,
        }).addTo(mapInstanceRef.current);

        marker.bindPopup(`
          <div class="p-2">
            <h4 class="font-bold text-xs">Health Record</h4>
            <p class="text-xs">Health: ${record.healthScore}%</p>
            <p class="text-xs">Infection: ${record.infectionRate}%</p>
            <p class="text-xs">Severity: ${record.severity}</p>
          </div>
        `);
      }
    });
  }, [fields, healthRecords]);

  if (statsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card rounded-lg p-6 border border-border animate-pulse">
              <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-muted rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Fields</p>
                <p className="text-2xl font-bold" data-testid="stat-total-fields">
                  {stats?.totalFields || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Map className="text-primary" size={24} />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUp className="text-primary mr-1" size={12} />
              <span className="text-primary">8.2%</span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Healthy Plants</p>
                <p className="text-2xl font-bold text-primary" data-testid="stat-healthy-plants">
                  {stats?.healthyPlants?.toLocaleString() || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Wheat className="text-primary" size={24} />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUp className="text-primary mr-1" size={12} />
              <span className="text-primary">12.5%</span>
              <span className="text-muted-foreground ml-1">from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Infection Rate</p>
                <p className="text-2xl font-bold text-accent" data-testid="stat-infection-rate">
                  {stats?.infectionRate?.toFixed(1) || 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="text-accent" size={24} />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowDown className="text-primary mr-1" size={12} />
              <span className="text-primary">2.1%</span>
              <span className="text-muted-foreground ml-1">from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pesticide Saved</p>
                <p className="text-2xl font-bold text-primary" data-testid="stat-pesticide-saved">
                  {stats?.pesticideSaved || 0}L
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <DroneIcon className="text-primary" size={24} />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUp className="text-primary mr-1" size={12} />
              <span className="text-primary">15.8%</span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Field Overview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle>Field Overview</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm" 
                    variant={viewMode === 'live' ? 'default' : 'outline'}
                    onClick={() => handleViewModeChange('live')}
                    data-testid="button-live-view"
                  >
                    Live View
                  </Button>
                  <Button 
                    variant={viewMode === 'historical' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleViewModeChange('historical')}
                  >
                    Historical
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative">
                <div 
                  ref={mapRef} 
                  className="w-full h-80 bg-muted rounded-lg"
                  style={{ minHeight: '320px' }}
                />
                
                {/* Map Legend */}
                <div className="absolute top-4 left-4 bg-card/95 backdrop-blur rounded-lg p-3 shadow-lg z-[1000]">
                  <h4 className="font-medium mb-2 text-sm">Field Status</h4>
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground mb-1">Grid Status (2m cells)</div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                      <span className="text-xs">Healthy</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-sm"></div>
                      <span className="text-xs">Mild Stress</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                      <span className="text-xs">Infected</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-700 rounded-sm"></div>
                      <span className="text-xs">Critical</span>
                    </div>
                    <div className="text-xs font-medium text-muted-foreground mb-1 mt-2">Field Markers</div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-1 bg-primary/30 border border-primary"></div>
                      <span className="text-xs">Field Boundary</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-xs">Health Marker</span>
                    </div>
                  </div>
                </div>

                {/* Map Info */}
                <div className="absolute bottom-4 right-4 bg-card/95 backdrop-blur rounded-lg p-2 text-xs z-[1000]">
                  <span className="text-muted-foreground">Last updated: 5 min ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Drone Status */}
        <Card>
          <CardHeader className="border-b border-border">
            <CardTitle>Drone Status</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                <div>
                  <p className="font-medium">Drone Alpha-1</p>
                  <p className="text-sm text-muted-foreground">Connected via WiFi</p>
                </div>
              </div>
              <span className="text-sm bg-primary text-primary-foreground px-2 py-1 rounded">
                Active
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-muted-foreground rounded-full"></div>
                <div>
                  <p className="font-medium">Drone Beta-2</p>
                  <p className="text-sm text-muted-foreground">Bluetooth ready</p>
                </div>
              </div>
              <span className="text-sm bg-muted text-muted-foreground px-2 py-1 rounded">
                Standby
              </span>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Quick Actions</h4>
              <Button 
                className="w-full" 
                onClick={handleConnectDrone}
                disabled={droneConnected}
                data-testid="button-connect-drone"
              >
                <Wifi className="mr-2" size={16} />
                {droneConnected ? 'Drone Connected' : 'Connect New Drone'}
              </Button>
              <Button 
                variant={isScanning ? 'destructive' : 'outline'} 
                className="w-full" 
                onClick={handleStartFieldScan}
                data-testid="button-start-scan"
              >
                {isScanning ? 'Stop Field Scan' : 'Start Field Scan'}
              </Button>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Battery Level</span>
                  <span className="font-medium">87%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '87%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card>
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle>AI-Powered Recommendations</CardTitle>
            <span className="text-sm bg-accent text-accent-foreground px-3 py-1 rounded-full">
              AI Powered
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recommendation 1 */}
            <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                    <TriangleAlert className="text-accent-foreground" size={16} />
                  </div>
                  <div>
                    <h4 className="font-medium">Medium Priority</h4>
                    <p className="text-sm text-muted-foreground">Field Zone A-3</p>
                  </div>
                </div>
                <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">
                  Active
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <p><strong>Issue:</strong> Aphid infestation detected (15% coverage)</p>
                <p><strong>Recommended:</strong> Neem oil spray - 2.5L per hectare</p>
                <p><strong>Timing:</strong> Early morning application recommended</p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">Confidence:</span>
                  <div className="w-16 bg-muted rounded-full h-2">
                    <div className="bg-accent h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-xs font-medium">85%</span>
                </div>
                <Button size="sm" data-testid="button-apply-recommendation">
                  Apply
                </Button>
              </div>
            </div>

            {/* Recommendation 2 */}
            <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <CheckCircle className="text-primary-foreground" size={16} />
                  </div>
                  <div>
                    <h4 className="font-medium">Low Priority</h4>
                    <p className="text-sm text-muted-foreground">Field Zone B-1</p>
                  </div>
                </div>
                <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                  Scheduled
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <p><strong>Issue:</strong> Preventive treatment due</p>
                <p><strong>Recommended:</strong> Organic fungicide - 1.8L per hectare</p>
                <p><strong>Timing:</strong> Schedule for tomorrow evening</p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">Confidence:</span>
                  <div className="w-16 bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  <span className="text-xs font-medium">92%</span>
                </div>
                <Button size="sm" variant="outline" data-testid="button-schedule-recommendation">
                  Schedule
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="border-b border-border">
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-3 hover:bg-muted/50 rounded-lg transition-colors">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="text-primary" size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Pesticide application completed</p>
                <p className="text-xs text-muted-foreground">Field Zone A-3 • Neem oil spray applied</p>
                <p className="text-xs text-muted-foreground">2 minutes ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-3 hover:bg-muted/50 rounded-lg transition-colors">
              <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                <TriangleAlert className="text-accent" size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">New infection detected</p>
                <p className="text-xs text-muted-foreground">Field Zone C-2 • Fungal infection spotted</p>
                <p className="text-xs text-muted-foreground">15 minutes ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-3 hover:bg-muted/50 rounded-lg transition-colors">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Wifi className="text-primary" size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Drone connected successfully</p>
                <p className="text-xs text-muted-foreground">Drone Alpha-1 • Ready for field scanning</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <Button variant="ghost" className="w-full text-sm" data-testid="button-view-all-activity">
              View all activity →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
