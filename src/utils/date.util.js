export const formatDateForSQLite = (date) => {
  if (!date) return null;
  return new Date(date).toISOString();
};

export const parseDateFromSQLite = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr);
};
