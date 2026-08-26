import ResourcePage from '../../components/common/ResourcePage';
import { reportService } from '../../services/reportService';

export default function Reports() {
  return <ResourcePage title="Reports" subtitle="Manage report records returned by the platform" service={{ list: reportService.getAllReports, create: reportService.createReport, update: reportService.updateReport, remove: reportService.deleteReport }}
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
