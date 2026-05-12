import { Card } from 'antd';
import styles from './index.less';

type StatCardProps = {
  label: string;
  value: number | string;
  trend?: string;
};

export default function StatCard({ label, value, trend }: StatCardProps) {
  return (
    <Card className={styles.statCard}>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{value}</div>
      {trend && <div className={styles.trend}>{trend}</div>}
    </Card>
  );
}