import React, { useContext, useEffect, useState } from "react";
import _ from "lodash";
import { toast } from "react-toastify";
import DataContext from "store/DataContext";

export default function ExcelLikeTable(props) {
  const [data, setData] = useState([[]]);
  const [fields, setFields] = useState([]);
  const [selectedCell, setSelectedCell] = useState({ row: null, col: null }); // Track selected cell
  const [hoveredCell, setHoveredCell] = useState({ row: null, col: null });
  const [draggedCell, setDraggedCell] = useState({ row: null, col: null });
  const dataCtx = useContext(DataContext);
  useEffect(() => {
    if (Array.isArray(props.selected)) {
      setFields(props.selected);

      const newRow = props.selected.flatMap((item) => {
        switch (item.fieldType) {
          case "formField":
            return [
              {
                cellValue: item.name,
                cellType: item.fieldType,
                selectedField: item,
              },
            ];

          case "questionField":
            const [start, end] = item.name.split("-");
            const prefix = start.replace(/\d+$/, "");
            const startNum = parseInt(start.match(/\d+/)[0]);
            const endNum = parseInt(end.match(/\d+/)[0]);

            const generatedQuestions = [];
            for (let i = startNum; i <= endNum; i++) {
              generatedQuestions.push({
                cellValue: `${prefix}${i}`,
                cellType: item.fieldType,
                selectedField: item,
              });
            }
            return generatedQuestions;

          case "skewField":
            return [
              {
                cellValue: item.name,
                cellType: item.fieldType,
                selectedField: item,
              },
            ];

          default:
            return [
              {
                cellValue: item.name,
                cellType: item.fieldType,
                selectedField: item,
              },
            ];
        }
      });

      // Pad the row with empty cells if less than desired length
      const desiredLength = 20;
      while (newRow.length < desiredLength) {
        newRow.push({ cellValue: "", cellType: "" }); // Empty object for empty cells
      }

      setData([newRow]); // Each row is now an array of cell objects
    }
  }, [props.selected]);
useEffect(() => {
  if (!props.currentSelectedCoordinate) return;

  // Find the matching cell in the data
  data.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (_.isEqual(props.currentSelectedCoordinate, cell.selectedField)) {
        setSelectedCell({ row: rowIndex, col: colIndex });
      }
    });
  });

}, [props.currentSelectedCoordinate, data]);
  const handleFieldClick = (item, colIndex, rowIndex) => {
    const matchedField = findFieldDetailsUsingObj(item.selectedField);
   
    if (matchedField) {
      setSelectedCell({ row: rowIndex, col: colIndex });

      const indexOfField = fields.findIndex((field) =>
        _.isEqual(field, matchedField)
      );
      props.handleEyeClick(matchedField, indexOfField);
    } else {
      toast.warning("Selected field not found");
    }
  };
  const findFieldDetailsUsingObj = (selectedField) => {
    return fields.find((field) => _.isEqual(field, selectedField)) || null;
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
  const handleSingleClick = (item, colIndex, rowIndex) => {
    setSelectedCell({ row: rowIndex, col: colIndex });
    props.handleSingleSelect(item.selectedField)
    // console.log(item, colIndex, rowIndex);
  };
  const handleDragStart = (cell, rowIndex, colIndex) => {
    setDraggedCell({ cell, rowIndex, colIndex });
  };

  const handleDrop = (targetRow, targetCol) => {
    if (draggedCell && data[targetRow][targetCol].cellType === "formField") {
      const newData = [...data];
      // Swap cells
      const temp = newData[targetRow][targetCol];
      newData[targetRow][targetCol] = draggedCell.cell;
      newData[draggedCell.rowIndex][draggedCell.colIndex] = temp;
      console.log(newData);
      const filteredFormfield = newData[0].filter((item) => {
        return item.cellType === "formField";
      });

      const formDetails = filteredFormfield.map((item) => {
        return findFieldDetails(item.cellValue);
      });
      if (formDetails.length > 0) {
        dataCtx.changeIndexTemplate(formDetails, "formField");
      }

      setData(newData);
      setDraggedCell(null);
    }
  };

  const handleDragOver = (e, targetRow, targetCol) => {
    // Allow drop only on formField cells
    if (data[targetRow][targetCol].cellType === "formField") {
      e.preventDefault();
    }
  };
  // Generate Excel-style column headers: A, B, ..., Z, AA, AB, ...
  const columnHeaders =
    data[0]?.map((_, index) => {
      let result = "";
      let n = index;
      while (n >= 0) {
        result = String.fromCharCode((n % 26) + 65) + result;
        n = Math.floor(n / 26) - 1;
      }
      return result;
    }) || [];

  return (
    <div
      style={{ overflowX: "auto" }}
      className="border border-dark border-bottom-0"
    >
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
                  border: selectedCell.col === index ? "2px solid red" : "1px solid #dee2e6", // 🔴 Add red border condition
                  transition: "background-color 0.2s ease, border 0.2s ease",
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
                  draggable
                  onDragStart={() => handleDragStart(cell, rowIndex, colIndex)}
                  onDragOver={(e) => handleDragOver(e, rowIndex, colIndex)}
                  onDrop={() => handleDrop(rowIndex, colIndex)}
                  style={{
                    width: "100px",
                    minWidth: "100px",
                    maxWidth: "100px",
                    height: "40px",
                    padding: "0",
                    boxSizing: "border-box",
                    overflow: "hidden",
                    border:
                      selectedCell.row === rowIndex &&
                      selectedCell.col === colIndex
                        ? "2px solid red"
                        : "1px solid #dee2e6",
                    backgroundColor:
                      selectedCell.row === rowIndex &&
                      selectedCell.col === colIndex
                        ? "#A5D6A7" // Optional: slight background change
                        : hoveredCell.row === rowIndex &&
                          hoveredCell.col === colIndex
                        ? "#A5D6A7"
                        : cell.cellType === "formField"
                        ? "#FFF176"
                        : cell.cellType === "questionField"
                        ? "#FFB74D"
                        : "#C8E6C9",
                    transition: "background-color 0.2s ease",
                    cursor: "grab",
                  }}
                  onDoubleClick={() =>
                    handleFieldClick(cell, colIndex, rowIndex)
                  }
                  onClick={() => handleSingleClick(cell, colIndex, rowIndex)}
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
                    }}
                  >
                    {cell.cellValue}
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
