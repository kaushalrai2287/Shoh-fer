"use client";

import React, { useEffect } from "react";

const BootstrapClient = () => {
  useEffect(() => {
    // Dynamically load Bootstrap's JavaScript
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  // Return null because this component is only used for its effect
  return null;
};

export default BootstrapClient;
