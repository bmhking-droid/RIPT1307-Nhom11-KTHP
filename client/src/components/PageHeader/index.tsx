import styles from './index.less';

type PageHeaderProps = {
  title: string;
  description?: string;
  extra?: React.ReactNode;
};

export default function PageHeader({ title, description, extra }: PageHeaderProps) {
  return (
    <div className={styles.pageHeader}>
      <div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>

      {extra && <div className={styles.extra}>{extra}</div>}
    </div>
  );
}