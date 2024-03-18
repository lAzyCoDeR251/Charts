// import React, { useRef, useEffect } from "react";
// import LightweightChart from "lightweight-charts";

// const LightweightChart1 = ({ data }) => {
//     const containerRef = useRef();

//     useEffect(() => {
//       if (!data || !data.length) return;

//       const chart = LightweightChart.createChart(containerRef.current, {
//         layout: {
//           textColor: "black",
//           background: { type: "solid", color: "white" },
//         },
//       });

//       const candlestickSeries = chart.addCandlestickSeries({
//         upColor: "#26a69a",
//         downColor: "#ef5350",
//         borderVisible: false,
//         wickUpColor: "#26a69a",
//         wickDownColor: "#ef5350",
//       });

//       candlestickSeries.setData(data);

//       chart.timeScale().fitContent();
//     }, [data]);

//     return <div ref={containerRef} style={{ width: "100%", height: "600px" }} />;
//   };

// export default LightweightChart1;

import React, { useEffect, useRef, useState, memo } from "react";
import { createChart } from "lightweight-charts";
import axios from "axios";
import html2canvas from "html2canvas";

const LightWeightChart1 = () => {
  const containerRef = useRef();
  const [data, setData] = useState(null);
  let chart = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.request({
          method: "GET",
          url: "https://alpha-vantage.p.rapidapi.com/query",
          params: {
            interval: "5min",
            function: "TIME_SERIES_DAILY_ADJUSTED",
            symbol: "ibm",
            datatype: "json",
            output_size: "full"
          },
          headers: {
            "X-RapidAPI-Key":
              "2c1d93c14dmshcabf7c3bc305e7fp1ba0b4jsn3b1d3df0e4ed",
            "X-RapidAPI-Host": "alpha-vantage.p.rapidapi.com",
          },
        });
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!data || !containerRef.current) return;

    const chartOptions = {
      layout: {
        textColor: "black",
        background: { type: "solid", color: "white" },
      },
    };

    chart.current = createChart(containerRef.current, chartOptions);

    const candlestickSeries = chart.current.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    const timeSeriesData = data["Time Series (5min)"];

    const chartData = Object.keys(timeSeriesData).map((timestamp) => {
      const candle = timeSeriesData[timestamp];
      return {
        time: Math.floor(new Date(timestamp).getTime() / 1000), // convert to Unix timestamp
        open: parseFloat(candle["1. open"]),
        high: parseFloat(candle["2. high"]),
        low: parseFloat(candle["3. low"]),
        close: parseFloat(candle["4. close"]),
      };
    });

    // Sort the chartData array in ascending order by time
    chartData.sort((a, b) => a.time - b.time);
    candlestickSeries.setData(chartData);

    chart.current.timeScale().fitContent();

    return () => {
      chart.current.remove();
    };
  }, [data]);

  const takeSnapshot = () => {
    const chartContainer = containerRef.current;
    html2canvas(chartContainer, {
      useCORS: true,
      scale: 2,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      axios
        .post("http://127.0.0.1:8000/api/upload", { image: imgData })
        .then((response) => {
          console.log(response.data);
          console.log("Success");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  };

  const snapshotButton = (
    <div className="group-MBOVGQRI float-right">
      <button
        type="button"
        className="button-merBkM5y apply-common-tooltip accessible-merBkM5y"
        tabIndex="-1"
        data-tooltip="Take a snapshot"
        aria-label="Take a snapshot"
        onClick={takeSnapshot}
      >
        <div
          id="header-toolbar-screenshot"
          data-role="button"
          className="iconButton-OhqNVIYA button-GwQQdU8S"
        >
          <span className="icon-GwQQdU8S" role="img">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.118 6a.5.5 0 0 0-.447.276L9.809 8H5.5A1.5 1.5 0 0 0 4 9.5v10A1.5 1.5 0 0 0 5.5 21h16a1.5 1.5 0 0 0 1.5-1.5v-10A1.5 1.5 0 0 0 21.5 8h-4.309l-.862-1.724A.5.5 0 0 0 15.882 6h-4.764zm-1.342-.17A1.5 1.5 0 0 1 11.118 5h4.764a1.5 1.5 0 0 1 1.342.83L17.809 7H21.5A2.5 2.5 0 0 1 24 9.5v10a2.5 2.5 0 0 1-2.5 2.5h-16A2.5 2.5 0 0 1 3 19.5v-10A2.5 2.5 0 0 1 5.5 7h3.691l.585-1.17z"
              ></path>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13.5 18a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm0 1a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9z"
              ></path>
            </svg>
          </span>
        </div>
      </button>
    </div>
  );

  return (
    <div className="w-full">
      <div className="w-full h-10 border border-black p-2 bg-white flex justify-between">
        {snapshotButton}
      </div>
      <div className="relative">
        <div
          ref={containerRef}
          className="w-full"
          style={{ height: "500px" }}
        />
      </div>
    </div>
  );
};

export default memo(LightWeightChart1);
