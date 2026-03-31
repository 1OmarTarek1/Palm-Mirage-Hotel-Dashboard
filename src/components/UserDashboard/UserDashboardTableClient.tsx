"use client";

import React, { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { toast } from "react-toastify";
import DynamicTable from "@/components/shared/table/DynamicTable";
import SharedModal from "@/components/shared/modal/SharedModal";
import UserForm from "@/components/UserDashboard/UserForm";
import { userColumns, userFilters } from "@/config/tablePresets/userColumns";
import { createUser, deleteUser, fetchUsers, updateUser } from "@/lib/users";
import { createEmptyUserDraft, type User } from "./data";

export interface UserDashboardTableClientHandle {
  openAddModal: () => void;
}

const UserDashboardTableClient = forwardRef<UserDashboardTableClientHandle>(function UserDashboardTableClient(_, ref) {
  const [users, setUsers] = React.useState<User[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [creatingDraft, setCreatingDraft] = useState<User | null>(null);
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useImperativeHandle(ref, () => ({
    openAddModal: () => {
      setCreatingDraft(createEmptyUserDraft());
    },
  }));

  React.useEffect(() => {
    let isMounted = true;

    const loadUsers = async () => {
      try {
        setIsLoading(true);
        const data = await fetchUsers();
        if (isMounted) {
          setUsers(data);
        }
      } catch (error) {
        if (isMounted) {
          toast.error(error instanceof Error ? error.message : "Failed to load users");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  /* ── derived user lookups ── */

  const viewingUser = useMemo(
    () => users.find((user) => user.id === viewingUserId) ?? null,
    [users, viewingUserId]
  );

  const editingUser = useMemo(
    () => users.find((user) => user.id === editingUserId) ?? null,
    [users, editingUserId]
  );

  const deletingUser = useMemo(
    () => users.find((user) => user.id === deletingUserId) ?? null,
    [users, deletingUserId]
  );

  /* ── close handlers ── */

  const handleCloseViewModal = () => setViewingUserId(null);
  const handleCloseAddModal = () => setCreatingDraft(null);
  const handleCloseEditModal = () => {
    setEditingUserId(null);
    setEditingDraft(null);
  };
  const handleCloseDeleteModal = () => setDeletingUserId(null);

  /* ── CRUD handlers ── */

  const handleCreateUser = () => {
    if (!creatingDraft) return;

    void (async () => {
      setIsSaving(true);
      try {
        const newUser = await createUser(creatingDraft);
        setUsers((prev) => [newUser, ...prev]);
        toast.success("User created successfully.");
        handleCloseAddModal();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to create user");
      } finally {
        setIsSaving(false);
      }
    })();
  };

  const handleSaveUser = () => {
    if (!editingDraft) return;

    void (async () => {
      setIsSaving(true);
      try {
        const updatedUser = await updateUser(editingDraft);
        setUsers((currentUsers) =>
          currentUsers.map((user) =>
            user.id === updatedUser.id ? updatedUser : user
          )
        );
        toast.success("User updated successfully.");
        handleCloseEditModal();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to save user");
      } finally {
        setIsSaving(false);
      }
    })();
  };

  const handleConfirmDeleteUser = () => {
    if (!deletingUser) return;

    void (async () => {
      setIsSaving(true);
      try {
        await deleteUser(deletingUser.id);
        setUsers((currentUsers) =>
          currentUsers.filter((user) => user.id !== deletingUser.id)
        );
        toast.success("User deleted successfully.");
        handleCloseDeleteModal();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to delete user");
      } finally {
        setIsSaving(false);
      }
    })();
  };

  /* ── table row actions ── */

  const actions = [
    {
      key: "view" as const,
      onClick: (user: User) => setViewingUserId(user.id),
    },
    {
      key: "edit" as const,
      onClick: (user: User) => {
        setEditingUserId(user.id);
        setEditingDraft(user);
      },
    },
    {
      key: "delete" as const,
      variant: "danger" as const,
      onClick: (user: User) => setDeletingUserId(user.id),
    },
  ];

  return (
    <>
      {/* ── Table ── */}
      <DynamicTable<User>
        columns={userColumns}
        data={users}
        isLoading={isLoading}
        filtersConfig={userFilters}
        pageSize={5}
        searchPlaceholder="Search users..."
        actions={actions}
      />

      {/* ═══════════════════════════════════════════════
          ADD USER MODAL
      ═══════════════════════════════════════════════ */}
      <SharedModal
        isOpen={Boolean(creatingDraft)}
        onClose={handleCloseAddModal}
        title="Add User"
        onSave={handleCreateUser}
        saveLabel="Create User"
        isSaving={isSaving}
      >
        {creatingDraft ? (
          <UserForm user={creatingDraft} onChange={setCreatingDraft} isCreateMode />
        ) : null}
      </SharedModal>

      {/* ═══════════════════════════════════════════════
          VIEW USER MODAL
      ═══════════════════════════════════════════════ */}
      <SharedModal
        isOpen={Boolean(viewingUser)}
        onClose={handleCloseViewModal}
        title={viewingUser ? `User: ${viewingUser.userName}` : "User Details"}
      >
        {viewingUser ? (
          <div className="space-y-6">
            {/* Avatar */}
            <div className="flex justify-center">
              <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-primary/40 bg-muted shadow-lg shadow-primary/10">
                {viewingUser.image ? (
                  <img
                    src={viewingUser.image}
                    alt={viewingUser.userName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 text-3xl font-bold text-primary">
                    {viewingUser.userName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">Username</label>
                <div className="mt-0.5 font-medium">{viewingUser.userName}</div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">Email</label>
                <div className="mt-0.5 font-medium">{viewingUser.email}</div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">Role</label>
                <div className="mt-0.5">
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    viewingUser.role === "admin"
                      ? "bg-amber-500/15 text-amber-600"
                      : "bg-blue-500/15 text-blue-600"
                  }`}>
                    {viewingUser.role}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">Country</label>
                <div className="mt-0.5 font-medium">{viewingUser.country || "—"}</div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">Gender</label>
                <div className="mt-0.5 font-medium capitalize">{viewingUser.gender}</div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">Phone</label>
                <div className="mt-0.5 font-medium">{viewingUser.phoneNumber || "—"}</div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">Status</label>
                <div className="mt-0.5">
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    viewingUser.isConfirmed
                      ? "bg-emerald-500/15 text-emerald-600"
                      : "bg-orange-500/15 text-orange-600"
                  }`}>
                    {viewingUser.isConfirmed ? "Confirmed" : "Pending"}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">Created</label>
                <div className="mt-0.5 font-medium">{viewingUser.createdAt || "—"}</div>
              </div>
            </div>
          </div>
        ) : null}
      </SharedModal>

      {/* ═══════════════════════════════════════════════
          EDIT USER MODAL
      ═══════════════════════════════════════════════ */}
      <SharedModal
        isOpen={Boolean(editingUser)}
        onClose={handleCloseEditModal}
        title={editingUser ? `Edit ${editingUser.userName}` : "Edit User"}
        onSave={handleSaveUser}
        saveLabel="Save Changes"
        isSaving={isSaving}
      >
        {editingDraft ? (
          <UserForm user={editingDraft} onChange={setEditingDraft} />
        ) : null}
      </SharedModal>

      {/* ═══════════════════════════════════════════════
          DELETE USER MODAL
      ═══════════════════════════════════════════════ */}
      <SharedModal
        isOpen={Boolean(deletingUser)}
        onClose={handleCloseDeleteModal}
        title={deletingUser ? `Delete ${deletingUser.userName}` : "Delete User"}
        onSave={handleConfirmDeleteUser}
        saveLabel="Delete User"
        saveVariant="danger"
        isSaving={isSaving}
      >
        {deletingUser ? (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">
                Are you sure you want to delete <strong>{deletingUser.userName}</strong>?
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                This action cannot be undone. All data associated with this user will be permanently removed.
              </p>
            </div>
          </div>
        ) : null}
      </SharedModal>
    </>
  );
});

export default UserDashboardTableClient;
