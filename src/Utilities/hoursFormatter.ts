const hoursFormatter = (n: number): string =>
  n ? `${(+n.toFixed(0)).toLocaleString()} hours` /* 2,500 hours */ : '0 hours';

export default hoursFormatter;
