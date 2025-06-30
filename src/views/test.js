import React from "react";
import Draggable from "react-draggable";

// Parent Modal Component
const CustomDraggableModal = ({ show, onClose, children, size = "md" }) => {
  if (!show) return null;

  const modalSizes = {
    sm: "90%",  // Responsive width
    md: "80%",
    lg: "60%",
  };

  const modalWidth = modalSizes[size] || modalSizes["md"];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "10px",
        boxSizing: "border-box",
      }}
    >
      <Draggable handle=".custom-modal-header" bounds="parent">
        <div
          style={{
            background: "white",
            borderRadius: "8px",
            width: modalWidth,
            maxHeight: "90vh",
            boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            cursor: "default",
            overflow: "hidden",
          }}
        >
          {React.Children.map(children, (child) => {
            if (child.type === CustomDraggableModal.Header) {
              return React.cloneElement(child, { onClose });
            }
            return child;
          })}
        </div>
      </Draggable>
    </div>
  );
};

// Header Subcomponent
CustomDraggableModal.Header = ({ children, onClose }) => (
  <div
    className="custom-modal-header"
    style={{
      padding: "10px",
      backgroundColor: "#007bff",
      color: "white",
      cursor: "move",
      borderTopLeftRadius: "8px",
      borderTopRightRadius: "8px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexShrink: 0, // Prevent shrinking
    }}
  >
    <div style={{ width: "100%" }}>{children}</div>
    <button
      onClick={onClose}
      style={{
        background: "transparent",
        border: "none",
        color: "white",
        fontSize: "20px",
        cursor: "pointer",
      }}
    >
      &times;
    </button>
  </div>
);

// Body Subcomponent
CustomDraggableModal.Body = ({ children }) => (
  <div
    style={{
      flex: 1,              // Take up remaining space
      minHeight: 0,         // Allow shrinking (critical for flexbox scrolling)
      overflowY: "auto",    // Scroll when content overflows
      padding: "20px",
    }}
  >
    {children}
  </div>
);

// Footer Subcomponent
CustomDraggableModal.Footer = ({ children }) => (
  <div
    style={{
      padding: "10px",
      borderTop: "1px solid #dee2e6",
      display: "flex",
      justifyContent: "flex-end",
      borderBottomLeftRadius: "8px",
      borderBottomRightRadius: "8px",
      flexShrink: 0, // Prevent shrinking
    }}
  >
    {children}
  </div>
);

export default CustomDraggableModal;
