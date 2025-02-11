export const mergeQuery = (filters: any) => {
  // Get the existing query parameters from the current URL
  const currentQueryParams = new URLSearchParams(window.location.search);

  // Merge the existing query parameters with the new filters
  const mergedQueryParams = new URLSearchParams(currentQueryParams);

  // Add or update filter-related query parameters
  Object.keys(filters).forEach((key) => {
    if (filters[key]) {
      mergedQueryParams.set(key, filters[key]);
    } else {
      mergedQueryParams.delete(key); // If no filter is set, remove it from the query string
    }
  });

  return mergedQueryParams.toString();
};
