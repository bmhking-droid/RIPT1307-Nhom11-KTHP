import { Outlet, Link, history } from 'umi';
import { Button } from 'antd';
import styles from './index.less';

export default function Layout() {
  return (
    <div className={styles.layout}>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}