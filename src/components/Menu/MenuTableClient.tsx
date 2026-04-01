"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import DynamicTable from "@/components/shared/table/DynamicTable";
import SharedModal from "@/components/shared/modal/SharedModal";
import { menuColumns, menuFilters } from "@/config/tablePresets/menuColumns";
import { fetchMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from "@/lib/menu";
import { createEmptyMenuDraft, type MenuItem } from "./data";
import MenuAddForm from "./MenuAddForm";
import MenuEditForm from "./MenuEditForm";
import MenuDetailsView from "./MenuDetailsView";
import MenuDeleteConfirm from "./MenuDeleteConfirm";

interface MenuTableClientProps {
  initialOpenAddModal?: boolean;
}

function MenuTableClient({ initialOpenAddModal = false }: MenuTableClientProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [creatingDraft, setCreatingDraft] = useState<MenuItem | null>(null);
  const [viewingItemId, setViewingItemId] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState<MenuItem | null>(null);
  const hasOpenedInitialModal = useRef(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    let isMounted = true;

    const loadMenu = async () => {
      try {
        setIsLoading(true);
        const data = await fetchMenuItems();
        if (isMounted) {
          setMenuItems(data);
        }
      } catch (error) {
        if (isMounted) {
          toast.error(error instanceof Error ? error.message : "Failed to load menu items");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadMenu();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!initialOpenAddModal || hasOpenedInitialModal.current) return;

    hasOpenedInitialModal.current = true;
    setCreatingDraft(createEmptyMenuDraft());
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

  const viewingItem = useMemo(
    () => menuItems.find((item) => item.id === viewingItemId) ?? null,
    [menuItems, viewingItemId]
  );

  const editingItem = useMemo(
    () => menuItems.find((item) => item.id === editingItemId) ?? null,
    [menuItems, editingItemId]
  );

  const deletingItem = useMemo(
    () => menuItems.find((item) => item.id === deletingItemId) ?? null,
    [menuItems, deletingItemId]
  );

  const handleCloseViewModal = () => setViewingItemId(null);
  const handleCloseAddModal = () => {
    setCreatingDraft(null);
    syncAddModalQueryParam(false);
  };
  const handleCloseEditModal = () => {
    setEditingItemId(null);
    setEditingDraft(null);
  };
  const handleCloseDeleteModal = () => setDeletingItemId(null);

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;

    try {
      setIsSaving(true);
      await deleteMenuItem(deletingItem.id);
      setMenuItems((prev) => prev.filter((item) => item.id !== deletingItem.id));
      toast.success("Item deleted successfully.");
      handleCloseDeleteModal();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete item");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveItem = async () => {
    if (!editingDraft) return;

    try {
      setIsSaving(true);
      const updatedItem = await updateMenuItem(editingDraft);
      setMenuItems((prev) =>
        prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
      );
      toast.success("Item updated successfully.");
      handleCloseEditModal();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update item");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateItem = async () => {
    if (!creatingDraft) return;

    try {
      setIsSaving(true);
      const refreshedMenu = await createMenuItem(creatingDraft);
      setMenuItems(refreshedMenu);
      toast.success("Item created successfully.");
      handleCloseAddModal();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create item");
    } finally {
      setIsSaving(false);
    }
  };

  const actions = [
    {
      key: "view" as const,
      onClick: (item: MenuItem) => setViewingItemId(item.id),
    },
    {
      key: "edit" as const,
      onClick: (item: MenuItem) => {
        setEditingItemId(item.id);
        setEditingDraft(item);
      },
    },
    {
      key: "delete" as const,
      variant: "danger" as const,
      onClick: (item: MenuItem) => setDeletingItemId(item.id),
    },
  ];

  return (
    <>
      <DynamicTable<MenuItem>
        columns={menuColumns}
        data={menuItems}
        isLoading={isLoading}
        filtersConfig={menuFilters}
        pageSize={10}
        searchPlaceholder="Search menu products..."
        actions={actions}
      />

      {/* Add Modal */}
      <SharedModal
        isOpen={Boolean(creatingDraft)}
        onClose={handleCloseAddModal}
        title="Add Menu Product"
        onSave={handleCreateItem}
        saveLabel="Create Product"
        isSaving={isSaving}
      >
        {creatingDraft ? (
          <MenuAddForm
            item={creatingDraft}
            onChange={setCreatingDraft}
          />
        ) : null}
      </SharedModal>

      {/* View Modal */}
      <SharedModal
        isOpen={Boolean(viewingItem)}
        onClose={handleCloseViewModal}
        title={viewingItem ? viewingItem.name : "Product Details"}
      >
        {viewingItem ? <MenuDetailsView item={viewingItem} /> : null}
      </SharedModal>

      {/* Edit Modal */}
      <SharedModal
        isOpen={Boolean(editingItem)}
        onClose={handleCloseEditModal}
        title={editingItem ? `Edit ${editingItem.name}` : "Edit Product"}
        onSave={handleSaveItem}
        saveLabel="Save Changes"
        isSaving={isSaving}
      >
        {editingItem && editingDraft ? (
          <MenuEditForm
            item={editingDraft}
            onChange={setEditingDraft}
          />
        ) : null}
      </SharedModal>

      {/* Delete Modal */}
      <SharedModal
        isOpen={Boolean(deletingItem)}
        onClose={handleCloseDeleteModal}
        title={deletingItem ? `Delete ${deletingItem.name}` : "Delete Product"}
        onSave={handleConfirmDelete}
        saveLabel="Delete Product"
        saveVariant="danger"
        isSaving={isSaving}
      >
        {deletingItem ? <MenuDeleteConfirm item={deletingItem} /> : null}
      </SharedModal>
    </>
  );
}

export default MenuTableClient;
