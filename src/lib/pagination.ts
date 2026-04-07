export type PaginationShape = {
  page?: number;
  limit?: number;
  size?: number;
  total?: number;
  totalItems?: number;
  count?: number;
  totalPages?: number;
  pages?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  pagination?: PaginationShape;
};

export function normalizePagination(payload: PaginationShape | undefined, fallbackPage = 1, fallbackLimit = 10) {
  const source = payload?.pagination ?? payload ?? {};
  const parsedLimit = Number(source.limit ?? source.size ?? fallbackLimit);
  const limit = parsedLimit > 0 ? parsedLimit : fallbackLimit;
  const total = Number(source.total ?? source.totalItems ?? source.count ?? 0);
  const page = Math.max(1, Number(source.page ?? fallbackPage) || fallbackPage);
  const totalPages =
    Number(source.totalPages ?? source.pages) || Math.max(1, Math.ceil(total / limit));

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: Boolean(source.hasNextPage ?? page < totalPages),
    hasPrevPage: Boolean(source.hasPrevPage ?? page > 1),
  };
}

export function clampPage(page: number, totalPages: number) {
  return Math.min(Math.max(1, page), Math.max(1, totalPages));
}

export function getTotalPages(totalEntries: number, pageSize: number, isLoading = false) {
  if (isLoading) return 1;
  return Math.max(1, Math.ceil(totalEntries / pageSize));
}

export function paginateCollection<T>(items: T[], currentPage: number, pageSize: number) {
  const start = (currentPage - 1) * pageSize;
  return items.slice(start, start + pageSize);
}
