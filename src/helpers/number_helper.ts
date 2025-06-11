export const formatNumber = (value: number | string): string => {
  if (!value) return '';
  
  // Remove any existing commas and convert to string
  const stringValue = value.toString().replace(/,/g, '');
  
  // Check if it's a valid number
  if (isNaN(Number(stringValue))) return stringValue;
  
  // Format with commas
  return Number(stringValue).toLocaleString('en-US');
};

export const parseFormattedNumber = (value: string): number => {
  if (!value) return 0;
  
  // Remove commas and convert to number
  return Number(value.replace(/,/g, ''));
}; 