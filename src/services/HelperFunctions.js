const calculateTotalRow = (startRow, endRow, stepInRow) => {
  let totalRow = [];
  if (stepInRow === "") {
    return 0;
  }
  console.log(stepInRow, startRow, endRow);
  for (let i = +startRow; i < +endRow; i += +stepInRow) {
    totalRow.push(i);
  }
  console.log(totalRow);
  return totalRow.length;
};

export { calculateTotalRow };
