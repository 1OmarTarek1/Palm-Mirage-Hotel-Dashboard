import { normalizePagination, type PaginationShape } from "@/lib/pagination";

type FetchAllPaginatedItemsOptions<TResponse, TItem> = {
  pageSize?: number;
  requestPage: (args: { page: number; limit: number }) => Promise<TResponse>;
  extractItems: (response: TResponse) => TItem[];
  extractPagination: (response: TResponse) => PaginationShape | undefined;
};

export async function fetchAllPaginatedItems<TResponse, TItem>({
  pageSize = 100,
  requestPage,
  extractItems,
  extractPagination,
}: FetchAllPaginatedItemsOptions<TResponse, TItem>) {
  const allItems: TItem[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const response = await requestPage({ page, limit: pageSize });
    const items = extractItems(response);
    allItems.push(...items);

    const pagination = normalizePagination(extractPagination(response), page, pageSize);
    totalPages = pagination.totalPages;
    page += 1;
  }

  return allItems;
}
