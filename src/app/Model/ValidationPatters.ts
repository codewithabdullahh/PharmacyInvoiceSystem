export const ValidationPatterns = {

  string: /^[a-zA-Z0-9 /().!@#|*$%&-_]*$/,
  numeric: /^-?\d*[.,]?\d{0,2}$/,
  intNumeric: "^[0-9]*$",
  cnicvalidation: /^(\d{13}|\d{5}-\d{7}-\d{1})$/,
  phoneNovalidation: /^(\+92|0)?3[0-9]{9}$/,
  datevalidation: /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-(\d{4})$/,
};
