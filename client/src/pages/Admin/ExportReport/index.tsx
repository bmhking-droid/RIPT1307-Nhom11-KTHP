import React, { useState } from 'react';
import {
  Tabs,
  Card,
  Form,
  Select,
  DatePicker,
  Button,
  Space,
  Row,
  Col,
  message,
  Spin,
  Alert,
} from 'antd';
import { FileExcelOutlined, FileTextOutlined, DownloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import styles from './index.module.less';
import * as reportService from '@/services/report';

const ExportReport: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('applications');

  const handleExportExcel = async (exportType: string) => {
    try {
      setLoading(true);
      const values = form.getFieldsValue();

      await reportService.exportToExcel(exportType, values);
      message.success(`Xuất báo cáo ${exportType} thành công!`);
    } catch (error) {
      console.error('Export error:', error);
      message.error('Lỗi khi xuất báo cáo');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async (exportType: string) => {
    try {
      setLoading(true);
      const values = form.getFieldsValue();

      await reportService.exportToCSV(exportType, values);
      message.success(`Xuất báo cáo ${exportType} thành công!`);
    } catch (error) {
      console.error('Export error:', error);
      message.error('Lỗi khi xuất báo cáo');
    } finally {
      setLoading(false);
    }
  };

  const commonFilters = (
    <>
      <Row gutter={16}>
        <Col xs={24} sm={12} md={6}>
          <Form.Item
            label="Trạng thái"
            name="status"
            labelCol={{ span: 24 }}
          >
            <Select
              placeholder="Chọn trạng thái"
              allowClear
              options={[
                { label: 'Dự thảo', value: 'DRAFT' },
                { label: 'Đã nộp', value: 'SUBMITTED' },
                { label: 'Đang xét', value: 'PENDING' },
                { label: 'Chấp nhận', value: 'APPROVED' },
                { label: 'Từ chối', value: 'REJECTED' },
              ]}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Form.Item
            label="Trường đại học"
            name="universityId"
            labelCol={{ span: 24 }}
          >
            <Select
              placeholder="Chọn trường"
              allowClear
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Form.Item
            label="Ngành học"
            name="majorId"
            labelCol={{ span: 24 }}
          >
            <Select
              placeholder="Chọn ngành"
              allowClear
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Form.Item
            label="Đợt tuyển sinh"
            name="admissionRoundId"
            labelCol={{ span: 24 }}
          >
            <Select
              placeholder="Chọn đợt"
              allowClear
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={12} md={8}>
          <Form.Item
            label="Từ ngày"
            name="startDate"
            labelCol={{ span: 24 }}
          >
            <DatePicker
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
              placeholder="Chọn ngày bắt đầu"
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Form.Item
            label="Đến ngày"
            name="endDate"
            labelCol={{ span: 24 }}
          >
            <DatePicker
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
              placeholder="Chọn ngày kết thúc"
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={8} style={{ display: 'flex', alignItems: 'flex-end' }}>
          <Button onClick={() => form.resetFields()} style={{ width: '100%' }}>
            Xóa lọc
          </Button>
        </Col>
      </Row>
    </>
  );

  const exportButtons = (exportType: string) => (
    <Space>
      <Button
        type="primary"
        icon={<FileExcelOutlined />}
        loading={loading}
        onClick={() => handleExportExcel(exportType)}
      >
        Xuất Excel
      </Button>
      <Button
        icon={<FileTextOutlined />}
        loading={loading}
        onClick={() => handleExportCSV(exportType)}
      >
        Xuất CSV
      </Button>
    </Space>
  );

  const tabItems = [
    {
      key: 'applications',
      label: 'Danh sách ứng viên',
      children: (
        <Card className={styles.exportCard}>
          <Alert
            message="Xuất danh sách thí sinh đăng ký xét tuyển"
            description="Bao gồm thông tin cá nhân, trường, ngành, điểm và trạng thái hồ sơ"
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />

          <Form form={form} layout="vertical">
            {commonFilters}

            <div style={{ marginTop: 24 }}>
              {exportButtons('applications')}
            </div>
          </Form>
        </Card>
      ),
    },

    {
      key: 'status-statistics',
      label: 'Thống kê trạng thái',
      children: (
        <Card className={styles.exportCard}>
          <Alert
            message="Thống kê hồ sơ theo trạng thái"
            description="Hiển thị số lượng và tỷ lệ hồ sơ ở mỗi trạng thái"
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />

          <Form form={form} layout="vertical">
            <Row gutter={16}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="Từ ngày"
                  name="startDate"
                  labelCol={{ span: 24 }}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    format="DD/MM/YYYY"
                    placeholder="Chọn ngày bắt đầu"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="Đến ngày"
                  name="endDate"
                  labelCol={{ span: 24 }}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    format="DD/MM/YYYY"
                    placeholder="Chọn ngày kết thúc"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={8} style={{ display: 'flex', alignItems: 'flex-end' }}>
                <Button onClick={() => form.resetFields()} style={{ width: '100%' }}>
                  Xóa lọc
                </Button>
              </Col>
            </Row>

            <div style={{ marginTop: 24 }}>
              {exportButtons('status-statistics')}
            </div>
          </Form>
        </Card>
      ),
    },

    {
      key: 'major-statistics',
      label: 'Thống kê theo ngành',
      children: (
        <Card className={styles.exportCard}>
          <Alert
            message="Thống kê ứng viên theo ngành học"
            description="Hiển thị số hồ sơ cho mỗi ngành tại mỗi trường"
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />

          <Form form={form} layout="vertical">
            <Row gutter={16}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="Trường đại học"
                  name="universityId"
                  labelCol={{ span: 24 }}
                >
                  <Select placeholder="Chọn trường (tùy chọn)" allowClear />
                </Form.Item>
              </Col>

              <Col xs={24} md={16} style={{ display: 'flex', alignItems: 'flex-end' }}>
                <Button onClick={() => form.resetFields()} style={{ width: '100%' }}>
                  Xóa lọc
                </Button>
              </Col>
            </Row>

            <div style={{ marginTop: 24 }}>
              {exportButtons('major-statistics')}
            </div>
          </Form>
        </Card>
      ),
    },

    {
      key: 'admission-round-statistics',
      label: 'Thống kê theo đợt tuyển',
      children: (
        <Card className={styles.exportCard}>
          <Alert
            message="Thống kê ứng viên theo đợt tuyển sinh"
            description="Hiển thị số hồ sơ cho mỗi đợt tuyển sinh"
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />

          <Form form={form} layout="vertical">
            <div style={{ marginTop: 24 }}>
              {exportButtons('admission-round-statistics')}
            </div>
          </Form>
        </Card>
      ),
    },

    {
      key: 'university-statistics',
      label: 'Thống kê theo trường',
      children: (
        <Card className={styles.exportCard}>
          <Alert
            message="Thống kê ứng viên theo trường đại học"
            description="Hiển thị tổng số hồ sơ cho mỗi trường"
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />

          <Form form={form} layout="vertical">
            <div style={{ marginTop: 24 }}>
              {exportButtons('university-statistics')}
            </div>
          </Form>
        </Card>
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <div className={styles.exportReport}>
        <Card className={styles.header}>
          <div className={styles.headerContent}>
            <div>
              <h1>
                <FileExcelOutlined /> Xuất báo cáo dữ liệu
              </h1>
              <p>Xuất dữ liệu tuyển sinh dưới dạng Excel (.xlsx) hoặc CSV (.csv)</p>
            </div>
          </div>
        </Card>

        <Card className={styles.tabsCard}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            type="card"
          />
        </Card>
      </div>
    </Spin>
  );
};

export default ExportReport;
