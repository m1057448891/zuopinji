export const asset = (p) =>
  p ? import.meta.env.BASE_URL + p.replace(/^\//, '') : p
