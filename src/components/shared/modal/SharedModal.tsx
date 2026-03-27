"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface SharedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidthClassName?: string;
  onSave?: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  saveVariant?: "primary" | "danger";
}

export default function SharedModal({
  isOpen,
  onClose,
  title,
  children,
  maxWidthClassName = "max-w-3xl",
  onSave,
  saveLabel = "Save Changes",
  cancelLabel = "Cancel",
  saveVariant = "primary",
}: SharedModalProps) {
  const saveButtonClassName =
    saveVariant === "danger"
      ? "rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
      : "rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700";

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-8 backdrop-blur-[2px]"
      onClick={onClose}
      role="presentation"
    >
      <div
        className={`relative flex max-h-[90vh] w-full flex-col ${maxWidthClassName} overflow-hidden rounded-4xl bg-white shadow-2xl shadow-slate-900/20`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title ?? "Dialog"}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 md:px-8">
          <div>
            {title ? (
              <h2 className="text-xl font-bold tracking-tight text-slate-900">{title}</h2>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 md:px-8">
          {children}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-5 md:px-8">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            {cancelLabel}
          </button>

          {onSave ? (
            <button
              type="button"
              onClick={onSave}
              className={`cursor-pointer ${saveButtonClassName}`}
            >
              {saveLabel}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
