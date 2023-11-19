import { Card, Col, Divider, Row } from "antd";
import { useEffect, useState } from "react";

const above = {
  position: "absolute",
  padding: "5px",
  zIndex: "1000",
  color: "#FFFFF",
  borderRadius: "100%",
};

const comment_box = {
  position: "absolute",
  background: "transparent",
  bottom: "-35px",
  left: "40%",
  borderRightColor: "transparent",
  borderLeftColor: "transparent",
  borderBottomColor: "transparent",
  borderTopWidth: "30px",
};

const st_message = {
  height: "3vw",
  width: "3vw",
  borderRadius: "1px",
  fontFamily: "Arial",
  fontSize: "4px",
  fontWeight: "600",
  lineHeight: "1.5",
  borderRadius: "100%",
  border: "1px solid #fff",
  fontFamily: "auto",
};

const CommentBoxUI = (props) => {
  const {
    title = "",
    content = "",
    type = "",
    top = "",
    left = "",
    onClick = null,
    color = "",
  } = props;
  return (
    <div style={{ top: top, left: left, backgroundColor: color, ...above }}>
      {/* <span style={{ border: "8px solid" + color, ...comment_box, }}></span> */}
      <div style={st_message}>
        <div
          style={{
            height: "2vw",
            color: "#fff",
            textAlign: "center",
            lineHeight: "3vw",
            fontSize: "14px",
            marginBottom: "1vw",
          }}
        >
          <span>{title?.toUpperCase()}</span>
        </div>
        <div
          style={{
            width: "2px",
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderTop: "20px solid " + color,
            margin: "auto",
          }}
        ></div>
      </div>
    </div>
  );
};

export default CommentBoxUI;
