/**
 * Returns the slice of `items` for the given page. Deliberately just
 * plain array slicing done in the browser — the data volumes here
 * (a school project's worth of hospitals/records/searches) are small
 * enough that fetching everything the RLS policies already allow and
 * paging through it client-side is simpler to explain and maintain
 * than a server-side LIMIT/OFFSET query, with no real downside at
 * this scale.
 */
export const PAGE_SIZE = 10

export function paginate(items, page, pageSize = PAGE_SIZE) {
  const start = (page - 1) * pageSize
  return items.slice(start, start + pageSize)
}

export function totalPages(itemCount, pageSize = PAGE_SIZE) {
  return Math.max(1, Math.ceil(itemCount / pageSize))
}
