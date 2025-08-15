import React from "react";
import "./App.css";
import "./assets/scss/themes.scss";
import Route from "./routes";
import useChatRealtime from "./hooks/useChatRealtime";

function App() {
  return (
    <React.Fragment>
      <Route />
    </React.Fragment>
  );
}

export default App;
