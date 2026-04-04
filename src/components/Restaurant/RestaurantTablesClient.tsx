"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import DashboardSectionCard from "@/components/shared/layouts/DashboardSectionCard";
import DynamicTable from "@/components/shared/table/DynamicTable";
import SharedModal from "@/components/shared/modal/SharedModal";
import {
  restaurantTableColumns,
  restaurantTableFilters,
} from "@/config/tablePresets/restaurantTableColumns";
import { DASHBOARD_MODAL_EVENTS } from "@/lib/modal-events";
import {
  createRestaurantTable,
  deleteRestaurantTable,
  fetchRestaurantTables,
  updateRestaurantTable,
} from "@/lib/restaurant";

import RestaurantDeleteConfirm from "./RestaurantDeleteConfirm";
import RestaurantOverview from "./RestaurantOverview";
import RestaurantTableForm from "./RestaurantTableForm";
import {
  createEmptyRestaurantTableDraft,
  type RestaurantTable,
  type RestaurantTableDraft,
} from "./data";

export default function RestaurantTablesClient() {
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [creatingDraft, setCreatingDraft] = useState<RestaurantTableDraft | null>(null);
  const [editingTableNumber, setEditingTableNumber] = useState<number | null>(null);
  const [editingDraft, setEditingDraft] = useState<RestaurantTableDraft | null>(null);
  const [deletingTableNumber, setDeletingTableNumber] = useState<number | null>(null);

  const loadTables = async () => {
    try {
      setIsLoading(true);
      const data = await fetchRestaurantTables();
      setTables(data.sort((a, b) => a.number - b.number));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load restaurant tables");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadTables();
  }, []);

  useEffect(() => {
    const openAddModal = () => {
      const nextNumber =
        tables.length > 0 ? Math.max(...tables.map((table) => table.number)) + 1 : 1;
      setCreatingDraft((current) => current ?? createEmptyRestaurantTableDraft(nextNumber));
    };

    window.addEventListener(DASHBOARD_MODAL_EVENTS.restaurantTablesAdd, openAddModal);

    return () => {
      window.removeEventListener(DASHBOARD_MODAL_EVENTS.restaurantTablesAdd, openAddModal);
    };
  }, [tables]);

  const deletingTable = useMemo(
    () => tables.find((table) => table.number === deletingTableNumber) ?? null,
    [tables, deletingTableNumber]
  );

  const overview = useMemo(() => {
    const totalTables = tables.length;
    const totalSeats = tables.reduce((sum, table) => sum + table.chairs, 0);
    const largestTableSize = tables.reduce((max, table) => Math.max(max, table.chairs), 0);

    return {
      totalTables,
      totalSeats,
      averageSeats: totalTables > 0 ? (totalSeats / totalTables).toFixed(1) : "0.0",
      largestTableSize,
    };
  }, [tables]);

  const actions = [
    {
      key: "edit" as const,
      onClick: (table: RestaurantTable) => {
        setEditingTableNumber(table.number);
        setEditingDraft({
          number: table.number,
          chairs: table.chairs,
        });
      },
    },
    {
      key: "delete" as const,
      variant: "danger" as const,
      onClick: (table: RestaurantTable) => setDeletingTableNumber(table.number),
    },
  ];

  const handleCloseAddModal = () => setCreatingDraft(null);
  const handleCloseEditModal = () => {
    setEditingTableNumber(null);
    setEditingDraft(null);
  };
  const handleCloseDeleteModal = () => setDeletingTableNumber(null);

  const handleCreateTable = async () => {
    if (!creatingDraft) return;

    try {
      setIsSaving(true);
      const created = await createRestaurantTable(creatingDraft);
      setTables((current) => [...current, created].sort((a, b) => a.number - b.number));
      toast.success("Restaurant table created successfully.");
      handleCloseAddModal();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create table");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveTable = async () => {
    if (!editingDraft || editingTableNumber === null) return;

    try {
      setIsSaving(true);
      const updated = await updateRestaurantTable(editingTableNumber, editingDraft);
      setTables((current) =>
        current
          .map((table) => (table.number === editingTableNumber ? updated : table))
          .sort((a, b) => a.number - b.number)
      );
      toast.success("Restaurant table updated successfully.");
      handleCloseEditModal();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update table");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTable = async () => {
    if (!deletingTable) return;

    try {
      setIsSaving(true);
      await deleteRestaurantTable(deletingTable.number);
      setTables((current) => current.filter((table) => table.number !== deletingTable.number));
      toast.success("Restaurant table deleted successfully.");
      handleCloseDeleteModal();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete table");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <RestaurantOverview
          totalTables={overview.totalTables}
          totalSeats={overview.totalSeats}
          averageSeats={overview.averageSeats}
          largestTableSize={overview.largestTableSize}
          isLoading={isLoading}
        />

        <DashboardSectionCard>
          <DynamicTable<RestaurantTable>
            columns={restaurantTableColumns}
            data={tables}
            isLoading={isLoading}
            filtersConfig={restaurantTableFilters}
            pageSize={8}
            searchPlaceholder="Search restaurant tables..."
            actions={actions}
          />
        </DashboardSectionCard>
      </div>

      <SharedModal
        isOpen={Boolean(creatingDraft)}
        onClose={handleCloseAddModal}
        title="Add Restaurant Table"
        onSave={handleCreateTable}
        saveLabel="Create Table"
        isSaving={isSaving}
      >
        {creatingDraft ? (
          <RestaurantTableForm draft={creatingDraft} onChange={setCreatingDraft} />
        ) : null}
      </SharedModal>

      <SharedModal
        isOpen={Boolean(editingDraft)}
        onClose={handleCloseEditModal}
        title={editingDraft ? `Edit Table #${editingTableNumber}` : "Edit Restaurant Table"}
        onSave={handleSaveTable}
        saveLabel="Save Changes"
        isSaving={isSaving}
      >
        {editingDraft ? (
          <RestaurantTableForm draft={editingDraft} onChange={setEditingDraft} />
        ) : null}
      </SharedModal>

      <SharedModal
        isOpen={Boolean(deletingTable)}
        onClose={handleCloseDeleteModal}
        title={deletingTable ? `Delete Table #${deletingTable.number}` : "Delete Table"}
        onSave={handleDeleteTable}
        saveLabel="Delete Table"
        saveVariant="danger"
        isSaving={isSaving}
      >
        {deletingTable ? <RestaurantDeleteConfirm table={deletingTable} /> : null}
      </SharedModal>
    </>
  );
}
