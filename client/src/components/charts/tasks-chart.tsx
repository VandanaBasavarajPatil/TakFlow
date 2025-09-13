import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', completed: 12, pending: 5 },
  { name: 'Tue', completed: 8, pending: 7 },
  { name: 'Wed', completed: 15, pending: 3 },
  { name: 'Thu', completed: 10, pending: 8 },
  { name: 'Fri', completed: 14, pending: 4 },
  { name: 'Sat', completed: 6, pending: 2 },
  { name: 'Sun', completed: 4, pending: 1 },
];

export default function TasksChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar 
          dataKey="completed" 
          fill="hsl(var(--accent))" 
          name="Completed"
        />
        <Bar 
          dataKey="pending" 
          fill="hsl(var(--muted-foreground))" 
          name="Pending"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
