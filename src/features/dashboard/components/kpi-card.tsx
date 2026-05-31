type KpiCardProps = {
  label: string;
  value: string;
  trend: string;
};

export function KpiCard({ label, value, trend }: KpiCardProps) {
  return (
    <article className="kpi-card">
      <p className="kpi-label">{label}</p>
      <h3 className="kpi-value">{value}</h3>
      <span className="kpi-trend">{trend}</span>
    </article>
  );
}
