import React, { useContext, useEffect, useState } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Template from "views/Template";
import DesignTemplate from "views/DesignTemplate/Designtemplate";
import Redirect from "components/Redirect";
import DuplexDesignTemplate from "views/DuplexDesignTemplate/DuplexDesignTemplate";
import Redirect2 from "components/Redirect2";
const useTokenRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const tokenExp = decoded.exp * 1000; // Convert exp from seconds to milliseconds

        // Get the current time in milliseconds
        const currentTime = Date.now();
        if (currentTime >= tokenExp) {
          console.log("Token has expired");
          alert("Session has expired, Please login again.");
          localStorage.clear();
          setTimeout(() => {
            navigate("/auth/login", { replace: true });
          }, 100);
        }
        if (decoded.Role === "Operator") {
          if (location.pathname.includes("operator")) {
            navigate(location.pathname);
          } else {
            navigate("/operator/index", { replace: true });
          }
        } else if (decoded.Role === "Admin") {
          if (location.pathname.includes("admin")) {
            navigate(location.pathname);
          } else {
            navigate("/admin/index", { replace: true });
          }
        } else if (decoded.Role === "Moderator") {
          if (location.pathname.includes("moderator")) {
            navigate(location.pathname);
          } else {
            navigate("/moderator/index", { replace: true });
          }
        }
      } catch (error) {
        console.error("Invalid token:", error);
        navigate("/auth/login", { replace: true });
      }
    } else {
      navigate("/auth/login", { replace: true });
    }
  }, [location.pathname]);
};

const App = () => {

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Prevent Ctrl+R or Ctrl+Shift+R
      if (
        (event.ctrlKey && event.key === "r") ||
        (event.ctrlKey && event.shiftKey && event.key === "R")
      ) {
        event.preventDefault();
        // alert("Refresh is disabled!");
      }
    };

    // Attach event listener to window
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup event listener
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleContextMenu = (event) => {
    event.preventDefault(); // Prevent right-click menu
  };

  return (
    <>
      <div onContextMenu={handleContextMenu}>
        <Routes>
          <Route path="/design-template" element={<DesignTemplate />} />
          <Route
            path="/duplex-design-template"
            element={<DuplexDesignTemplate />}
          />
          <Route
            path="/duplex-edit-design-template"
            element={<DuplexDesignTemplate />}
          />
          <Route path="/edit" element={<Redirect />} />
          <Route path="/edit-duplex" element={<Redirect2 />} />
          <Route path="/" element={<Template />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
