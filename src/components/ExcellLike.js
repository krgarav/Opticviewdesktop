import React, { useContext, useEffect, useState } from "react";
import _ from "lodash";
import { toast } from "react-toastify";
import DataContext from "store/DataContext";
const identifier = {
  formField: "formFieldWindowParameters",
  skewMarkField: "skewMarksWindowParameters",
};
export default function ExcelLikeTable(props) {
  const [data, setData] = useState([[]]);
  const [fields, setFields] = useState([]);
  const [selectedCell, setSelectedCell] = useState({ row: null, col: null }); // Track selected cell
  const [hoveredCell, setHoveredCell] = useState({ row: null, col: null });
  const [draggedCell, setDraggedCell] = useState({ row: null, col: null });
  const [dottedIndexes, setDottedIndexes] = useState([]);

  const dataCtx = useContext(DataContext);

  // useEffect(() => {
  //   if (!data[0]) return;
    
  //   const firstRowLength = data[0].length;

  //   // setData((prevData) => {
  //   //   const secondRow = prevData[1] || [];

  //   //   // Only update if second row is shorter
  //   //   if (secondRow.length < firstRowLength) {
  //   //     const additionalCells = Array.from(
  //   //       { length: firstRowLength - secondRow.length },
  //   //       () => ({
  //   //         cellValue: "",
  //   //         cellType: "",
  //   //       })
  //   //     );

  //   //     const newSecondRow = [...secondRow, ...additionalCells];

  //   //     const updatedData = [...prevData];
  //   //     updatedData[1] = newSecondRow;

  //   //     return updatedData;
  //   //   }

  //   //   return prevData; // No changes needed
  //   // });
  // }, [data,props.linkField]);
  // console.log(data)

  // useEffect(() => {
  //   if (!props.linkFields || props.linkFields.length === 0) {
  //     setDottedIndexes([]);
  //   }
  // }, [props.linkFields]);

  // useEffect(() => {
  //   if (props?.linkFields?.length > 0) {
  //     const allFieldIndexes = props.linkFields
  //       .map((item) => item.fieldIndexes)
  //       .flat();

  //     setDottedIndexes(allFieldIndexes);

  //     setFields((prevFields) => {
  //       const updatedFields = prevFields.filter(
  //         (field) => field.fieldType !== "formField"
  //       );

  //       const newFormFields = props.linkFields.map((item) => ({
  //         name: item.fieldName,
  //         fieldType: "formField",
  //       }));

  //       const newFields = [...updatedFields, ...newFormFields];

  //       const desiredLength = 20;
  //       const linkedRow = Array(desiredLength).fill({
  //         cellValue: "",
  //         cellType: "",
  //       });

  //       props.linkFields.forEach((item) => {
  //         const indexes = item.fieldIndexes || [];
  //         if (indexes.length === 0) return;

  //         // Calculate center index of span
  //         const centerIndex = indexes[Math.floor(indexes.length / 2)];

  //         indexes.forEach((idx) => {
  //           if (idx === centerIndex) {
  //             // Center cell with label
  //             linkedRow[idx] = {
  //               cellValue: item.fieldName,
  //               cellType: "formField",
  //               selectedField: {
  //                 name: item.fieldName,
  //                 fieldType: "formField",
  //               },
  //               isCenter: true,
  //             };
  //           } else {
  //             // Spanned cells with empty display but marked
  //             linkedRow[idx] = {
  //               cellValue: "",
  //               cellType: "formField",
  //               isSpanned: true,
  //             };
  //           }
  //         });
  //       });

  //       setData((prevData) => {
  //         const firstRow =
  //           prevData[0] ||
  //           Array(desiredLength).fill({ cellValue: "", cellType: "" });
  //         return [firstRow, linkedRow];
  //       });

  //       return newFields;
  //     });
  //   }
  // }, [props.linkFields]);

  // useEffect(() => {
  //   if (Array.isArray(props.selected)) {
  //     setFields(props.selected);

  //     const newRow = props.selected.flatMap((item) => {
  //       switch (item.fieldType) {
  //         case "formField":
  //           return [
  //             {
  //               cellValue: item.name,
  //               cellType: item.fieldType,
  //               selectedField: item,
  //             },
  //           ];

  //         case "questionField":
  //           const [start, end] = item.name.split("-");
  //           const prefix = start.replace(/\d+$/, "");
  //           const startNum = parseInt(start.match(/\d+/)[0]);
  //           const endNum = parseInt(end.match(/\d+/)[0]);

  //           const generatedQuestions = [];
  //           for (let i = startNum; i <= endNum; i++) {
  //             generatedQuestions.push({
  //               cellValue: `${prefix}${i}`,
  //               cellType: item.fieldType,
  //               selectedField: item,
  //             });
  //           }
  //           return generatedQuestions;

  //         case "skewField":
  //           return [
  //             {
  //               cellValue: item.name,
  //               cellType: item.fieldType,
  //               selectedField: item,
  //             },
  //           ];

  //         default:
  //           return [
  //             {
  //               cellValue: item.name,
  //               cellType: item.fieldType,
  //               selectedField: item,
  //             },
  //           ];
  //       }
  //     });

  //     // Pad the row with empty cells if less than desired length
  //     const desiredLength = 20;
  //     while (newRow.length < desiredLength) {
  //       newRow.push({ cellValue: "", cellType: "" }); // Empty object for empty cells
  //     }

  //     setData([newRow]); // Each row is now an array of cell objects
  //   }
  // }, [props.selected, props.linkFields]);
  
  
  useEffect(() => {
  const selectedFields = Array.isArray(props.selected)
    ? props.selected
    : [];

  const linkFields = Array.isArray(props.linkFields)
    ? props.linkFields
    : [];

  const allFields = [...selectedFields];

  // Add form fields from linkFields
  linkFields.forEach((item) => {
    allFields.push({
      name: item.fieldName,
      fieldType: "formField",
    });
  });

  setFields(allFields);

  // Build first row
  const newRow = selectedFields.flatMap((item) => {
    switch (item.fieldType) {
      case "formField":
      case "skewField":
        return [{
          cellValue: item.name,
          cellType: item.fieldType,
          selectedField: item,
        }];
      case "questionField":
        const [start, end] = item.name.split("-");
        const prefix = start.replace(/\d+$/, "");
        const startNum = parseInt(start.match(/\d+/)[0]);
        const endNum = parseInt(end.match(/\d+/)[0]);
        const questions = [];
        for (let i = startNum; i <= endNum; i++) {
          questions.push({
            cellValue: `${prefix}${i}`,
            cellType: item.fieldType,
            selectedField: item,
          });
        }
        return questions;
      default:
        return [{
          cellValue: item.name,
          cellType: item.fieldType,
          selectedField: item,
        }];
    }
  });

  const desiredLength = 20;
  while (newRow.length < desiredLength) {
    newRow.push({ cellValue: "", cellType: "" });
  }

  // Build second row from linkFields
  const linkedRow = Array(desiredLength).fill({
    cellValue: "",
    cellType: "",
  });

  const allFieldIndexes = linkFields.map((item) => item.fieldIndexes).flat();
  setDottedIndexes(allFieldIndexes);

  linkFields.forEach((item) => {
    const indexes = item.fieldIndexes || [];
    const centerIndex = indexes[Math.floor(indexes.length / 2)];

    indexes.forEach((idx) => {
      linkedRow[idx] =
        idx === centerIndex
          ? {
              cellValue: item.fieldName,
              cellType: "formField",
              selectedField: {
                name: item.fieldName,
                fieldType: "formField",
              },
              isCenter: true,
            }
          : {
              cellValue: "",
              cellType: "formField",
              isSpanned: true,
            };
    });
  });

  setData([newRow, linkedRow]);
}, [props.selected, props.linkFields]);

  
  
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
    props.handleSingleSelect(item.selectedField);
  };
  const handleDragStart = (cell, rowIndex, colIndex) => {
    setDraggedCell({ cell, rowIndex, colIndex });
  };

  const handleDrop = (targetRow, targetCol) => {
    // Prevent drop into dotted or selected cells
    if (
      dottedIndexes.includes(targetCol) ||
      (selectedCell.row === targetRow && selectedCell.col === targetCol)
    ) {
      return; // Do nothing
    }

    if (draggedCell && data[targetRow][targetCol].cellType === "formField") {
      const newData = [...data];
      // Swap cells
      const temp = newData[targetRow][targetCol];
      newData[targetRow][targetCol] = draggedCell.cell;
      newData[draggedCell.rowIndex][draggedCell.colIndex] = temp;

      const filteredFormfield = newData[0].filter(
        (item) => item.cellType === "formField"
      );

      const formDetails = filteredFormfield.map((item) =>
        findFieldDetails(item.cellValue)
      );
      if (formDetails.length > 0) {
        dataCtx.changeIndexTemplate(formDetails, "formField");
      }

      setData(newData);
      setDraggedCell(null);
    }
  };

  const handleDragOver = (e, targetRow, targetCol) => {
    // Disallow drop if cell is in dotted indexes or is the selected cell
    if (
      dottedIndexes.includes(targetCol) ||
      (selectedCell.row === targetRow && selectedCell.col === targetCol)
    ) {
      return; // Don't allow drop
    }

    if (data[targetRow][targetCol].cellType === "formField") {
      e.preventDefault(); // Allow drop
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
  console.log(data);
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
                  border:
                    selectedCell.col === index
                      ? "2px solid red"
                      : "1px solid #dee2e6", // 🔴 Add red border condition
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
              {row.map((cell, colIndex) => {
                // Skip cells marked as spanned but not the center
                if (cell.isSpanned && !cell.isCenter) {
                  return null;
                }

                const colSpan = cell.isCenter
                  ? props.linkFields.find(
                      (f) =>
                        f.fieldName === cell.cellValue &&
                        f.fieldIndexes.includes(colIndex)
                    )?.fieldIndexes.length || 1
                  : 1;

                return (
                  <td
                    key={colIndex}
                    colSpan={colSpan}
                    draggable={
                      !(
                        dottedIndexes.includes(colIndex) ||
                        (selectedCell.row === rowIndex &&
                          selectedCell.col === colIndex)
                      )
                    }
                    onDragStart={() =>
                      handleDragStart(cell, rowIndex, colIndex)
                    }
                    onDragOver={(e) => handleDragOver(e, rowIndex, colIndex)}
                    onDrop={() => handleDrop(rowIndex, colIndex)}
                    style={{
                      width: `${100 * colSpan}px`,
                      minWidth: `${100 * colSpan}px`,
                      maxWidth: `${100 * colSpan}px`,
                      height: "40px",
                      padding: "0",
                      boxSizing: "border-box",
                      overflow: "hidden",
                      border:
                        selectedCell.row === rowIndex &&
                        selectedCell.col === colIndex
                          ? "2px solid red"
                          : dottedIndexes.includes(colIndex)
                          ? "2px dotted blue"
                          : "1px solid #dee2e6",
                      backgroundColor:
                        selectedCell.row === rowIndex &&
                        selectedCell.col === colIndex
                          ? "#A5D6A7"
                          : hoveredCell.row === rowIndex &&
                            hoveredCell.col === colIndex
                          ? "#A5D6A7"
                          : cell.cellType === "formField"
                          ? "#FFF176"
                          : cell.cellType === "questionField"
                          ? "#FFB74D"
                          : "#C8E6C9",
                      transition: "background-color 0.2s ease",
                      cursor:
                        dottedIndexes.includes(colIndex) ||
                        (selectedCell.row === rowIndex &&
                          selectedCell.col === colIndex)
                          ? "not-allowed"
                          : "grab",
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
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
