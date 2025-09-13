import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { withAuth } from "@/lib/auth";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Map as MapIcon, Layers, Maximize, ZoomIn, ZoomOut, RotateCcw, Satellite } from "lucide-react";

interface Field {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  area: number;
  boundaries?: string;
  cropId?: string;
}

interface HealthRecord {
  id: string;
  fieldId: string;
  healthScore: number;
  infectionRate: number;
  infectionType?: string;
  severity: string;
  latitude?: number;
  longitude?: number;
  detectionConfidence: number;
}

export default function FieldMapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [selectedField, setSelectedField] = useState<string>("");
  const [mapView, setMapView] = useState<"satellite" | "terrain">("satellite");

  const { data: fields, isLoading: fieldsLoading } = useQuery({
    queryKey: ['/api/fields'],
    queryFn: async () => {
      const response = await fetch('/api/fields', {
        headers: withAuth(),
      });
      if (!response.ok) throw new Error('Failed to fetch fields');
      return response.json() as Promise<Field[]>;
    },
  });

  const { data: healthRecords } = useQuery({
    queryKey: ['/api/health-records'],
    queryFn: async () => {
      const response = await fetch('/api/health-records', {
        headers: withAuth(),
      });
      if (!response.ok) throw new Error('Failed to fetch health records');
      return response.json() as Promise<HealthRecord[]>;
    },
  });

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([28.7041, 77.1025], 13);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    mapInstanceRef.current = map;

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Add field boundaries and health data to map
  useEffect(() => {
    if (!mapInstanceRef.current || !fields || !healthRecords) return;

    // Clear existing layers
    mapInstanceRef.current.eachLayer((layer: any) => {
      if (layer.options && (layer.options.isField || layer.options.isHealthMarker)) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });

    // Add field boundaries
    fields.forEach((field) => {
      try {
        let boundaries;
        if (field.boundaries) {
          boundaries = JSON.parse(field.boundaries);
        } else {
          // Create default boundary around the field center
          const offset = 0.005;
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
          fillOpacity: 0.2,
          isField: true,
        }).addTo(mapInstanceRef.current);

        polygon.bindPopup(`
          <div class="p-2">
            <h3 class="font-bold">${field.name}</h3>
            <p class="text-sm">Area: ${field.area} hectares</p>
          </div>
        `);
      } catch (error) {
        console.error('Error parsing field boundaries:', error);
      }
    });

    // Add health record markers
    healthRecords.forEach((record) => {
      if (record.latitude && record.longitude) {
        const severityColors = {
          low: '#22c55e',
          medium: '#f59e0b',
          high: '#ef4444',
        };

        const color = severityColors[record.severity as keyof typeof severityColors] || '#6b7280';

        const marker = L.circleMarker([record.latitude, record.longitude], {
          radius: 8,
          fillColor: color,
          color: 'white',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8,
          isHealthMarker: true,
        }).addTo(mapInstanceRef.current);

        marker.bindPopup(`
          <div class="p-2">
            <h4 class="font-bold text-sm">Health Record</h4>
            <p class="text-xs">Health Score: ${record.healthScore}%</p>
            <p class="text-xs">Infection Rate: ${record.infectionRate}%</p>
            <p class="text-xs">Severity: ${record.severity}</p>
            ${record.infectionType ? `<p class="text-xs">Type: ${record.infectionType}</p>` : ''}
            <p class="text-xs">Confidence: ${record.detectionConfidence}%</p>
          </div>
        `);
      }
    });

    // Focus on selected field
    if (selectedField) {
      const field = fields.find(f => f.id === selectedField);
      if (field) {
        mapInstanceRef.current.setView([field.latitude, field.longitude], 16);
      }
    }
  }, [fields, healthRecords, selectedField]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([28.7041, 77.1025], 13);
    }
  };

  if (fieldsLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-96 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  const fieldHealthSummary = fields?.map(field => {
    const fieldRecords = healthRecords?.filter(r => r.fieldId === field.id) || [];
    const avgHealth = fieldRecords.length > 0 
      ? fieldRecords.reduce((sum, r) => sum + r.healthScore, 0) / fieldRecords.length 
      : 0;
    const avgInfection = fieldRecords.length > 0 
      ? fieldRecords.reduce((sum, r) => sum + r.infectionRate, 0) / fieldRecords.length 
      : 0;
    
    return {
      field,
      avgHealth: Math.round(avgHealth),
      avgInfection: Math.round(avgInfection * 10) / 10,
      recordCount: fieldRecords.length
    };
  }) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Field Map</h1>
          <p className="text-muted-foreground">
            Interactive field visualization with real-time health monitoring and infection tracking
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Select value={selectedField} onValueChange={setSelectedField}>
            <SelectTrigger className="w-48" data-testid="select-field">
              <SelectValue placeholder="Select field to focus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Fields</SelectItem>
              {fields?.map((field) => (
                <SelectItem key={field.id} value={field.id}>
                  {field.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Map and Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Map */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="border-b border-border pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <MapIcon size={20} />
                  <span>Field Overview Map</span>
                </CardTitle>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={handleZoomIn} data-testid="button-zoom-in">
                    <ZoomIn size={16} />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleZoomOut} data-testid="button-zoom-out">
                    <ZoomOut size={16} />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleResetView} data-testid="button-reset-view">
                    <RotateCcw size={16} />
                  </Button>
                  <Button variant="outline" size="sm" data-testid="button-fullscreen">
                    <Maximize size={16} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative">
                <div 
                  ref={mapRef} 
                  className="w-full h-96 bg-muted"
                  data-testid="field-map"
                />
                
                {/* Map Legend */}
                <div className="absolute top-4 left-4 bg-card/95 backdrop-blur rounded-lg p-3 shadow-lg z-[1000]">
                  <h4 className="font-medium mb-2 text-sm">Legend</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <span className="text-xs">Healthy (&gt;80%)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-accent rounded-full"></div>
                      <span className="text-xs">Mild Infection (40-80%)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-destructive rounded-full"></div>
                      <span className="text-xs">Severe (&lt;40%)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-1 bg-primary/30 border border-primary"></div>
                      <span className="text-xs">Field Boundary</span>
                    </div>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>

        {/* Field Statistics Sidebar */}
        <div className="space-y-6">
          {/* Field Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Field Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-primary/10 rounded-lg p-3">
                  <p className="text-2xl font-bold text-primary">{fields?.length || 0}</p>
                  <p className="text-xs text-muted-foreground">Total Fields</p>
                </div>
                <div className="bg-secondary/10 rounded-lg p-3">
                  <p className="text-2xl font-bold text-secondary">
                    {fields?.reduce((sum, f) => sum + f.area, 0).toFixed(1) || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Hectares</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Health Records</span>
                  <span className="font-medium">{healthRecords?.length || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>High Risk Areas</span>
                  <span className="font-medium text-destructive">
                    {healthRecords?.filter(r => r.severity === 'high').length || 0}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Last Scan</span>
                  <span className="font-medium">2 hours ago</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Field Health List */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Field Health Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {fieldHealthSummary.map(({ field, avgHealth, avgInfection, recordCount }) => (
                  <div
                    key={field.id}
                    className="p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedField(field.id)}
                    data-testid={`field-summary-${field.id}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{field.name}</h4>
                      <Badge 
                        variant={avgHealth > 80 ? "default" : avgHealth > 60 ? "secondary" : "destructive"}
                        className="text-xs"
                      >
                        {avgHealth}% Health
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <span>Area: {field.area} ha</span>
                      <span>Infection: {avgInfection}%</span>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-muted rounded-full h-1">
                        <div 
                          className={`h-1 rounded-full ${avgHealth > 80 ? 'bg-primary' : avgHealth > 60 ? 'bg-accent' : 'bg-destructive'}`}
                          style={{ width: `${avgHealth}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start" data-testid="button-export-map">
                <Satellite className="mr-2" size={14} />
                Export Map Data
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" data-testid="button-download-report">
                <Layers className="mr-2" size={14} />
                Download Report
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" data-testid="button-share-view">
                <MapIcon className="mr-2" size={14} />
                Share Map View
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
