export const formatDate = (isoString) => {
  if (!isoString) return "";
  const [datePart] = isoString.split("T");
  const [year, month, day] = datePart.split("-");
  return `${day}-${month}-${year}`;
};