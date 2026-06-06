import { Button, Card, Col, Row, Steps, Carousel } from 'antd';
import { history } from 'umi';
import React, { useState, useRef } from 'react';
import {
  CalendarOutlined,
  UserOutlined,
  UploadOutlined,
  SearchOutlined,
  MailOutlined,
  ArrowUpOutlined,
  PlayCircleFilled,
  FilePdfOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  ClockCircleOutlined,
  PieChartOutlined
} from '@ant-design/icons';
import styles from './index.module.less';
import laptopMockup from '@/assets/portal_hero_laptop.png';

const announcements = [
  {
    title: 'Triển khai thanh toán trực tuyến lệ phí đăng ký xét tuyển đại học và cao đẳng năm 2025',
    date: '25/07/2025',
  },
  {
    title: 'Rà soát, cung cấp và công bố thông tin tuyển sinh các hình thức đào tạo của trình độ đại học; trình độ cao đẳng ngành Giáo dục Mầm non năm 2025',
    date: '04/06/2025',
  },
  {
    title: 'Tổ chức tuyển sinh trình độ đại học; tuyển sinh trình độ cao đẳng ngành Giáo dục Mầm non năm 2025',
    date: '09/04/2025',
  },
  {
    title: 'Rà soát, sửa đổi, bổ sung và cập nhật cơ sở dữ liệu về khu vực ưu tiên, thông tin của học sinh phục vụ công tác thi tốt nghiệp THPT, tuyển sinh ĐH, CĐ và tuyển sinh đầu cấp tại các trường dân tộc nội trú năm 2025',
    date: '23/02/2025',
  },
];

const documents = [
  {
    title: 'Thông tư 34/2026/TT-BGDĐT của Bộ Giáo dục và Đào tạo Quy định về việc xác định số lượng tuyển sinh đại học, thạc sĩ, tiến sĩ và số lượng tuyển sinh cao đẳng ngành Giáo dục Mầm non',
    issueDate: '19/04/2026',
    effectDate: '19/04/2026',
  },
  {
    title: 'Thông tư 06/2026/TT-BGDĐT của Bộ Giáo dục và Đào tạo ban hành Quy chế tuyển sinh các ngành đào tạo trình độ đại học và ngành Giáo dục Mầm non trình độ cao đẳng',
    issueDate: '15/02/2026',
    effectDate: '15/02/2026',
  },
  {
    title: 'Ban hành Kế hoạch triển khai công tác tuyển sinh đại học, tuyển sinh cao đẳng năm 2026',
    issueDate: '03/11/2025',
    effectDate: '03/11/2025',
  },
];

