"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { User } from "./data";

interface UserFormProps {
  user: User;
  isEditing?: boolean;
  onChange: (user: User) => void;
}

export default function UserForm({ user, isEditing = false, onChange }: UserFormProps) {
  const [formData, setFormData] = useState<User>(user);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const updateField = <K extends keyof User>(key: K, value: User[K]) => {
    const nextValue = { ...formData, [key]: value };
    setFormData(nextValue);
    onChange(nextValue);
  };

  const readOnlyFieldClassName =
    "font-main flex min-h-12 items-center rounded-md border border-border bg-muted/35 px-3 text-sm text-muted-foreground";

  return (
    <form
      className="grid gap-5 py-2 md:grid-cols-2"
      onSubmit={(event) => event.preventDefault()}
    >
      {isEditing ? (
        <>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Username
            </label>
            <div className={readOnlyFieldClassName}>{formData.userName}</div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Email
            </label>
            <div className={readOnlyFieldClassName}>{formData.email}</div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Phone Number
            </label>
            <div className={readOnlyFieldClassName}>{formData.phoneNumber || "Not provided"}</div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Country
            </label>
            <div className={readOnlyFieldClassName}>{formData.country || "Not provided"}</div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Gender
            </label>
            <div className={readOnlyFieldClassName}>{formData.gender}</div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Image URL
            </label>
            <div className={`${readOnlyFieldClassName} truncate`}>{formData.image || "Not provided"}</div>
          </div>
        </>
      ) : (
        <>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Username
            </label>
            <Input
              value={formData.userName}
              onChange={(event) => updateField("userName", event.target.value)}
              placeholder="Enter username"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Email
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="Enter email"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Password
            </label>
            <Input
              type="password"
              value={formData.password ?? ""}
              onChange={(event) => updateField("password", event.target.value)}
              placeholder="Enter password"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Phone Number
            </label>
            <Input
              value={formData.phoneNumber ?? ""}
              onChange={(event) => updateField("phoneNumber", event.target.value)}
              placeholder="Enter phone number"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Country
            </label>
            <Input
              value={formData.country}
              onChange={(event) => updateField("country", event.target.value)}
              placeholder="Enter country"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Image URL
            </label>
            <Input
              value={formData.image ?? ""}
              onChange={(event) => updateField("image", event.target.value)}
              placeholder="https://..."
            />
          </div>
        </>
      )}

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
          Role
        </label>
        <Select value={formData.role} onValueChange={(value) => updateField("role", value as User["role"])}>
          <SelectTrigger className="h-12 rounded-md border-border bg-transparent">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!isEditing ? (
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Gender
          </label>
          <Select
            value={formData.gender}
            onValueChange={(value) => updateField("gender", value as User["gender"])}
          >
            <SelectTrigger className="h-12 rounded-md border-border bg-transparent">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ) : null}

      <div className="space-y-2 md:col-span-2">
        <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
          Account Status
        </label>
        <Select
          value={formData.isConfirmed ? "confirmed" : "pending"}
          onValueChange={(value) => updateField("isConfirmed", value === "confirmed")}
        >
          <SelectTrigger className="h-12 rounded-md border-border bg-transparent">
            <SelectValue placeholder="Select account status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </form>
  );
}
