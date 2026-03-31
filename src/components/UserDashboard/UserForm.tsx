"use client";

import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type User } from "./data";

interface UserFormProps {
  user: User;
  onChange: (user: User) => void;
  /** When true, shows the password field (used during creation) */
  isCreateMode?: boolean;
}

export default function UserForm({ user, onChange, isCreateMode = false }: UserFormProps) {
  const [formData, setFormData] = useState<User>(user);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleChange = <K extends keyof User>(key: K, value: User[K]) => {
    const updated = { ...formData, [key]: value };
    setFormData(updated);
    onChange(updated);
  };

  const inputClass =
    "font-main w-full rounded-2xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:bg-card";

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        {/* ── Username ── */}
        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">User Name</span>
          <input
            id="user-form-username"
            value={formData.userName}
            onChange={(event) => handleChange("userName", event.target.value)}
            className={inputClass}
            placeholder="Enter username"
          />
        </label>

        {/* ── Email ── */}
        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Email</span>
          <input
            id="user-form-email"
            type="email"
            value={formData.email}
            onChange={(event) => handleChange("email", event.target.value)}
            className={inputClass}
            placeholder="Enter email"
          />
        </label>

        {/* ── Password (create mode only) ── */}
        {isCreateMode ? (
          <>
            <label className="space-y-2">
              <span className="font-main text-sm font-semibold text-foreground">Password</span>
              <div className="relative">
                <input
                  id="user-form-password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password ?? ""}
                  onChange={(event) => handleChange("password", event.target.value)}
                  className={`${inputClass} pr-12`}
                  placeholder="Enter password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>

            <label className="space-y-2">
              <span className="font-main text-sm font-semibold text-foreground">Confirm Password</span>
              <div className="relative">
                <input
                  id="user-form-confirm-password"
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword ?? ""}
                  onChange={(event) => handleChange("confirmPassword", event.target.value)}
                  className={`${inputClass} pr-12`}
                  placeholder="Confirm password"
                  autoComplete="new-password"
                />
              </div>
            </label>
          </>
        ) : null}

        {/* ── Role ── */}
        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Role</span>
          <Select
            value={formData.role}
            onValueChange={(value) => handleChange("role", value as User["role"])}
          >
            <SelectTrigger id="user-form-role" className="h-[50px] rounded-2xl bg-muted/35">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </label>

        {/* ── Gender ── */}
        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Gender</span>
          <Select
            value={formData.gender}
            onValueChange={(value) => handleChange("gender", value as User["gender"])}
          >
            <SelectTrigger id="user-form-gender" className="h-[50px] rounded-2xl bg-muted/35">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </label>

        {/* ── Country ── */}
        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Country</span>
          <input
            id="user-form-country"
            value={formData.country}
            onChange={(event) => handleChange("country", event.target.value)}
            className={inputClass}
            placeholder="Enter country"
          />
        </label>

        {/* ── Phone Number ── */}
        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Phone Number</span>
          <input
            id="user-form-phone"
            value={formData.phoneNumber || ""}
            onChange={(event) => handleChange("phoneNumber", event.target.value)}
            className={inputClass}
            placeholder="Enter phone number"
          />
        </label>

        {/* ── Status Toggle ── */}
        <label className="space-y-3 rounded-[24px] border border-border bg-muted/35 p-4 md:col-span-2">
          <span className="font-main text-sm font-semibold text-foreground">Status</span>
          <button
            id="user-form-status-toggle"
            type="button"
            onClick={() => handleChange("isConfirmed", !formData.isConfirmed)}
            className={`flex w-full cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 text-sm transition ${
              formData.isConfirmed
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground"
            }`}
          >
            <span className="font-main font-semibold">
              {formData.isConfirmed ? "Confirmed User" : "Pending Confirmation"}
            </span>
            <span className="font-main text-xs uppercase tracking-[0.2em]">
              {formData.isConfirmed ? "Confirmed" : "Pending"}
            </span>
          </button>
        </label>
      </div>
    </div>
  );
}
