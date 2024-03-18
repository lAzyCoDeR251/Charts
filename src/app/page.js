"use client";
import React, { useState } from "react";

// import TradingViewWidget from "./components/TradingViewWidget";
// import LightWeightChart1 from "./components/LightWeightChart1";
import LightWeightChart from "./components/LightWeightChart";
// import TopContainerChart from "./components/TopContainerChart";
// import LightWeightChartAPI from "./apis/api";
import SelectedResultContext from "./components/context/Context";

export default function Home() {
  const [selectedResult, setSelectedResult] = useState(null);
  const container = React.useRef();
  return (
    <SelectedResultContext.Provider
      value={{ selectedResult, setSelectedResult }}
    >
      <div ref={container}>
        {/* <TradingViewWidget /> */}
        <LightWeightChart />
        {/* <TopContainerChart /> */}
        {/* <LightWeightChartAPI /> */}
      </div>
    </SelectedResultContext.Provider>
  );
}
