// src/lib/utils.js
import { twMerge } from "tailwind-merge"

// Classnames utility function
export function cn(...classes) {
    return classes.filter(Boolean).join(' ');
  }
  
  // Format a date utility function
  export function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  }
  
  // Function to calculate the sum of an array of numbers
  export function sum(numbers) {
    return numbers.reduce((acc, curr) => acc + curr, 0);
  }
  
  // Function to get data from localStorage safely
  export function getFromLocalStorage(key) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }
  