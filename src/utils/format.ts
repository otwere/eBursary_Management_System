
import { format, parseISO } from 'date-fns';

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'KES'
  }).format(amount);
};

export const formatDate = (dateInput: string | Date) => {
  // If input is already a Date object, use it directly
  // If it's a string, parse it to a Date object
  const date = dateInput instanceof Date ? dateInput : parseISO(dateInput);
  return format(date, 'PP');  // 'PP' gives a formatted date like 'Apr 29, 2021'
};
