"use client";

import { useState } from "react";
import { ImageIcon, RefreshCw, Trash2 } from "lucide-react";
import MediaLibraryModal from "@/src/components/admin/media_library_modal";
import type { MediaFolder } from "@/src/lib/api";

interface ImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  folder?: MediaFolder;
  label?: string;
  required?: boolean;
}

export default function ImagePicker({
  value,
  onChange,
  folder,
  label = "Gambar",
  required = false,
}: ImagePickerProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-1">
      {label && (
        <div className="text-[8px] font-semibold uppercase tracking-[0.5px] text-slate-500">
          {label}
          {required && <span className="ml-0.5 text-rose-500">*</span>}
        </div>
      )}

      {value ? (
        <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="preview" className="h-36 w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-[9px] font-medium text-slate-800 shadow-md hover:bg-slate-50"
            >
              <RefreshCw className="h-3 w-3" />
              Ganti
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="flex items-center gap-1 rounded-lg bg-rose-500 px-3 py-1.5 text-[9px] font-medium text-white shadow-md hover:bg-rose-600"
            >
              <Trash2 className="h-3 w-3" />
              Hapus
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex h-28 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400 transition-all hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600"
        >
          <ImageIcon className="h-6 w-6 opacity-60" />
          <span className="text-[9px] font-medium">Pilih dari Media Library</span>
          <span className="text-[8px] opacity-60">JPG, PNG, WebP, GIF · Max 5MB</span>
        </button>
      )}

      <MediaLibraryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={(url) => {
          onChange(url);
          setModalOpen(false);
        }}
        defaultFolder={folder}
      />
    </div>
  );
}
