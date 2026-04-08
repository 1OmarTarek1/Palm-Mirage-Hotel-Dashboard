"use client";

import type { ChangeEvent } from "react";
import Image from "next/image";
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
  const updateField = <K extends keyof User>(key: K, value: User[K]) => {
    const nextValue = { ...user, [key]: value };
    onChange(nextValue);
  };

  const handleImageUrlChange = (value: string) => {
    const nextValue = { ...user, image: value, imageFile: null };
    onChange(nextValue);
  };

  const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      const nextValue = { ...user, imageFile: null };
      onChange(nextValue);
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const nextValue = { ...user, image: previewUrl, imageFile: file };
    onChange(nextValue);
  };

  const readOnlyFieldClassName =
    "font-main flex min-h-[50px] items-center rounded-2xl border border-border bg-muted/35 px-4 text-sm text-muted-foreground";
  const inputClassName = "h-[50px] rounded-2xl border-border bg-transparent px-4";
  const fileInputClassName =
    "block h-[50px] w-full cursor-pointer rounded-2xl border border-border bg-transparent px-4 py-0 text-sm leading-[3rem] text-foreground file:mr-4 file:cursor-pointer file:rounded-full file:border file:border-primary/20 file:bg-primary/8 file:px-3 file:py-1.5 file:text-sm file:font-medium file:leading-normal file:text-foreground";

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
            <div className={readOnlyFieldClassName}>{user.userName}</div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Email
            </label>
            <div className={readOnlyFieldClassName}>{user.email}</div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Phone Number
            </label>
            <div className={readOnlyFieldClassName}>{user.phoneNumber || "Not provided"}</div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Country
            </label>
            <div className={readOnlyFieldClassName}>{user.country || "Not provided"}</div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Gender
            </label>
            <div className={readOnlyFieldClassName}>{user.gender}</div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Image URL
            </label>
            <div className={`${readOnlyFieldClassName} truncate`}>{user.image || "Not provided"}</div>
          </div>
        </>
      ) : (
        <>
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Profile Image
            </label>
            <div className="rounded-3xl border border-border bg-muted/20 p-4">
              <div className="flex flex-col gap-4">
                <div className="relative mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-border bg-muted/35">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.userName || "User preview"}
                      fill
                      unoptimized
                      sizes="96px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">No image</span>
                  )}
                </div>

                <div className="grid gap-3 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className={fileInputClassName}
                  />

                  <Input
                    className={inputClassName}
                    value={user.image ?? ""}
                    onChange={(event) => handleImageUrlChange(event.target.value)}
                    placeholder="Or paste an image URL"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Username
            </label>
            <Input
              className={inputClassName}
              value={user.userName}
              onChange={(event) => updateField("userName", event.target.value)}
              placeholder="Enter username"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Email
            </label>
            <Input
              className={inputClassName}
              type="email"
              value={user.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="Enter email"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Password
            </label>
            <Input
              className={inputClassName}
              type="password"
              value={user.password ?? ""}
              onChange={(event) => updateField("password", event.target.value)}
              placeholder="Enter password"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Phone Number
            </label>
            <Input
              className={inputClassName}
              value={user.phoneNumber ?? ""}
              onChange={(event) => updateField("phoneNumber", event.target.value)}
              placeholder="Enter phone number"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Country
            </label>
            <Input
              className={inputClassName}
              value={user.country}
              onChange={(event) => updateField("country", event.target.value)}
              placeholder="Enter country"
            />
          </div>
        </>
      )}

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
          Role
        </label>
        <Select value={user.role} onValueChange={(value) => updateField("role", value as User["role"])}>
          <SelectTrigger className="h-[50px] rounded-2xl border-border bg-transparent">
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
            value={user.gender}
            onValueChange={(value) => updateField("gender", value as User["gender"])}
          >
            <SelectTrigger className="h-[50px] rounded-2xl border-border bg-transparent">
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
          value={user.isConfirmed ? "confirmed" : "pending"}
          onValueChange={(value) => updateField("isConfirmed", value === "confirmed")}
        >
          <SelectTrigger className="h-[50px] rounded-2xl border-border bg-transparent">
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
