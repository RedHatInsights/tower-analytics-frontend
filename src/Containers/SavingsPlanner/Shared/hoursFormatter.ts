const formatHours = (n: Number): string => {
  return `${parseInt(n.toFixed(0)).toLocaleString()} hours`; /* $2,500 hours */
};

export default formatHours;
