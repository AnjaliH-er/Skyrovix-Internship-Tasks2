import React, { useState } from 'react';
import { 
  Database, 
  Download, 
  RotateCcw, 
  FileSpreadsheet, 
  FileCode, 
  ShieldCheck, 
  Loader2, 
  Server, 
  HardDrive 
} from 'lucide-react';
import { resetDatabase, getStudents } from '../../api/studentApi';
import { useNotification } from '../../context/NotificationContext';
import ConfirmDialog from '../common/ConfirmDialog';

export default function SettingsView({ stats, onRefreshData }) {
  const { notify } = useNotification();
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleResetConfirm = async () => {
    setIsResetting(true);
    try {
      const res = await resetDatabase();
      notify(res.message || 'Database successfully reset to seed data.', 'success');
      setIsResetModalOpen(false);
      if (onRefreshData) {
        await onRefreshData();
      }
    } catch (err) {
      notify(err.message || 'Failed to reset database.', 'error');
    } finally {
      setIsResetting(false);
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const res = await getStudents({ limit: 'all' });
      const students = res.data || [];

      if (students.length === 0) {
        notify('No student records available to export.', 'warning');
        return;
      }

      // Generate CSV string
      const headers = [
        'ID', 'Student ID', 'Full Name', 'Email', 'Phone', 'Gender',
        'DOB', 'Department', 'Course', 'Year', 'Address', 'Status', 'Created At'
      ];

      const csvRows = [headers.join(',')];

      students.forEach((s) => {
        const row = [
          s.id,
          `"${s.student_id}"`,
          `"${s.full_name}"`,
          `"${s.email}"`,
          `"${s.phone}"`,
          `"${s.gender}"`,
          `"${s.date_of_birth}"`,
          `"${s.department}"`,
          `"${s.course}"`,
          `"${s.year}"`,
          `"${(s.address || '').replace(/"/g, '""')}"`,
          `"${s.status}"`,
          `"${s.created_at}"`
        ];
        csvRows.push(row.join(','));
      });

      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `students_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      notify(`Successfully exported ${students.length} students to CSV.`, 'success');
    } catch (err) {
      notify('Export failed: ' + err.message, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportJSON = async () => {
    setIsExporting(true);
    try {
      const res = await getStudents({ limit: 'all' });
      const students = res.data || [];

      const blob = new Blob([JSON.stringify(students, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `students_export_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      notify(`Successfully exported ${students.length} students to JSON.`, 'success');
    } catch (err) {
      notify('JSON export failed: ' + err.message, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          System Settings & Database Management
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure portal settings, export student registries, and manage database lifecycle.
        </p>
      </div>

      {/* Database Lifecycle Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800 tracking-tight">
              Relational Database Operations
            </h3>
            <p className="text-xs text-slate-500">
              Direct interaction with SQLite database (`database/students.db`)
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/70">
          <div>
            <div className="font-semibold text-xs text-slate-800">
              Restore Sample Seed Records
            </div>
            <p className="text-xs text-slate-500 mt-0.5 max-w-md">
              Resets the database and restores the 12 default realistic sample student records. This is useful for testing, demonstrations, or reviewer evaluations.
            </p>
          </div>

          <button
            onClick={() => setIsResetModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-xl transition-colors whitespace-nowrap shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Sample Data</span>
          </button>
        </div>
      </div>

      {/* Data Export Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800 tracking-tight">
              Export Student Registry
            </h3>
            <p className="text-xs text-slate-500">
              Download complete student database records in standard formats
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* CSV Export */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-7 h-7 text-emerald-600" />
              <div>
                <span className="font-semibold text-xs text-slate-800 block">Export as CSV</span>
                <span className="text-[11px] text-slate-500">Compatible with Excel & Sheets</span>
              </div>
            </div>
            <button
              onClick={handleExportCSV}
              disabled={isExporting}
              className="px-3.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-100/70 hover:bg-emerald-200/70 rounded-lg transition-colors disabled:opacity-50"
            >
              Export CSV
            </button>
          </div>

          {/* JSON Export */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileCode className="w-7 h-7 text-indigo-600" />
              <div>
                <span className="font-semibold text-xs text-slate-800 block">Export as JSON</span>
                <span className="text-[11px] text-slate-500">Raw structured dataset</span>
              </div>
            </div>
            <button
              onClick={handleExportJSON}
              disabled={isExporting}
              className="px-3.5 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-100/70 hover:bg-indigo-200/70 rounded-lg transition-colors disabled:opacity-50"
            >
              Export JSON
            </button>
          </div>
        </div>
      </div>

      {/* System Information Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800 tracking-tight">
              Application & Environment Architecture
            </h3>
            <p className="text-xs text-slate-500">
              Runtime information and system status
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Backend Engine</span>
            <span className="font-semibold text-slate-800 mt-0.5 block">Express.js (Node v24)</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Database Engine</span>
            <span className="font-semibold text-slate-800 mt-0.5 block">SQLite3 (node:sqlite WAL)</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Frontend Client</span>
            <span className="font-semibold text-slate-800 mt-0.5 block">React 18 + Tailwind CSS</span>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <ConfirmDialog
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetConfirm}
        title="Reset Database to Default Seed Data"
        message="This will overwrite the current database and restore the 12 sample student records. Any custom records you added will be removed."
        confirmText="Confirm Reset"
        isLoading={isResetting}
      />
    </div>
  );
}
