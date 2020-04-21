import date from "date-and-time";

export const articleDate = d => {
  const pattern = date.compile("DD MM YY");
  return date.format(new Date(d), pattern);
};

export const adminDate = d => {
  const pattern = date.compile("YY/MM/DD HH:mm");
  return date.format(new Date(d), pattern);
};
