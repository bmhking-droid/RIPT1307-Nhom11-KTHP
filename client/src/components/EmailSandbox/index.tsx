import React, { useEffect, useState } from 'react';
import {
  MailOutlined,
  DeleteOutlined,
  SyncOutlined,
  CloseOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import { Badge, Button, Drawer, List, Popconfirm, Tag, message, Card } from 'antd';
import request from '@/services/request';
import styles from './index.less';

export default function EmailSandbox() {
  const [open, setOpen] = useState(false);
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<any>(null);

  // Gọi API tải danh sách email log
  const fetchEmails = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res: any = await request.get('/emails-log');
      if (res && res.success) {
        setEmails(res.data || []);
      }
    } catch (err) {
      console.error('Không thể tải email log:', err);
    } finally {
      setLoading(false);
    }
  };

  // Tự động làm mới danh sách email mỗi khi mở drawer hoặc định kỳ
  useEffect(() => {
    fetchEmails(true);
    const interval = setInterval(() => {
      fetchEmails(true);
    }, 15000); // 15 giây tự động refresh ngầm
    return () => clearInterval(interval);
  }, []);

  // Xoá sạch sandbox
  const handleClearSandbox = async () => {
    try {
      setLoading(true);
      const res: any = await request.delete('/emails-log');
      if (res && res.success) {
        message.success('Đã dọn dẹp hộp thư thử nghiệm!');
        setEmails([]);
        setSelectedEmail(null);
      }
    } catch (err) {
      message.error('Không thể dọn dẹp hộp thư');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* FLOATING ACTION BUTTON */}
      <div 
        className={styles.floatingFab} 
        onClick={() => {
          setOpen(true);
          fetchEmails();
        }}
      >
        <Badge count={emails.length} offset={[-2, 2]} color="#EF4444">
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<MailOutlined className={styles.fabIcon} />}
            className={styles.fabBtn}
          />
        </Badge>
        <span className={styles.fabLabel}>Hộp Thư Sandbox</span>
      </div>

      {/* EMAIL SANDBOX DRAWER */}
      <Drawer
        title={
          <div className={styles.drawerTitle}>
            <InboxOutlined />
            <span>Hộp Thư Sandbox (Email System)</span>
            <Tag color="purple" style={{ marginLeft: 8, borderRadius: 4 }}>DevMode</Tag>
          </div>
        }
        placement="right"
        width={480}
        onClose={() => {
          setOpen(false);
          setSelectedEmail(null);
        }}
        open={open}
        className={styles.sandboxDrawer}
        extra={
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Button 
              type="text" 
              icon={<SyncOutlined spin={loading} />} 
              onClick={() => fetchEmails()} 
              disabled={loading}
            />
            {emails.length > 0 && (
              <Popconfirm
                title="Xác nhận xoá sạch hộp thư thử nghiệm?"
                onConfirm={handleClearSandbox}
                okText="Xoá sạch"
                cancelText="Hủy"
              >
                <Button type="primary" danger size="small" icon={<DeleteOutlined />}>
                  Dọn dẹp
                </Button>
              </Popconfirm>
            )}
          </div>
        }
      >
        {selectedEmail ? (
          /* CHI TIẾT EMAIL */
          <div className={styles.emailDetailView}>
            <Button
              type="link"
              onClick={() => setSelectedEmail(null)}
              style={{ paddingLeft: 0, marginBottom: 12, display: 'flex', alignItems: 'center' }}
            >
              ← Quay lại danh sách thư
            </Button>

            <Card className={styles.detailHeaderCard}>
              <div className={styles.headerItem}>
                <strong>Đến:</strong> <span>{selectedEmail.to}</span>
              </div>
              <div className={styles.headerItem}>
                <strong>Tiêu đề:</strong> <span className={styles.emailSubject}>{selectedEmail.subject}</span>
              </div>
              <div className={styles.headerItem}>
                <strong>Thời gian:</strong> <span className={styles.emailTime}>{selectedEmail.time}</span>
              </div>
            </Card>

            <div className={styles.emailIframeContainer}>
              <iframe
                title="Email Preview"
                srcDoc={selectedEmail.html}
                sandbox="allow-popups"
                className={styles.emailIframe}
              />
            </div>
          </div>
        ) : (
          /* DANH SÁCH EMAIL LOG */
          <List
            loading={loading}
            itemLayout="horizontal"
            dataSource={emails}
            locale={{
              emptyText: (
                <div className={styles.emptyInbox}>
                  <div className={styles.emptyIcon}>📬</div>
                  <h3>Hộp thư trống</h3>
                  <p>Các email hệ thống sinh ra (Thông báo nộp hồ sơ, kết quả xét duyệt...) sẽ xuất hiện tại đây khi có hoạt động.</p>
                  <Button type="dashed" size="small" onClick={() => fetchEmails()}>
                    Nhấn vào đây để tải lại
                  </Button>
                </div>
              ),
            }}
            renderItem={(item) => (
              <List.Item
                className={styles.emailItem}
                onClick={() => setSelectedEmail(item)}
              >
                <div className={styles.emailItemContent}>
                  <div className={styles.emailItemHeader}>
                    <span className={styles.emailRecipient}>To: {item.to}</span>
                    <span className={styles.emailDate}>{item.time.split(' ')[0] || item.time}</span>
                  </div>
                  <h4 className={styles.emailSubjectText}>{item.subject}</h4>
                  <div className={styles.emailClickIndicator}>Bấm vào để xem nội dung thư →</div>
                </div>
              </List.Item>
            )}
          />
        )}
      </Drawer>
    </>
  );
}
