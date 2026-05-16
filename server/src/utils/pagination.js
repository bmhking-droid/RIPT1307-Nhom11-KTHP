const getPagination = (page = 1, limit = 10) => {
  const currentPage = parseInt(page, 10) || 1;
  const itemsPerPage = parseInt(limit, 10) || 10;

  const offset = (currentPage - 1) * itemsPerPage;

  return {
    limit: itemsPerPage,
    offset,
    page: currentPage,
  };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows } = data;
  const currentPage = parseInt(page, 10) || 1;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    totalItems,
    items: rows,
    currentPage,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};

module.exports = {
  getPagination,
  getPagingData,
};
