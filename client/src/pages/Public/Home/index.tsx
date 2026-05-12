import { Button, Card, Col, Row, Steps } from 'antd';
import { history } from 'umi';
import './index.less';

export default function HomePage() {
  return (
    <main className="home-page">
      <section className="hero">
        <div className="hero-content">
          <div className="badge">Tuyển sinh đại học trực tuyến</div>

          <h1>
            Nộp hồ sơ xét tuyển <br />
            nhanh hơn, rõ ràng hơn.
          </h1>

          <p>
            Theo dõi trạng thái hồ sơ, nhận thông báo kết quả và quản lý toàn bộ
            quy trình tuyển sinh trên một nền tảng hiện đại.
          </p>

          <div className="hero-actions">
            <Button type="primary" size="large" onClick={() => history.push('/register')}>
              Bắt đầu nộp hồ sơ
            </Button>
            <Button size="large" onClick={() => history.push('/login')}>
              Đăng nhập
            </Button>
          </div>
        </div>

        <Card className="hero-card">
          <h3>Quy trình xét tuyển</h3>

          <Steps
            direction="vertical"
            current={1}
            items={[
              { title: 'Tạo tài khoản' },
              { title: 'Nộp hồ sơ online' },
              { title: 'Chờ phê duyệt' },
              { title: 'Nhận kết quả' },
            ]}
          />
        </Card>
      </section>

      <section className="features">
        <Row gutter={[20, 20]}>
          {[
            ['01', 'Dễ sử dụng', 'Form từng bước, rõ ràng, phù hợp cả mobile.'],
            ['02', 'Minh bạch', 'Theo dõi trạng thái hồ sơ theo thời gian thực.'],
            ['03', 'Nhanh chóng', 'Upload minh chứng và gửi hồ sơ chỉ trong vài phút.'],
          ].map((item) => (
            <Col xs={24} md={8} key={item[0]}>
              <Card className="feature-card">
                <span>{item[0]}</span>
                <h3>{item[1]}</h3>
                <p>{item[2]}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </section>
    </main>
  );
}