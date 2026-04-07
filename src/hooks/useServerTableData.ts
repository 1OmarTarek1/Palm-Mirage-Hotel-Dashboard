"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { TableQueryState } from "@/components/shared/table/types";

type PageResult<TItem> = {
  items: TItem[];
  pagination?: {
    total?: number;
  };
};

type UseServerTableDataOptions<TItem, TOverview = TItem> = {
  queryKeyBase: readonly unknown[];
  initialPageSize: number;
  fetchPage: (query: TableQueryState<TItem>) => Promise<PageResult<TItem>>;
  fetchOverview?: () => Promise<TOverview[]>;
  staleTime?: number;
  gcTime?: number;
};

export function useServerTableData<TItem, TOverview = TItem>({
  queryKeyBase,
  initialPageSize,
  fetchPage,
  fetchOverview,
  staleTime = 45_000,
  gcTime,
}: UseServerTableDataOptions<TItem, TOverview>) {
  const [tableQuery, setTableQuery] = useState<TableQueryState<TItem>>({
    page: 1,
    pageSize: initialPageSize,
    search: "",
    filters: {},
    sort: null,
  });

  const pageQuery = useQuery({
    queryKey: [...queryKeyBase, "list", tableQuery],
    queryFn: () => fetchPage(tableQuery),
    staleTime,
    ...(typeof gcTime === "number" ? { gcTime } : {}),
  });

  const overviewQuery = useQuery({
    queryKey: [...queryKeyBase, "overview"],
    queryFn: async () => (fetchOverview ? fetchOverview() : ([] as TOverview[])),
    staleTime,
    ...(typeof gcTime === "number" ? { gcTime } : {}),
    enabled: typeof fetchOverview === "function",
  });

  return {
    tableQuery,
    setTableQuery,
    pageItems: pageQuery.data?.items ?? [],
    totalEntries: pageQuery.data?.pagination?.total ?? 0,
    overviewItems: (overviewQuery.data ?? []) as TOverview[],
    isLoading: pageQuery.isLoading,
  };
}
