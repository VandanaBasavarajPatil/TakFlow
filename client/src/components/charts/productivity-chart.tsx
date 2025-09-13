import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', productivity: 85 },
  { name: 'Tue', productivity: 92 },
  { name: 'Wed', productivity: 78 },
  { name: 'Thu', productivity: 95 },
  { name: 'Fri', productivity: 88 },
  { name: 'Sat', productivity: 72 },
  { name: 'Sun', productivity: 68 },
];

export default function ProductivityChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line 
          type="monotone" 
          dataKey="productivity" 
          stroke="hsl(var(--primary))" 
          strokeWidth={2}
          dot={{ fill: "hsl(var(--primary))" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
