import React from "react";
import Header from "./_components/Header";

function Provider({ children }) {
  return (
    <div className="mt-32">
      <Header />
      {children}
    </div>
  );
}

export default Provider;
