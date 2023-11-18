import React from "react";
const CardInfo = ({ title, color, content, type }) => {
  return (
    <React.Fragment>
      <div
        style={{
          borderRadius: "8px",
          textAlign: "center",
          background: "#fff",
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          flex: 1,
        }}
      >
        <div
          style={{
            background: "#2462a3",
            color: "#fff",
            padding: "8px 0px",
            borderRadius: "8px 8px 0px 8px",
          }}
        >
          {title}
        </div>
        <div
          style={{
            textAlign: "center",
            padding: type === "text" ? "8px 0px" : "2.3px 0px",
          }}
        >
          {content}
        </div>
      </div>
    </React.Fragment>
  );
};
export default CardInfo;
