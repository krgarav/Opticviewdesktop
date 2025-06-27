import TextLoader from "loaders/TextLoader";
import EditDesignTemplate from "views/EditDesignTemplate/EditDesignTemplate";
import React, { useEffect, useState } from "react";

const Redirect = () => {
  const [showApp, setShowApp] = useState(false);
  useEffect(() => {
    // Simulate a 2-second loading delay
    const timer = setTimeout(() => {
      setShowApp(true);
    }, 1500);

    return () => clearTimeout(timer); // Cleanup timeout
  }, []);
  return (
    <>
      {!showApp ? (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            pointerEvents: "auto", // Make the overlay not clickable
          }}
        >
          <TextLoader message={"Loading Tempate , Please wait..."} />
        </div>
      ) : (
        <EditDesignTemplate /> // Show main component after 2 seconds
      )}
    </>
  );
};

export default Redirect;
