import { Button, Card, Col, Row, Steps } from 'antd';
import { history } from 'umi';
import styles from './index.module.less';

export default function HomePage() {
  return (
    <main className={styles.homePage}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            HỆ THỐNG TUYỂN SINH ĐẠI HỌC TRỰC TUYẾN
          </div>

          <h1>
            Nộp hồ sơ xét tuyển online nhanh chóng và minh bạch hơn
          </h1>

          <p>
            Theo dõi trạng thái hồ sơ, quản lý nguyện vọng và nhận thông báo xét tuyển
            ngay trên một nền tảng hiện đại.
          </p>

          <div className={styles.actions}>
            <Button type="primary" size="large" onClick={() => history.push('/register')}>
              Bắt đầu ngay
            </Button>
          </div>
        </div>

        <Card className={styles.heroCard}>
          <h3>Quy trình xét tuyển</h3>

          <Steps
            direction="vertical"
            current={1}
            items={[
              {
                title: 'Tạo tài khoản',
                description: 'Đăng ký nhanh bằng email',
              },
              {
                title: 'Nộp hồ sơ online',
                description: 'Upload hồ sơ trực tiếp',
              },
              {
                title: 'Theo dõi xét duyệt',
                description: 'Kiểm tra trạng thái realtime',
              },
              {
                title: 'Nhận kết quả',
                description: 'Thông báo tự động qua email',
              },
            ]}
          />
        </Card>
      </section>

      <section className={styles.features}>
  <div className={styles.sectionHead}>
    <div className={styles.sectionBadge}>
      NỀN TẢNG TUYỂN SINH THẾ HỆ MỚI
    </div>

    <h2>
      Tối ưu toàn bộ quy trình tuyển sinh
      <br />
      trên một nền tảng duy nhất
    </h2>

    <p>
      Hệ thống giúp thí sinh, nhà trường và cán bộ tuyển sinh
      quản lý hồ sơ nhanh hơn, minh bạch hơn và chính xác hơn
      trong toàn bộ quá trình xét tuyển.
    </p>
  </div>

  <Row gutter={[28, 28]}>
    {[
      {
        number: '01',
        title: 'Quy trình thông minh',
        desc:
          'Thiết kế theo từng bước trực quan giúp thí sinh dễ dàng đăng ký, nộp hồ sơ và theo dõi trạng thái xét tuyển.',
      },

      {
        number: '02',
        title: 'Theo dõi realtime',
        desc:
          'Cập nhật trạng thái hồ sơ, lịch sử xử lý và thông báo tự động ngay khi có thay đổi từ hệ thống.',
      },

      {
        number: '03',
        title: 'Bảo mật & ổn định',
        desc:
          'Dữ liệu được quản lý tập trung với khả năng mở rộng cao, tối ưu hiệu năng trên cả desktop và mobile.',
      },
    ].map((item) => (
      <Col xs={24} md={8} key={item.number}>
        <Card className={styles.featureCard}>
          <div className={styles.number}>
            {item.number}
          </div>

          <h3>{item.title}</h3>

          <p>{item.desc}</p>
        </Card>
      </Col>
    ))}
  </Row>
</section>
    </main>
  );
}