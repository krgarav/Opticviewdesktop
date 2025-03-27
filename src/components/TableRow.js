import React, { useContext, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Table,
} from "reactstrap";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import IconButton from "@mui/material/IconButton";

const TableRow = ({ type, fieldData, handleSort = () => {} }) => {
  const [direction, setDirection] = useState(null);
  const [fields, setFields] = useState(fieldData);
  const [animatingIndex, setAnimatingIndex] = useState(null);

  useEffect(() => {
    setFields(fieldData);
  }, [fieldData]);

  useEffect(() => {
    if (typeof handleSort === "function") {
      console.log(fields);
      handleSort(type, fields);
    }
  }, [fields, handleSort]);

  const moveUp = (index) => {
    if (index > 0) {
      setAnimatingIndex(index);
      setDirection("up");
      setTimeout(() => {
        const newFields = [...fields];
        [newFields[index], newFields[index - 1]] = [
          newFields[index - 1],
          newFields[index],
        ];
        setFields(newFields);
        setAnimatingIndex(null);
        setDirection(null);
        resetAnimation();
      }, 300);
    }
  };

  const moveDown = (index) => {
    if (index < fields.length - 1) {
      setAnimatingIndex(index);
      setDirection("down");
      setTimeout(() => {
        const newFields = [...fields];
        [newFields[index], newFields[index + 1]] = [
          newFields[index + 1],
          newFields[index],
        ];
        setFields(newFields);
        setAnimatingIndex(null);
        setDirection(null);
        resetAnimation();
      }, 300);
    }
  };

  const resetAnimation = () => {
    setAnimatingIndex(null);
    setDirection(null);
  };

  return fields?.map((item, i) => {
    const isAnimating = animatingIndex === i;
    const slno = isAnimating ? (direction === "up" ? i + 1 : i - 1) : i + 1;
    let fieldValue = type === "formField" ? "FF" : "QF";
    if (type === "formField") {
      fieldValue = "Fm_F";
    } else if (type === "questionField") {
      fieldValue = "Qn_F";
    } else if (type === "skewField") {
      fieldValue = "Sk_F";
    } else {
      fieldValue = "Id_F";
    }
    return (
      <tr
        key={i}
        style={{
          backgroundColor: isAnimating
            ? direction === "up"
              ? "#f0f0f0"
              : "#d9d9d9"
            : "transparent",
          transition:
            "background-color 0.3s ease-in-out, transform 0.3s ease-in-out",
          transform: isAnimating
            ? direction === "up"
              ? "translateY(-50px)"
              : "translateY(50px)"
            : "none",
        }}
      >
        <td> {fieldValue + slno}</td> {/* Serial number */}
        <td>{item.name}</td>
        <td>{item.fieldType}</td>
        <td>
          <IconButton onClick={() => moveUp(i)} aria-label="move up">
            <ArrowCircleUpIcon fontSize="inherit" />
          </IconButton>
          <IconButton onClick={() => moveDown(i)} aria-label="move down">
            <ArrowCircleDownIcon fontSize="inherit" />
          </IconButton>
        </td>
        <td>
          <UncontrolledDropdown>
            <DropdownToggle
              className="btn-icon-only "
              href="#pablo"
              role="button"
              size="sm"
              onClick={(e) => e.preventDefault()}
            >
              <i className="fas fa-ellipsis-v" />
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-arrow" right>
              <DropdownItem>Edit</DropdownItem>
              <DropdownItem style={{ color: "red" }}>Delete</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </td>
      </tr>
    );
  });
};

export default TableRow;
