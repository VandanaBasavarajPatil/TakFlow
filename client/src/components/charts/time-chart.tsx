import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Development', value: 40, color: 'hsl(var(--primary))' },
  { name: 'Meetings', value: 25, color: 'hsl(var(--chart-2))' },
  { name: 'Planning', value: 20, color: 'hsl(var(--chart-4))' },
  { name: 'Review', value: 15, color: 'hsl(var(--accent))' },
];

export default function TimeChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value}%`, 'Time']} />
      </PieChart>
    </ResponsiveContainer>
  );
}
