import React, { useEffect, useState } from "react";

export default function ExcelLikeTable(props) {
  const [data, setData] = useState([[]]);
  const [fields, setFields] = useState([]);
  const [selectedCell, setSelectedCell] = useState({ row: null, col: null }); // Track selected cell

  useEffect(() => {
    if (Array.isArray(props.selected)) {
      setFields(props.selected);

      // Dynamically build the row
      const newRow = props.selected.flatMap((item) => {
        switch (item.fieldType) {
          case "formField":
            return item.name;

          case "questionField":
            // Example: "q1-q5" should generate ["q1", "q2", "q3", "q4", "q5"]
            const [start, end] = item.name.split("-");
            const prefix = start.replace(/\d+$/, "");
            const startNum = parseInt(start.match(/\d+/)[0]);
            const endNum = parseInt(end.match(/\d+/)[0]);

            const generatedQuestions = [];
            for (let i = startNum; i <= endNum; i++) {
              generatedQuestions.push(`${prefix}${i}`);
            }
            return generatedQuestions;

          case "skewField":
            return item.name;

          default:
            return item.name;
        }
      });

      setData([newRow]);
    }
  }, [props.selected]);

  const handleFieldClick = (item, colIndex, rowIndex) => {
    setSelectedCell({ row: rowIndex, col: colIndex });
    console.log(item, colIndex);
    const currentItem = props.selected[colIndex]
    // console.log(currentItem,colIndex)
     props.handleEyeClick(currentItem,colIndex);
  };

  // Generate Excel-style column headers: A, B, ..., Z, AA, AB, ...
  const columnHeaders = data[0].map((_, index) => {
    let result = "";
    let n = index;
    while (n >= 0) {
      result = String.fromCharCode((n % 26) + 65) + result;
      n = Math.floor(n / 26) - 1;
    }
    return result;
  });

  return (
  
      <div style={{ overflowX: "auto" }}>
        <table
          className="table-bordered mb-0 text-center"
          style={{ tableLayout: "fixed", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th style={{ width: "50px", minWidth: "50px" }}></th>
              {columnHeaders.map((header, index) => (
                <th
                  key={index}
                  style={{
                    width: "100px",
                    minWidth: "100px",
                    maxWidth: "100px",
                    textAlign: "center",
                    verticalAlign: "middle",
                    backgroundColor:
                      selectedCell.col === index ? "#D6EAF8" : "", // Highlight selected header
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} style={{ height: "40px" }}>
                <th
                  style={{
                    width: "50px",
                    minWidth: "50px",
                    maxWidth: "50px",
                    verticalAlign: "middle",
                    textAlign: "center",
                  }}
                >
                  {rowIndex + 1}
                </th>
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    style={{
                      width: "100px",
                      minWidth: "100px",
                      maxWidth: "100px",
                      height: "40px",
                      padding: "0",
                      boxSizing: "border-box",
                      overflow: "hidden",
                      backgroundColor:
                        selectedCell.row === rowIndex && selectedCell.col === colIndex
                          ? "#AED6F1" // Highlight selected cell
                          : "",
                    }}
                    onClick={() => handleFieldClick(cell, colIndex, rowIndex)}
                  >
                    <div
                      className="text-center"
                      style={{
                        width: "100%",
                        height: "100%",
                        padding: "4px",
                        boxSizing: "border-box",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      {cell}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
   
  );
}
