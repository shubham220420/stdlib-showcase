import React, { useState } from "react";
import Title from "./components/Title";
import Visualizer from "./components/Visualizer";

function App() {
  const [activeView, setActiveView] = useState("visualizer");

  return (
    <>
      <Title activeView={activeView} setActiveView={setActiveView} />
      <Visualizer activeView={activeView} />
    </>
  );
}

export default App;
