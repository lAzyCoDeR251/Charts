import React from "react";

const Rectangle = ({ top, left, width, height, style }) => {
  return (
    <div
      ref={containerRef}
      className="rectangle-overlay"
      style={{
        position: "absolute",
        top,
        left,
        width,
        height,
        backgroundColor: "rgba(80, 178, 154, 0.3)", // Adjust color and transparency
        border: "1px solid blue", // Adjust border style
        ...style,
      }}
    ></div>
  );
};

export default React.memo(Rectangle);
