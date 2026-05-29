import { useState } from 'react';
import { Card, Input, Button, Tag, Space, message, Row, Col, Empty, List } from 'antd';
import { SearchOutlined, BookOutlined, CalendarOutlined, FileTextOutlined, AuditOutlined } from '@ant-design/icons';
import request from '@/services/request';
import styles from './index.less';

export default function LookupPage() {
  const [searchKey, setSearchKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    const trimmed = searchKey.trim();
    if (!trimmed) {
      message.warning('Vui lòng nhập Email hoặc Số CCCD để tra cứu!');
      return;
    }

    try {
      setLoading(true);
      const res: any = await request.get('/applications/public/lookup', {
        params: { searchKey: trimmed },
      });

      if (res && res.success) {
        setApplications(res.data || []);
        setSearched(true);
        if (res.data?.length === 0) {
          message.info('Không tìm thấy hồ sơ nào khớp với thông tin cung cấp.');
        } else {
          message.success(`Tìm thấy ${res.data.length} hồ sơ đăng ký xét tuyển!`);
        }
      } else {
        message.error(res?.message || 'Có lỗi xảy ra khi tra cứu thông tin.');
      }
    } catch (error: any) {
      console.error('💥 [LOOKUP ERROR]:', error);
      const errMsg = error?.response?.data?.message || 'Không tìm thấy thông tin thí sinh khớp với từ khóa tìm kiếm!';
      message.error(errMsg);
      setApplications([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'approved':
        return <Tag color="success" style={{ borderRadius: 8, padding: '4px 12px', fontWeight: 600 }}>ĐÃ TRÚNG TUYỂN</Tag>;
      case 'rejected':
        return <Tag color="error" style={{ borderRadius: 8, padding: '4px 12px', fontWeight: 600 }}>KHÔNG TRÚNG TUYỂN</Tag>;
      default:
        return <Tag color="warning" style={{ borderRadius: 8, padding: '4px 12px', fontWeight: 600 }}>ĐANG XÉT DUYỆT</Tag>;
    }
  };

  return (
    <div className={styles.lookupPage}>
      <div style={{ textAlign: 'center', marginBottom: 36, marginTop: 12 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1e1b4b', marginBottom: 8 }}>
          Tra Cứu Kết Quả Xét Tuyển
        </h1>
        <p style={{ fontSize: 16, color: '#4b5563', maxWidth: 540, margin: '0 auto' }}>
          Nhập địa chỉ Email hoặc số CCCD bạn đã dùng khi nộp hồ sơ để kiểm tra kết quả phê duyệt thời gian thực.
        </p>
      </div>

      <Card className={styles.searchCard}>
        <Space.Compact style={{ width: '100%' }}>
          <Input
            size="large"
            placeholder="Nhập địa chỉ Email hoặc số CCCD đăng ký..."
            prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            onPressEnter={handleSearch}
            style={{ borderRadius: '12px 0 0 12px' }}
          />
          <Button
            type="primary"
            size="large"
            loading={loading}
            onClick={handleSearch}
            style={{ borderRadius: '0 12px 12px 0', background: '#4f46e5', borderColor: '#4f46e5' }}
          >
            Tra cứu
          </Button>
        </Space.Compact>
      </Card>

      {searched && (
        <div className={styles.resultsContainer}>
          {applications.length > 0 ? (
            <List
              dataSource={applications}
              renderItem={(app: any) => (
                <Card className={styles.appCard} style={{ marginBottom: 16 }}>
                  <div className={styles.cardHeader}>
                    <div className={styles.uniName}>
                      <BookOutlined style={{ marginRight: 8, color: '#4f46e5' }} />
                      {app.University?.name || 'Trường Đại học'}
                    </div>
                    {getStatusTag(app.status)}
                  </div>

                  <Row gutter={[16, 12]}>
                    <Col xs={24} sm={12}>
                      <div className={styles.infoRow}>
                        <BookOutlined style={{ marginRight: 6 }} />
                        Ngành đăng ký: <strong>{app.Major?.name} ({app.Major?.code})</strong>
                      </div>
                    </Col>
                    <Col xs={24} sm={12}>
                      <div className={styles.infoRow}>
                        <AuditOutlined style={{ marginRight: 6 }} />
                        Tổ hợp môn: <strong>{app.AdmissionCombination?.code} ({app.AdmissionCombination?.subjects})</strong>
                      </div>
                    </Col>
                    <Col xs={24} sm={12}>
                      <div className={styles.infoRow}>
                        <CalendarOutlined style={{ marginRight: 6 }} />
                        Đợt tuyển sinh: <strong>{app.AdmissionRound?.name}</strong>
                      </div>
                    </Col>
                    <Col xs={24} sm={12}>
                      <div className={styles.infoRow}>
                        <FileTextOutlined style={{ marginRight: 6 }} />
                        Điểm xét tuyển: <strong style={{ color: '#4f46e5', fontSize: 16 }}>{app.totalScore} điểm</strong>
                      </div>
                    </Col>

                    {app.status === 'rejected' && app.rejectionReason && (
                      <Col xs={24}>
                        <div style={{
                          background: '#fef2f2',
                          border: '1px solid #fecaca',
                          padding: '12px 16px',
                          borderRadius: 12,
                          color: '#991b1b',
                          fontSize: 14,
                          marginTop: 12
                        }}>
                          ⚠️ <strong>Lý do từ chối:</strong> {app.rejectionReason}
                        </div>
                      </Col>
                    )}
                  </Row>
                </Card>
              )}
            />
          ) : (
            <Card style={{ borderRadius: 24, padding: '40px 0', border: '1px solid #e2e8f0' }}>
              <Empty
                description={
                  <span style={{ color: '#9ca3af', fontSize: 15 }}>
                    Không tìm thấy kết quả hồ sơ xét tuyển.
                    <br />
                    Vui lòng kiểm tra lại Email hoặc số CCCD nhập vào.
                  </span>
                }
              />
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
