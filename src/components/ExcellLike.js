import React, { useEffect, useState } from "react";
import _ from "lodash";
import { toast } from "react-toastify";

export default function ExcelLikeTable(props) {
  const [data, setData] = useState([[]]);
  const [fields, setFields] = useState([]);
  const [selectedCell, setSelectedCell] = useState({ row: null, col: null }); // Track selected cell
  const [hoveredCell, setHoveredCell] = useState({ row: null, col: null });

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
      // Pad the row with empty cells if less than desired length
      const desiredLength = 20;
      while (newRow.length < desiredLength) {
        newRow.push(""); // Fill with empty strings
      }

      setData([newRow]);
    }
  }, [props.selected]);

  const handleFieldClick = (item, colIndex, rowIndex) => {
    const matchedField = findFieldDetails(item);

    if (matchedField) {
      console.log("Matched Field:", matchedField);
      setSelectedCell({ row: rowIndex, col: colIndex });
      console.log(item, colIndex);
      const indexOfField = fields.findIndex((field) =>
        _.isEqual(field, matchedField)
      );
      props.handleEyeClick(matchedField, indexOfField);
    } else {
      toast.warning("Selected field not found");
      console.log("No matching field found.");
    }
  };

  const findFieldDetails = (cellValue) => {
    for (const field of fields) {
      // Assume fieldData is the first array you provided
      if (field.fieldType === "formField") {
        if (field.name === cellValue) {
          return field; // Direct match
        }
      } else if (field.fieldType === "questionField") {
        const [start, end] = field.name.split("-");
        const prefix = start.replace(/\d+$/, "");
        const startNum = parseInt(start.match(/\d+/)[0]);
        const endNum = parseInt(end.match(/\d+/)[0]);

        // Generate all names in range
        const generatedQuestions = [];
        for (let i = startNum; i <= endNum; i++) {
          generatedQuestions.push(`${prefix}${i}`);
        }

        if (generatedQuestions.includes(cellValue)) {
          return field; // Found in generated range
        }
      }
    }

    return null; // No match found
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
    <div style={{ overflowX: "auto" }} className="border border-dark border-bottom-0">
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
                    selectedCell.col === index ? "#A0A0A0" : "#E0E0E0",
                  color: selectedCell.col === index ? "white" : "black", // Highlight selected header
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} style={{ height: "45px" }}>
              <th
                style={{
                  width: "50px",
                  minWidth: "50px",
                  maxWidth: "50px",
                  verticalAlign: "middle",
                  textAlign: "center",
                  backgroundColor: "#E0E0E0",
                  color: "black",
                  position: "sticky",
                  left: "0",
                  zIndex: "2",
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
                      selectedCell.row === rowIndex &&
                      selectedCell.col === colIndex
                        ? "#A5D6A7" // Selected
                        : hoveredCell.row === rowIndex &&
                          hoveredCell.col === colIndex
                        ? "#A5D6A7" // Hovered
                        : "#C8E6C9", // Default
                    transition: "background-color 0.2s ease", // Smooth hover transition
                  }}
                  onClick={() => handleFieldClick(cell, colIndex, rowIndex)}
                  onMouseEnter={() =>
                    setHoveredCell({ row: rowIndex, col: colIndex })
                  }
                  onMouseLeave={() => setHoveredCell({ row: -1, col: -1 })}
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
