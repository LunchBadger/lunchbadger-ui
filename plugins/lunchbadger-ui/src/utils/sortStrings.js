export default key => (a, b) => {
  var nameA = a[key].toUpperCase();
  var nameB = b[key].toUpperCase();
  if (nameA < nameB) return -1;
  if (nameA > nameB) return 1;
  return 0;
}
