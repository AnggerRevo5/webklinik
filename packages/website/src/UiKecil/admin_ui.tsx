"use client";
import { AlertTriangle, CheckCircle, Info, Trash2, X, XCircle } from "lucide-react";
import { useState } from "react";

// ─── Toast ────────────────────────────────────────────────────────────────────

export type ToastType = "success" | "error" | "info";
export type ToastState = { id: number; message: string; type: ToastType };

export function useToast() {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  function showToast(message: string, type: ToastType = "success") {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }

  function dismissToast(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return { toasts, showToast, dismissToast };
}

export function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastState[];
  onDismiss: (id: number) => void;
}) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed right-4 top-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => {
        const cfg = {
          success: { wrap: "bg-emerald-50 border-emerald-200 text-emerald-700", Icon: CheckCircle },
          error:   { wrap: "bg-rose-50 border-rose-200 text-rose-700",          Icon: XCircle },
          info:    { wrap: "bg-sky-50 border-sky-200 text-sky-700",             Icon: Info },
        }[toast.type];
        const { Icon } = cfg;
        return (
          <div
            key={toast.id}
            className={`flex max-w-xs items-center gap-3 rounded-xl border px-4 py-3 shadow-lg text-[11px] font-medium ${cfg.wrap}`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="flex-1">{toast.message}</span>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Tutup notifikasi"
              className="ml-1 opacity-60 hover:opacity-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ─── ConfirmDialog ────────────────────────────────────────────────────────────

export type ConfirmDialogState = {
  title: string;
  message: string;
  onConfirm: () => void;
  type?: "danger" | "warning";
} | null;

export function ConfirmDialog({
  dialog,
  onClose,
}: {
  dialog: ConfirmDialogState;
  onClose: () => void;
}) {
  if (!dialog) return null;
  const isDanger = dialog.type !== "warning";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div
          className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${isDanger ? "bg-rose-100" : "bg-amber-100"}`}
        >
          {isDanger ? (
            <Trash2 className="h-5 w-5 text-rose-500" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          )}
        </div>
        <h3 className="mb-1 text-[13px] font-semibold text-slate-900">{dialog.title}</h3>
        <p className="mb-6 text-[11px] leading-relaxed text-slate-500">{dialog.message}</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-slate-200 bg-slate-50 py-2 text-[11px] font-medium text-slate-600 transition hover:bg-slate-100"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              dialog.onConfirm();
              onClose();
            }}
            className={`flex-1 rounded-lg py-2 text-[11px] font-medium text-white transition ${isDanger ? "bg-rose-500 hover:bg-rose-600" : "bg-amber-500 hover:bg-amber-600"}`}
          >
            {isDanger ? "Ya, Hapus" : "Ya, Lanjutkan"}
          </button>
        </div>
      </div>
    </div>
  );
}