export default function HomePage() {
  const carouselRef = useRef<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className={styles.homePage}>
      <div className={styles.heroCarouselContainer}>
        <Carousel
          ref={carouselRef}
          autoplay
          autoplaySpeed={3000}
          effect="fade"
          dots={false}
          beforeChange={(from, to) => setCurrentSlide(to)}
        >
          {/* SLIDE 1: QUY TRÌNH XÉT TUYỂN */}
          <div>
            <section className={styles.hero}>
              {/* CỘT 1: NỘI DUNG GIỚI THIỆU */}
              <div className={styles.heroContent}>
                <div className={styles.badge}>
                  HỆ THỐNG TUYỂN SINH ĐẠI HỌC TRỰC TUYẾN
                </div>

                <h1>
                  NỘP HỒ SƠ XÉT TUYỂN ONLINE <span className={styles.highlightText}>NHANH CHÓNG</span> VÀ MINH BẠCH HƠN
                </h1>

                <p>
                  Theo dõi trạng thái hồ sơ, quản lý nguyện vọng và nhận thông báo xét tuyển
                  ngay trên một nền tảng hiện đại.
                </p>

                <div className={styles.actions}>
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => history.push('/register')}
                    className={styles.primaryActionButton}
                  >
                    Bắt đầu ngay <span className={styles.btnArrow}>→</span>
                  </Button>
                  <Button size="large" className={styles.guideButton}>
                    <PlayCircleFilled className={styles.playIcon} /> Xem hướng dẫn
                  </Button>
                </div>

                <div className={styles.sliderDots}>
                  <span
                    className={`${styles.dot} ${currentSlide === 0 ? styles.active : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      carouselRef.current?.goTo(0);
                    }}
                  />
                  <span
                    className={`${styles.dot} ${currentSlide === 1 ? styles.active : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      carouselRef.current?.goTo(1);
                    }}
                  />
                </div>
              </div>



              {/* CỘT 3: THẺ QUY TRÌNH XÉT TUYỂN */}
              <div className={styles.heroRightCardWrapper}>
                <Card className={styles.heroCard}>
                  <h3>Quy trình xét tuyển</h3>

                  <Steps
                    direction="vertical"
                    current={1}
                    items={[
                      {
                        title: 'Tạo tài khoản',
                        description: 'Đăng ký nhanh bằng email',
                        icon: <div className={styles.stepCircleIcon}><UserOutlined /></div>,
                      },
                      {
                        title: 'Nộp hồ sơ online',
                        description: 'Upload hồ sơ trực tiếp',
                        icon: <div className={`${styles.stepCircleIcon} ${styles.active}`}><UploadOutlined /></div>,
                      },
                      {
                        title: 'Theo dõi xét duyệt',
                        description: 'Kiểm tra trạng thái realtime',
                        icon: <div className={styles.stepCircleIcon}><SearchOutlined /></div>,
                      },
                      {
                        title: 'Nhận kết quả',
                        description: 'Thông báo tự động qua email',
                        icon: <div className={styles.stepCircleIcon}><MailOutlined /></div>,
                      },
                    ]}
                  />

                  <div className={styles.upwardArrowBox} onClick={scrollToTop}>
                    <div className={styles.upwardCircle}>
                      <ArrowUpOutlined />
                    </div>
                  </div>
                </Card>
              </div>
            </section>
          </div>

          {/* SLIDE 2: LỊCH TRÌNH TUYỂN SINH */}
          <div>
            <section className={styles.hero}>
              {/* CỘT 1: NỘI DUNG GIỚI THIỆU */}
              <div className={styles.heroContent}>
                <div className={styles.badge}>
                  KẾ HOẠCH TUYỂN SINH MỚI NHẤT
                </div>

                <h1>
                  Theo dõi lịch trình và quy chế xét tuyển <span className={styles.highlightTextBlue}>quan trọng</span>
                </h1>

                <p>
                  Đảm bảo không bỏ lỡ các mốc thời gian đăng ký nguyện vọng, nộp lệ phí trực tuyến và công bố điểm trúng tuyển.
                </p>

                <div className={styles.actions}>
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => history.push('/login')}
                    className={styles.primaryActionButton}
                  >
                    Xem lịch trình <span className={styles.btnArrow}>→</span>
                  </Button>
                  <Button size="large" className={styles.guideButton}>
                    <SafetyCertificateOutlined className={styles.playIcon} /> Quy chế tuyển sinh
                  </Button>
                </div>

                <div className={styles.sliderDots}>
                  <span
                    className={`${styles.dot} ${currentSlide === 0 ? styles.active : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      carouselRef.current?.goTo(0);
                    }}
                  />
                  <span
                    className={`${styles.dot} ${currentSlide === 1 ? styles.active : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      carouselRef.current?.goTo(1);
                    }}
                  />
                </div>
              </div>



              {/* CỘT 3: THẺ LỊCH TUYỂN SINH */}
              <div className={styles.heroRightCardWrapper}>
                <Card className={`${styles.heroCard} ${styles.calendarCard}`}>
                  <h3>Lịch tuyển sinh 2026</h3>

                  <div className={styles.calendarList}>
                    <div className={styles.calendarItem}>
                      <div className={styles.calendarDateBox}>
                        <span className={styles.calMonth}>Tháng 6</span>
                        <span className={styles.calDay}>15</span>
                      </div>
                      <div className={styles.calendarText}>
                        <h4>Mở cổng đăng ký</h4>
                        <p>Thí sinh tạo tài khoản và nộp hồ sơ online</p>
                      </div>
                    </div>

                    <div className={styles.calendarItem}>
                      <div className={styles.calendarDateBox}>
                        <span className={styles.calMonth}>Tháng 7</span>
                        <span className={styles.calDay}>30</span>
                      </div>
                      <div className={styles.calendarText}>
                        <h4>Đóng cổng đăng ký</h4>
                        <p>Hạn cuối nhận hồ sơ trực tuyến và nộp lệ phí</p>
                      </div>
                    </div>

                    <div className={styles.calendarItem}>
                      <div className={styles.calendarDateBox}>
                        <span className={styles.calMonth}>Tháng 8</span>
                        <span className={styles.calDay}>15</span>
                      </div>
                      <div className={styles.calendarText}>
                        <h4>Công bố kết quả</h4>
                        <p>Thông báo trúng tuyển chính thức qua SMS & Email</p>
                      </div>
                    </div>
                  </div>

                  <div className={styles.upwardArrowBox} onClick={scrollToTop}>
                    <div className={styles.upwardCircle}>
                      <ArrowUpOutlined />
                    </div>
                  </div>
                </Card>
              </div>
            </section>
          </div>
        </Carousel>
      </div>

      {/* FEATURES SECTION (TIMELINE NGANG) */}
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
        </div>

        <div className={styles.timelineWrapper}>
          <div className={styles.timelineLine} />
          
          <Row gutter={[32, 40]} className={styles.timelineRow}>
            <Col xs={24} md={8} className={styles.timelineCol}>
              <div className={styles.timelineStepCard}>
                <div className={styles.stepIconOuter}>
                  <div className={styles.stepIconInner}>
                    <span className={styles.emojiIcon}>📋</span>
                  </div>
                </div>
                <h3>01. Quy trình thông minh</h3>
                <p>
                  Thiết kế theo từng bước trực quan giúp thí sinh dễ dàng đăng ký, nộp hồ sơ và theo dõi trạng thái xét tuyển.
                </p>
              </div>
            </Col>

            <Col xs={24} md={8} className={styles.timelineCol}>
              <div className={styles.timelineStepCard}>
                <div className={styles.stepIconOuter}>
                  <div className={styles.stepIconInner}>
                    <span className={styles.emojiIcon}>⏱️</span>
                  </div>
                </div>
                <h3>02. Theo dõi realtime</h3>
                <p>
                  Cập nhật trạng thái hồ sơ, lịch sử xử lý và thông báo tự động ngay khi có thay đổi từ hệ thống.
                </p>
              </div>
            </Col>

            <Col xs={24} md={8} className={styles.timelineCol}>
              <div className={styles.timelineStepCard}>
                <div className={styles.stepIconOuter}>
                  <div className={styles.stepIconInner}>
                    <span className={styles.emojiIcon}>🔒</span>
                  </div>
                </div>
                <h3>03. Bảo mật & ổn định</h3>
                <p>
                  Dữ liệu được quản lý tập trung với khả năng mở rộng cao, tối ưu hiệu năng trên cả desktop và mobile.
                </p>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* THÔNG BÁO & VĂN BẢN SECTION */}
      <section className={styles.portalInfoSection}>
        <Row gutter={[48, 32]}>
          {/* CỘT THÔNG BÁO */}
          <Col xs={24} lg={12}>
            <div className={styles.columnHeader}>
              <div className={styles.columnTitleBox}>
                <span className={styles.iconBlueMegaphone}>📢</span>
                <span className={styles.columnTitleText}>THÔNG BÁO</span>
              </div>
              <a className={styles.viewAllLink}>Xem tất cả →</a>
            </div>
            
            <div className={styles.announcementList}>
              {announcements.map((ann, idx) => (
                <div key={idx} className={styles.announcementCard}>
                  <div className={styles.nationalBadge}>
                    <div className={styles.badgeCircle}>
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/a/a3/Emblem_of_Vietnam.svg"
                        alt="Quốc huy Việt Nam"
                      />
                    </div>
                    <span className={styles.badgeLabel}>THÔNG BÁO</span>
                  </div>
                  
                  <div className={styles.annContent}>
                    <h3 className={styles.annTitle}>{ann.title}</h3>
                    <div className={styles.annDate}>
                      <CalendarOutlined style={{ marginRight: 6 }} />
                      {ann.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Col>

          {/* CỘT VĂN BẢN */}
          <Col xs={24} lg={12}>
            <div className={styles.columnHeader}>
              <div className={styles.columnTitleBox}>
                <span className={styles.iconBlueBook}>📄</span>
                <span className={styles.columnTitleText}>VĂN BẢN</span>
              </div>
              <a className={styles.viewAllLink}>Xem tất cả →</a>
            </div>
            
            <div className={styles.documentList}>
              {documents.map((doc, idx) => (
                <div key={idx} className={styles.documentCard}>
                  <div className={styles.docLeftIcon}>
                    <FilePdfOutlined className={styles.pdfOutlineIcon} />
                  </div>
                  
                  <div className={styles.docMiddleContent}>
                    <h3 className={styles.docTitle}>{doc.title}</h3>
                  </div>

                  <div className={styles.docRightMeta}>
                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>Ngày ban hành:</span>
                      <span className={styles.metaValue}>{doc.issueDate}</span>
                    </div>
                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>Ngày có hiệu lực:</span>
                      <span className={styles.metaValue}>{doc.effectDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </section>

      {/* KPI/STATISTICS CAPSULE SECTION */}
      <section className={styles.kpiCapsuleSection}>
        <Row gutter={[16, 24]} className={styles.kpiRow} align="middle" justify="space-around">
          <Col xs={24} sm={12} lg={6} className={styles.kpiCol}>
            <div className={styles.kpiItem}>
              <div className={styles.kpiIconBox}>
                <TeamOutlined />
              </div>
              <div className={styles.kpiContent}>
                <h4>Hàng triệu thí sinh</h4>
                <p>đang sử dụng</p>
              </div>
            </div>
          </Col>

          <Col xs={24} sm={12} lg={6} className={styles.kpiCol}>
            <div className={styles.kpiItem}>
              <div className={styles.kpiIconBox}>
                <SafetyCertificateOutlined />
              </div>
              <div className={styles.kpiContent}>
                <h4>Bảo mật an toàn</h4>
                <p>chuẩn quốc tế</p>
              </div>
            </div>
          </Col>

          <Col xs={24} sm={12} lg={6} className={styles.kpiCol}>
            <div className={styles.kpiItem}>
              <div className={styles.kpiIconBox}>
                <ClockCircleOutlined />
              </div>
              <div className={styles.kpiContent}>
                <h4>Xử lý nhanh ổn định</h4>
                <p>24/7</p>
              </div>
            </div>
          </Col>

          <Col xs={24} sm={12} lg={6} className={styles.kpiCol}>
            <div className={styles.kpiItem}>
              <div className={styles.kpiIconBox}>
                <PieChartOutlined />
              </div>
              <div className={styles.kpiContent}>
                <h4>Minh bạch dữ liệu</h4>
                <p>chính xác</p>
              </div>
            </div>
          </Col>
        </Row>
      </section>

      {/* FOOTER NAVIGATION */}
      <footer className={styles.portalFooter}>
        <div className={styles.footerLeft}>
          © 2025 Hệ thống tuyển sinh đại học trực tuyến. All rights reserved.
        </div>
        <div className={styles.footerRight}>
          <a>Chính sách bảo mật</a>
          <span className={styles.footerDivider}>|</span>
          <a>Điều khoản sử dụng</a>
          <span className={styles.footerDivider}>|</span>
          <a>Hỗ trợ</a>
        </div>
      </footer>
    </main>
  );
}