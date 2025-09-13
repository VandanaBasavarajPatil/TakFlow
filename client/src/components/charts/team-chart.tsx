import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

const data = [
  { subject: 'Productivity', A: 85, fullMark: 100 },
  { subject: 'Quality', A: 92, fullMark: 100 },
  { subject: 'Collaboration', A: 78, fullMark: 100 },
  { subject: 'Innovation', A: 88, fullMark: 100 },
  { subject: 'Efficiency', A: 90, fullMark: 100 },
  { subject: 'Communication', A: 82, fullMark: 100 },
];

export default function TeamChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
        <PolarRadiusAxis angle={0} domain={[0, 100]} tick={false} />
        <Radar
          name="Team Performance"
          dataKey="A"
          stroke="hsl(var(--primary))"
          fill="hsl(var(--primary))"
          fillOpacity={0.2}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
