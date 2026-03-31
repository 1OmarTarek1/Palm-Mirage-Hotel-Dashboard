"use client";

import React, { useEffect, useState } from "react";
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
}

export default function UserForm({ user, onChange }: UserFormProps) {
  const [formData, setFormData] = useState<User>(user);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleChange = <K extends keyof User>(key: K, value: User[K]) => {
    const updated = { ...formData, [key]: value };
    setFormData(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">User Name</span>
          <input
            value={formData.userName}
            onChange={(event) => handleChange("userName", event.target.value)}
            className="font-main w-full rounded-2xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:bg-card"
            placeholder="Enter username"
          />
        </label>

        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Email</span>
          <input
            type="email"
            value={formData.email}
            onChange={(event) => handleChange("email", event.target.value)}
            className="font-main w-full rounded-2xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:bg-card"
            placeholder="Enter email"
          />
        </label>

        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Role</span>
          <Select
            value={formData.role}
            onValueChange={(value) => handleChange("role", value as User["role"])}
          >
            <SelectTrigger className="h-[50px] rounded-2xl bg-muted/35">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </label>

        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Gender</span>
          <Select
            value={formData.gender}
            onValueChange={(value) => handleChange("gender", value as User["gender"])}
          >
            <SelectTrigger className="h-[50px] rounded-2xl bg-muted/35">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </label>

        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Country</span>
          <input
            value={formData.country}
            onChange={(event) => handleChange("country", event.target.value)}
            className="font-main w-full rounded-2xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:bg-card"
            placeholder="Enter country"
          />
        </label>

        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Phone Number</span>
          <input
            value={formData.phoneNumber || ""}
            onChange={(event) => handleChange("phoneNumber", event.target.value)}
            className="font-main w-full rounded-2xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:bg-card"
            placeholder="Enter phone number"
          />
        </label>

        <label className="space-y-3 rounded-[24px] border border-border bg-muted/35 p-4 md:col-span-2">
          <span className="font-main text-sm font-semibold text-foreground">Status</span>
          <button
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
