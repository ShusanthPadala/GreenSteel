import { useState } from 'react';
import ResourcePage from '../../components/common/ResourcePage';
import ReportGenerator from '../../components/reports/ReportGenerator';
import { reportService } from '../../services/reportService';

export default function Reports() {
  const [refreshToken, setRefreshToken] = useState(0);
  return <ResourcePage title="Reports" subtitle="Manage report records returned by the platform" resource="reports" refreshToken={refreshToken}
    beforeTable={<ReportGenerator onSaved={() => setRefreshToken((t) => t + 1)} />}
    defaultSort={{ key: 'generatedDate', dir: 'desc' }} service={{ list: reportService.getAllReports, create: reportService.createReport, update: reportService.updateReport, remove: reportService.deleteReport }}
    searchKeys={['reportName', 'reportType', 'format', 'status', 'generatedDate']} searchPlaceholder="Search reports"
    fields={[
      { name: 'reportName', label: 'Report name', required: true }, { name: 'reportType', label: 'Report type', required: true },
      { name: 'format', label: 'Format', required: true }, { name: 'status', label: 'Status', required: true },
    ]}
    columns={[
      { key: 'reportName', label: 'Report' }, { key: 'reportType', label: 'Type' }, { key: 'format', label: 'Format' },
      { key: 'generatedDate', label: 'Generated', render: (row) => row.generatedDate || '—' }, { key: 'status', label: 'Status' },
    ]} />;
}
