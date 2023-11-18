import { Card, Col, Divider, Row } from "antd";
import { useEffect, useState } from "react";
import "./scanner.scss";
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
  height: "7vw",
  width: "7vw",
  borderRadius: "3px",
  fontFamily: "Arial",
  fontSize: "10px",
  fontWeight: "600",
  lineHeight: "1.5",
  borderRadius: "100%",
  border: "3px solid #fff",
  fontFamily: "auto",
};

const CommentBox = (props) => {
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
    <div
      style={{ top: top, left: left, backgroundColor: color, ...above }}
      className="bounce-comment-box"
    >
      {/* <span style={{ border: "8px solid" + color, ...comment_box, }}></span> */}
      <div style={st_message}>
        <div
          style={{
            height: "3vw",
            color: "#fff",
            textAlign: "center",
            lineHeight: "3vw",
            fontSize: "18px",
          }}
        >
          <span>{title?.toUpperCase()}</span>
        </div>
        <div
          style={{
            width: "100%",
            textAlign: "center",
            height: "3.8vw",
            background: "#fff",
            borderRadius: "0 0 3.1vw 3.1vw",
            fontSize: "14px",
            lineHeight: "1.2vw",
          }}
        >
          {content}
        </div>
        <div
          style={{
            width: "20px",
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderTop: "40px solid " + color,
            margin: "auto",
          }}
        ></div>
      </div>
    </div>
  );
};

export default CommentBox;
