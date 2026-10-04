import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import Modal from './Modal';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Deletion',
  message,
  studentName,
  studentId,
  isLoading = false,
  confirmText = 'Delete Student',
  cancelText = 'Cancel'
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-rose-100 text-rose-600 sm:w-10 sm:h-10">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-slate-600 leading-relaxed">
            {message || 'Are you sure you want to permanently delete this student record? This action cannot be undone.'}
          </p>
          {(studentName || studentId) && (
            <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
              {studentName && (
                <div className="font-semibold text-slate-800">
                  {studentName}
                </div>
              )}
              {studentId && (
                <div className="text-slate-500 font-mono mt-0.5">
                  ID: {studentId}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          disabled={isLoading}
          onClick={onClose}
          className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-colors disabled:opacity-50"
        >
          {cancelText}
        </button>
        <button
          type="button"
          disabled={isLoading}
          onClick={onConfirm}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500/30 transition-colors shadow-sm disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Deleting...
            </>
          ) : (
            confirmText
          )}
        </button>
      </div>
    </Modal>
  );
}
