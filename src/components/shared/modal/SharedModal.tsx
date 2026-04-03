"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

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
  isSaving?: boolean;
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
  isSaving = false,
}: SharedModalProps) {
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
      className="fixed inset-0 z-[220] flex items-center justify-center bg-background/70 px-4 py-8 backdrop-blur-[2px]"
      onClick={onClose}
      role="presentation"
    >
      <div
        className={`relative z-[221] flex max-h-[90vh] w-full flex-col ${maxWidthClassName} overflow-hidden rounded-4xl border border-border bg-card shadow-2xl shadow-black/10`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title ?? "Dialog"}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5 md:px-8">
          <div>
            {title ? (
              <h2 className="font-header text-xl font-bold tracking-tight text-foreground">{title}</h2>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 md:px-8">
          {children}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-5 md:px-8">
          <Button
            type="button"
            variant="palmSecondary"
            size="sm"
            onClick={onClose}
            className="px-5 text-sm"
            disabled={isSaving}
          >
            {cancelLabel}
          </Button>

          {onSave ? (
            <Button
              type="button"
              variant={saveVariant === "danger" ? "palmDanger" : "palmPrimary"}
              size="sm"
              onClick={onSave}
              className={saveVariant === "danger" ? "px-5 text-sm" : "px-5 text-sm"}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Spinner className="size-4" />
                  <span>{saveLabel}</span>
                </>
              ) : (
                saveLabel
              )}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
