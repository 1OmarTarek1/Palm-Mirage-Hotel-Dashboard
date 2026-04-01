"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import DynamicTable from "@/components/shared/table/DynamicTable";
import SharedModal from "@/components/shared/modal/SharedModal";
import { userColumns, userFilters } from "@/config/tablePresets/userColumns";
import { createUser, deleteUser, fetchUsers, updateUser } from "@/lib/users";
import { createEmptyUserDraft, type User } from "./data";
import UserForm from "./UserForm";

interface UserDashboardTableClientProps {
  initialOpenAddModal?: boolean;
}

function UserDashboardTableClient({ initialOpenAddModal = false }: UserDashboardTableClientProps) {
  const [users, setUsers] = React.useState<User[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [creatingDraft, setCreatingDraft] = useState<User | null>(null);
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const hasOpenedInitialModal = useRef(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
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

  useEffect(() => {
    if (!initialOpenAddModal || hasOpenedInitialModal.current) return;

    hasOpenedInitialModal.current = true;
    setCreatingDraft(createEmptyUserDraft());
  }, [initialOpenAddModal]);

  const syncAddModalQueryParam = (isOpen: boolean) => {
    const params = new URLSearchParams(searchParams.toString());

    if (isOpen) {
      params.set("modal", "add");
    } else if (params.get("modal") === "add") {
      params.delete("modal");
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

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

  const handleCloseViewModal = () => setViewingUserId(null);
  const handleCloseAddModal = () => {
    setCreatingDraft(null);
    syncAddModalQueryParam(false);
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

  const handleCreateUser = () => {
    if (!creatingDraft) return;

    void (async () => {
      setIsSaving(true);
      try {
        const refreshedUsers = await createUser(creatingDraft);
        setUsers(refreshedUsers);
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
      <DynamicTable<User>
        columns={userColumns}
        data={users}
        isLoading={isLoading}
        filtersConfig={userFilters}
        pageSize={5}
        searchPlaceholder="Search users..."
        actions={actions}
      />

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
