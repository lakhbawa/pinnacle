export function getPagination(
  request: { page_size?: number; page_token?: string },
  defaultPageSize = 20,
) {
  const pageSize = request.page_size ?? defaultPageSize;
  const currentPage = request.page_token
    ? Math.max(parseInt(request.page_token, 10), 1)
    : 1;

  return {
    pageSize,
    currentPage,
    skip: (currentPage - 1) * pageSize,
  };
}

export function getPaginationMeta(
  totalCount: number,
  pageSize: number,
  currentPage: number,
) {
  const totalPages = Math.ceil(totalCount / pageSize);
  const hasMore = currentPage < totalPages;

  return {
    total_count: totalCount,
    page_size: pageSize,
    current_page: currentPage,
    total_pages: totalPages,
    next_page_token: hasMore ? String(currentPage + 1) : '',
  };
}
