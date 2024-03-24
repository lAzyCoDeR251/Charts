"use client";
import React, { useState } from "react";
import LightWeightChart from "./components/LightWeightChart";
import SelectedResultContext from "./components/context/Context";

export default function Home() {
  const [selectedResult, setSelectedResult] = useState(null);
  const container = React.useRef();
  return (
    <SelectedResultContext.Provider
      value={{ selectedResult, setSelectedResult }}
    >
      <div ref={container}>
        <LightWeightChart />
      </div>
    </SelectedResultContext.Provider>
  );
}
