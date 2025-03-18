import React, { useEffect, useState } from "react";

import "./Sidebar.css"; // Custom CSS for sidebar styling
import { FiX } from "react-icons/fi";
const SideBar = ({ isOpen, onClose, selectedWindow }) => {
  const [fields, setFields] = useState([]);

  useEffect(() => {
    if (selectedWindow.length > 0) {
      setFields(selectedWindow);
    }
  }, [selectedWindow]);
  const toggleSidebar = () => {
    onClose(!isOpen);
  };

  const allFields = fields.map((field, index) => (
    <li key={index} style={{ display: "flex", gap: "10px", padding: "5px 0" }}>
      <span style={{ color: "#000", fontWeight: "bold" }}>{index + 1})</span>
      <a href="#" style={{ color: "#000", textDecoration: "none" }}>
        {field.name}
      </a>
      <span style={{ color: "#000", textDecoration: "none" }}>
        {field.fieldType}
      </span>
    </li>
  ));
  return (
    <div>
      <div
        className={`sidebar ${isOpen ? "active" : ""}`}
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          color: "#007bff",
        }}
      >
        <span className="close-btn" onClick={toggleSidebar}>
          <FiX size={24} color="#007bff" />
        </span>
        <h4 className="text-center" style={{ color: "#007bff" }}>
          Selected Window List
        </h4>
        <ul className="list-unstyled p-3">{allFields}</ul>
      </div>
    </div>
  );
};

export default SideBar;
