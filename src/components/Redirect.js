import TextLoader from "loaders/TextLoader";
import EditDesignTemplate from "views/simplex/EditDesignTemplate";
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
        <TextLoader message={"Loading Tempate , Please wait..."} /> // Show loader
      ) : (
        <EditDesignTemplate /> // Show main component after 2 seconds
      )}
    </>
  );
};

export default Redirect;
