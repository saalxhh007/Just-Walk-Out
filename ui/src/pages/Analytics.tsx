import { peakHoursData, salesData, topProducts } from '../../data/mockedData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
const abandonedData = [
  { name: "Organic Milk", count: 12 },
  { name: "Olive Oil", count: 9 },
  { name: "Greek Yogurt", count: 7 },
  { name: "Chicken Breast", count: 5 },
  { name: "Pasta Fusilli", count: 3 },
];

const timePerCustomer = [
  { range: "0-5 min", count: 15 },
  { range: "5-15 min", count: 42 },
  { range: "15-30 min", count: 28 },
  { range: "30-60 min", count: 12 },
  { range: "60+ min", count: 3 },
];

const CHART_COLORS = [
  "hsl(185, 72%, 50%)",
  "hsl(150, 60%, 45%)",
  "hsl(38, 92%, 55%)",
  "hsl(280, 60%, 55%)",
  "hsl(0, 65%, 50%)",
];

const Analytics = () => {

  return (    
    <div className="space-y-6 animate-slide-in">
      <div>
        <h1 className="text-2xl font-bold">Analytics & Reports</h1>
        <p className="text-sm text-muted-foreground">Store performance insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Daily Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 20%, 16%)" />
                <XAxis dataKey="day" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(222, 25%, 9%)", border: "1px solid hsl(222, 20%, 16%)", borderRadius: 8 }} />
                <Bar dataKey="sales" fill="hsl(185, 72%, 50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Most Picked Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 20%, 16%)" />
                <XAxis type="number" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} />
                <YAxis type="category" dataKey="name" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }} width={100} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(222, 25%, 9%)", border: "1px solid hsl(222, 20%, 16%)", borderRadius: 8 }} />
                <Bar dataKey="picks" fill="hsl(150, 60%, 45%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Peak Hours */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Peak Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={peakHoursData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 20%, 16%)" />
                <XAxis dataKey="hour" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }} />
                <YAxis tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(222, 25%, 9%)", border: "1px solid hsl(222, 20%, 16%)", borderRadius: 8 }} />
                <Line type="monotone" dataKey="visitors" stroke="hsl(185, 72%, 50%)" strokeWidth={2} dot={{ fill: "hsl(185, 72%, 50%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Time Spent per Customer</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={timePerCustomer} cx="50%" cy="50%" outerRadius={90} dataKey="count" nameKey="range" label={({ percent }) => `(${(percent ?? 0 * 100).toFixed(0)}%)`}>
                  {timePerCustomer.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "hsl(222, 25%, 9%)", border: "1px solid hsl(222, 20%, 16%)", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Abandoned Products */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Abandoned Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={abandonedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 20%, 16%)" />
                <XAxis dataKey="name" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }} />
                <YAxis tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(222, 25%, 9%)", border: "1px solid hsl(222, 20%, 16%)", borderRadius: 8 }} />
                <Bar dataKey="count" fill="hsl(0, 65%, 50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Heatmap Placeholder */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Shelf Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-62.5 rounded-lg bg-muted/30 border border-border flex items-center justify-center">
              <div className="text-center">
                <div className="grid grid-cols-6 gap-1 mx-auto mb-3">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-6 w-8 rounded-sm"
                      style={{
                        backgroundColor: `hsl(185, 72%, ${20 + Math.random() * 50}%)`,
                        opacity: 0.3 + Math.random() * 0.7,
                      }}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">Live heatmap — Connect cameras to activate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Analytics
