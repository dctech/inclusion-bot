/**
 * Converts a string to Title case.
 */
export const capitalize = (str: string) => {
  return `${str[0].toUpperCase()}${str.slice(1)}`;
}
