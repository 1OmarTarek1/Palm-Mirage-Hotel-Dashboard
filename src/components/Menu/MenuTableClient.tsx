"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CircleDollarSign, CookingPot, Salad, Store } from "lucide-react";
import { toast } from "react-toastify";
import DashboardSectionCard from "@/components/shared/layouts/DashboardSectionCard";
import DynamicTable from "@/components/shared/table/DynamicTable";
import TableOverview from "@/components/shared/table/TableOverview";
import SharedModal from "@/components/shared/modal/SharedModal";
import { menuColumns, menuFilters } from "@/config/tablePresets/menuColumns";
import { fetchMenuItems, fetchMenuItemsPage, createMenuItem, updateMenuItem, deleteMenuItem } from "@/lib/menu";
import { useServerTableData } from "@/hooks/useServerTableData";
import { DASHBOARD_MODAL_EVENTS } from "@/lib/modal-events";
import { queryKeys } from "@/lib/queryKeys";
import { createEmptyMenuDraft, type MenuItem } from "./data";
import MenuAddForm from "./MenuAddForm";
import MenuEditForm from "./MenuEditForm";
import MenuDetailsView from "./MenuDetailsView";
import MenuDeleteConfirm from "./MenuDeleteConfirm";

function MenuTableClient() {
  const queryClient = useQueryClient();
  const {
    setTableQuery,
    pageItems: menuItems,
    overviewItems: allMenuItems,
    totalEntries: totalItemsCount,
    isLoading,
  } = useServerTableData<MenuItem>({
    queryKeyBase: queryKeys.menu.all,
    initialPageSize: 6,
    fetchPage: (query) =>
      fetchMenuItemsPage({
        page: query.page,
        limit: query.pageSize,
        search: query.search || undefined,
        category: typeof query.filters.category === "string" ? query.filters.category : undefined,
        available:
          typeof query.filters.available === "string" ? query.filters.available : undefined,
        sort:
          query.sort?.key === "price"
            ? query.sort.direction === "asc"
              ? "price_asc"
              : "price_desc"
            : query.sort?.key === "name"
              ? query.sort.direction === "asc"
                ? "name_asc"
                : "name_desc"
              : query.sort?.key === "createdAt"
                ? query.sort.direction === "asc"
                  ? "oldest"
                  : "newest"
                : "newest",
      }),
    fetchOverview: fetchMenuItems,
    staleTime: 45_000,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [creatingDraft, setCreatingDraft] = useState<MenuItem | null>(null);
  const [viewingItemId, setViewingItemId] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState<MenuItem | null>(null);

  useEffect(() => {
    const openAddModal = () => {
      setCreatingDraft((current) => current ?? createEmptyMenuDraft());
    };

    window.addEventListener(DASHBOARD_MODAL_EVENTS.menuAdd, openAddModal);

    return () => {
      window.removeEventListener(DASHBOARD_MODAL_EVENTS.menuAdd, openAddModal);
    };
  }, []);

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

  const overviewItems = useMemo(() => {
    const totalItems = totalItemsCount;
    const availableItems = allMenuItems.filter((item) => item.available).length;
    const categories = new Set(allMenuItems.map((item) => item.category)).size;
    const averagePrice = totalItems > 0
      ? Math.round(allMenuItems.reduce((sum, item) => sum + item.price, 0) / totalItems)
      : 0;

    return [
      {
        key: "items",
        label: "Menu products",
        value: totalItems,
        helper: "Items currently visible in the catalog",
        icon: CookingPot,
      },
      {
        key: "available",
        label: "Available now",
        value: availableItems,
        helper: "Items currently ready for ordering",
        icon: Store,
      },
      {
        key: "categories",
        label: "Categories used",
        value: categories,
        helper: "Menu sections currently represented",
        icon: Salad,
        tone: "secondary" as const,
      },
      {
        key: "price",
        label: "Average price",
        value: `$${averagePrice.toLocaleString()}`,
        helper: "Average listed price across menu products",
        icon: CircleDollarSign,
      },
    ];
  }, [allMenuItems, totalItemsCount]);

  const handleCloseViewModal = () => setViewingItemId(null);
  const handleCloseAddModal = () => {
    setCreatingDraft(null);
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
      await queryClient.invalidateQueries({ queryKey: queryKeys.menu.all });
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
      await updateMenuItem(editingDraft);
      await queryClient.invalidateQueries({ queryKey: queryKeys.menu.all });
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
      await createMenuItem(creatingDraft);
      await queryClient.invalidateQueries({ queryKey: queryKeys.menu.all });
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
      <div className="mb-5 md:mb-6">
        <TableOverview items={overviewItems} isLoading={isLoading} />
      </div>

      <DashboardSectionCard>
        <DynamicTable<MenuItem>
          columns={menuColumns}
          data={menuItems}
          isLoading={isLoading}
          filtersConfig={menuFilters}
          pageSize={10}
          mode="server"
          totalEntries={totalItemsCount}
          onQueryChange={setTableQuery}
          searchPlaceholder="Search menu products..."
          actions={actions}
        />
      </DashboardSectionCard>

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
