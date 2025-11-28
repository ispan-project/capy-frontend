export default function useIndex(datalist, page = 1, pagenum = 5) {
  const startIndex = (page - 1) * pagenum + 1;
  return datalist.map((item, i) => ({
    ...item,
    index: startIndex + i,
  }));
}
