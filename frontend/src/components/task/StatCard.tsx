import { Card, CardContent } from '../ui/card';

interface StatCardProps {
  label: string;
  value: number | string;
}

const StatCard = ({ label, value }: StatCardProps) => (
  <Card className="bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-sm overflow-hidden">
    <CardContent className="py-4 text-center">
      <h3 className="text-4xl font-extrabold text-slate-900 mb-1">{value}</h3>
      <p className="text-sm font-medium text-slate-500">{label}</p>
    </CardContent>
  </Card>
);

export default StatCard;
