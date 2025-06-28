import React from "react";
import IconButton from "@mui/material/IconButton";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

const TableRow = ({
  fieldData,
  type,
  handleSort,
  editHandler,
  deleteHander,
  selectedItems,
  handleCheckboxChange,
}) => {
  return (
    <>
      {fieldData.map((item, i) => {
        const uniqueId = `${item.name}-${i}`;
        const handleRowClick = () => {
          handleCheckboxChange(uniqueId);
        };
        return (
          <tr key={uniqueId} onClick={handleRowClick}>
            <td>
              <input
                type="checkbox"
                checked={selectedItems.includes(uniqueId)}
                onChange={() => handleCheckboxChange(uniqueId)}
              />
            </td>
            <td>{i + 1}</td>
            <td>{item.name}</td>
            <td>{item.fieldType}</td>
            <td>
              <IconButton
                onClick={() => handleSort(type, moveItemUp(fieldData, i))}
                aria-label="move up"
              >
                <ArrowCircleUpIcon fontSize="inherit" />
              </IconButton>
              <IconButton
                onClick={() => handleSort(type, moveItemDown(fieldData, i))}
                aria-label="move down"
              >
                <ArrowCircleDownIcon fontSize="inherit" />
              </IconButton>
            </td>
            <td>
              <UncontrolledDropdown>
                <DropdownToggle
                  className="btn-icon-only"
                  href="#pablo"
                  role="button"
                  size="sm"
                  onClick={(e) => e.preventDefault()}
                >
                  <i className="fas fa-ellipsis-v" />
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-arrow" right>
                  <DropdownItem onClick={() => editHandler(item, i)}>
                    Edit
                  </DropdownItem>
                  <DropdownItem
                    style={{ color: "red" }}
                    onClick={() => deleteHander(item, i)}
                  >
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </td>
          </tr>
        );
      })}
    </>
  );
};

const moveItemUp = (data, index) => {
  if (index === 0) return data;
  const newData = [...data];
  [newData[index], newData[index - 1]] = [newData[index - 1], newData[index]];
  return newData;
};

const moveItemDown = (data, index) => {
  if (index === data.length - 1) return data;
  const newData = [...data];
  [newData[index], newData[index + 1]] = [newData[index + 1], newData[index]];
  return newData;
};

export default React.memo(TableRow);
