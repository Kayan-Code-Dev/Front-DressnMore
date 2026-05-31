type Props = {
  employeeId?: number | string | null;
  fallback?: string;
};

export function OrderEmployeeName({ employeeId, fallback = "—" }: Props) {
  if (!employeeId) return <span>{fallback}</span>;
  return <span>موظف #{employeeId}</span>;
}
