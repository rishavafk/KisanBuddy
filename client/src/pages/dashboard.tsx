import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { withAuth } from "@/lib/auth";
import { 
  Map, 
  Wheat, 
  AlertTriangle, 
  Leaf, 
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
                <Leaf className="text-primary" size={24} />
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
                  <Button size="sm" data-testid="button-live-view">Live View</Button>
                  <Button variant="outline" size="sm">Historical</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="w-full h-80 bg-muted rounded-lg relative overflow-hidden">
                {/* Field visualization placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
                
                {/* Legend */}
                <div className="absolute top-4 left-4 bg-card rounded-lg p-3 shadow-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span className="text-sm">Healthy (87%)</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-3 h-3 bg-accent rounded-full"></div>
                    <span className="text-sm">Mild Infection (10%)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-destructive rounded-full"></div>
                    <span className="text-sm">Severe (3%)</span>
                  </div>
                </div>
                
                {/* Field zones visualization */}
                <div className="absolute top-12 right-8 w-24 h-16 bg-primary/30 rounded-lg border-2 border-primary"></div>
                <div className="absolute top-32 right-12 w-20 h-20 bg-accent/40 rounded-lg border-2 border-accent"></div>
                <div className="absolute bottom-16 left-12 w-16 h-12 bg-destructive/40 rounded-lg border-2 border-destructive"></div>
                
                <div className="absolute bottom-4 right-4 bg-card rounded-lg p-2 text-xs">
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
              <Button className="w-full" data-testid="button-connect-drone">
                <Wifi className="mr-2" size={16} />
                Connect New Drone
              </Button>
              <Button variant="outline" className="w-full" data-testid="button-start-scan">
                Start Field Scan
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
