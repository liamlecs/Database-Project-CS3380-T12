import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Loader from "./Loader";

// This component will show Loader every time the route changes.
const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Every time the location changes, start by showing the loader.
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // Adjust the duration as needed (500ms in this example)

    // Clear the timer on cleanup
    return () => clearTimeout(timer);
  }, [location]);

  // Render the Loader when loading; otherwise, render the content.
  return <>{loading ? <Loader /> : children}</>;
};

export default PageTransition;
