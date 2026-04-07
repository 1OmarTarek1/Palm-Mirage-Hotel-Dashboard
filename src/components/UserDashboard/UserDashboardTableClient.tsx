"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { BadgeCheck, ShieldCheck, Users, UserRoundCheck } from "lucide-react";
import { toast } from "react-toastify";
import DashboardSectionCard from "@/components/shared/layouts/DashboardSectionCard";
import DynamicTable from "@/components/shared/table/DynamicTable";
import TableOverview from "@/components/shared/table/TableOverview";
import SharedModal from "@/components/shared/modal/SharedModal";
import { userColumns, userFilters } from "@/config/tablePresets/userColumns";
import { createUser, deleteUser, fetchUsers, fetchUsersPage, updateUser } from "@/lib/users";
import { useServerTableData } from "@/hooks/useServerTableData";
import { DASHBOARD_MODAL_EVENTS } from "@/lib/modal-events";
import { queryKeys } from "@/lib/queryKeys";
import { createEmptyUserDraft, type User } from "./data";
import UserForm from "./UserForm";

function UserDashboardTableClient() {
  const queryClient = useQueryClient();
  const {
    setTableQuery,
    pageItems: users,
    overviewItems: allUsers,
    totalEntries: totalUsersCount,
    isLoading,
  } = useServerTableData<User>({
    queryKeyBase: queryKeys.users.all,
    initialPageSize: 8,
    fetchPage: (query) =>
      fetchUsersPage({
        page: query.page,
        limit: query.pageSize,
        search: query.search || undefined,
        role: typeof query.filters.role === "string" ? query.filters.role : undefined,
        gender: typeof query.filters.gender === "string" ? query.filters.gender : undefined,
        sort:
          query.sort?.key === "userName"
            ? query.sort.direction === "asc"
              ? "userName_asc"
              : "userName_desc"
            : undefined,
      }),
    fetchOverview: fetchUsers,
    staleTime: 45_000,
  });
  const [creatingDraft, setCreatingDraft] = useState<User | null>(null);
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const openAddModal = () => {
      setCreatingDraft((current) => current ?? createEmptyUserDraft());
    };

    window.addEventListener(DASHBOARD_MODAL_EVENTS.usersAdd, openAddModal);

    return () => {
      window.removeEventListener(DASHBOARD_MODAL_EVENTS.usersAdd, openAddModal);
    };
  }, []);

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

  const overviewItems = useMemo(() => {
    const totalUsers = totalUsersCount;
    const confirmedUsers = allUsers.filter((user) => user.isConfirmed).length;
    const adminUsers = allUsers.filter((user) => user.role === "admin").length;
    const guestUsers = allUsers.filter((user) => user.role === "user").length;

    return [
      {
        key: "users",
        label: "Users listed",
        value: totalUsers,
        helper: "All visible team members and guests",
        icon: Users,
      },
      {
        key: "confirmed",
        label: "Confirmed accounts",
        value: confirmedUsers,
        helper: "Accounts already verified and usable",
        icon: BadgeCheck,
      },
      {
        key: "admins",
        label: "Admin access",
        value: adminUsers,
        helper: "Users with dashboard management permissions",
        icon: ShieldCheck,
        tone: "secondary" as const,
      },
      {
        key: "guests",
        label: "Standard users",
        value: guestUsers,
        helper: "Non-admin accounts in the current list",
        icon: UserRoundCheck,
        tone: "secondary" as const,
      },
    ];
  }, [allUsers, totalUsersCount]);

  const handleCloseViewModal = () => setViewingUserId(null);
  const handleCloseAddModal = () => {
    setCreatingDraft(null);
  };
  const handleCloseEditModal = () => {
    setEditingUserId(null);
    setEditingDraft(null);
  };
  const handleCloseDeleteModal = () => setDeletingUserId(null);

  const handleConfirmDeleteUser = () => {
    if (!deletingUser) return;

    void (async () => {
      setIsSaving(true);
      try {
        await deleteUser(deletingUser.id);
        await queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
        toast.success("User deleted successfully.");
        handleCloseDeleteModal();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to delete user");
      } finally {
        setIsSaving(false);
      }
    })();
  };

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

  const handleSaveUser = () => {
    if (!editingDraft) return;

    void (async () => {
      setIsSaving(true);
      try {
        await updateUser(editingDraft);
        await queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
        toast.success("User updated successfully.");
        handleCloseEditModal();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to save user");
      } finally {
        setIsSaving(false);
      }
    })();
  };

  const handleCreateUser = () => {
    if (!creatingDraft) return;

    void (async () => {
      setIsSaving(true);
      try {
        await createUser(creatingDraft);
        await queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
        toast.success("User created successfully.");
        handleCloseAddModal();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to create user");
      } finally {
        setIsSaving(false);
      }
    })();
  };

  return (
    <>
      <div className="mb-5 md:mb-6">
        <TableOverview items={overviewItems} isLoading={isLoading} />
      </div>

      <DashboardSectionCard>
        <DynamicTable<User>
          columns={userColumns}
          data={users}
          isLoading={isLoading}
          filtersConfig={userFilters}
          pageSize={8}
          mode="server"
          totalEntries={totalUsersCount}
          onQueryChange={setTableQuery}
          searchPlaceholder="Search users..."
          actions={actions}
        />
      </DashboardSectionCard>

      <SharedModal
        isOpen={Boolean(creatingDraft)}
        onClose={handleCloseAddModal}
        title="Add User"
        onSave={handleCreateUser}
        saveLabel="Create User"
        isSaving={isSaving}
      >
        {creatingDraft ? <UserForm user={creatingDraft} onChange={setCreatingDraft} /> : null}
      </SharedModal>

      <SharedModal
        isOpen={Boolean(viewingUser)}
        onClose={handleCloseViewModal}
        title={viewingUser ? `User: ${viewingUser.userName}` : "User Details"}
      >
        {viewingUser ? (
          <div className="space-y-4">
             <div className="flex justify-center">
                <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-palmPrimary bg-muted flex items-center justify-center text-3xl font-bold">
                   {viewingUser.image ? (
                    <div className="relative h-full w-full">
                      <Image
                        src={viewingUser.image}
                        alt={viewingUser.userName}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                   ) : viewingUser.userName.charAt(0).toUpperCase()}
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Username</label>
                  <div>{viewingUser.userName}</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Email</label>
                  <div>{viewingUser.email}</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Role</label>
                  <div>{viewingUser.role}</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Country</label>
                  <div>{viewingUser.country}</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Gender</label>
                  <div>{viewingUser.gender}</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Status</label>
                  <div>{viewingUser.isConfirmed ? "Confirmed" : "Pending"}</div>
                </div>
             </div>
          </div>
        ) : null}
      </SharedModal>

      <SharedModal
        isOpen={Boolean(editingUser)}
        onClose={handleCloseEditModal}
        title={editingUser ? `Edit ${editingUser.userName}` : "Edit User"}
        onSave={handleSaveUser}
        saveLabel="Save Changes"
        isSaving={isSaving}
      >
        {editingUser && editingDraft ? (
          <UserForm user={editingDraft} isEditing onChange={setEditingDraft} />
        ) : null}
      </SharedModal>

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
          <div className="p-4 text-center">
            Are you sure you want to delete <strong>{deletingUser.userName}</strong>? This action cannot be undone.
          </div>
        ) : null}
      </SharedModal>
    </>
  );
}

export default UserDashboardTableClient;
