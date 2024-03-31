import React, { useEffect, useRef, useState, useContext, memo } from "react";
import { useRouter } from "next/navigation";
import { createChart, CrosshairMode } from "lightweight-charts";
import SearchStocks from "./SearchStocks";
import axios from "axios";
import html2canvas from "html2canvas";
import SelectedResultContext from "./context/Context";
import Rectangle from "./Rectangle";
import Loading from "./loader";
import Clock from "./Clock";
import Output from "./Output";

const LightWeightChart = () => {
  const containerRef = useRef();
  const myRef = useRef(null);
  const [data, setData] = useState(null);
  const [snapshotData, setSnapshotData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null);
  let chart = useRef(null);
  const chartData = useRef([]);
  let candlestickSeries = useRef();
  const { selectedResult } = useContext(SelectedResultContext);
  const now = new Date();
  const router = useRouter();

  const handleRetryClick = () => {
    router.reload();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.request({
          method: "GET",
          // url: `https://yahoo-finance127.p.rapidapi.com/historic/${selectedResult}/1d/2000d`,
          url: `https://yahoo-finance127.p.rapidapi.com/historic/tcs.ns/1d/2000d`,
          headers: {
            "X-RapidAPI-Key":
              "abd9d4cad7mshaf985f2e231dfa0p193642jsn38ce770626fa",
            // "X-RapidAPI-Key": "415347fdacmsh80e2f6b6508f47bp123ba3jsn6db232b7306e",
            // "X-RapidAPI-Key": "abd9d4cad7mshaf985f2e231dfa0p193642jsn38ce770626fa",
            "X-RapidAPI-Host": "yahoo-finance127.p.rapidapi.com",
          },
        });
        setData(response.data);
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setIsLoading(false); // Set loading state to false after fetch (success or error)
      }
    };

    fetchData();
  }, [selectedResult]);

  useEffect(() => {
    if (!data || !containerRef.current) return;

    const chartOptions = {
      layout: {
        textColor: "black",
        background: { type: "solid", color: "white" },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
    };

    // const chart = createChart(containerRef.current, chartOptions);
    chart.current = createChart(containerRef.current, chartOptions);

    candlestickSeries.current = chart.current.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    // Convert fetched data into the format expected by candlestickSeries.setData
    chartData.current = data.timestamp.map((timestamp, index) => ({
      time: new Date(timestamp * 1000).toISOString().split("T")[0],
      open: data.indicators.quote[0].open[index],
      high: data.indicators.quote[0].high[index],
      low: data.indicators.quote[0].low[index],
      close: data.indicators.quote[0].close[index],
    }));

    candlestickSeries.current.setData(chartData.current);

    // Get the bounding box data from your backend
    const bounding_boxes = [
      {
        time_start: "2021-08-16T12:11:35.372233",
        time_end: "2022-04-15T18:17:23.058350",
        value_start: 3324.4993188476565,
        value_end: 3893.1849643554688,
        confidence: 0.57,
        class: "Head and Shoulders",
      },
    ];


    chart.current.timeScale().fitContent();

    return () => {
      chart.current.remove(); // Cleanup chart when component unmounts
    };
  }, [data]);

  const takeSnapshot = () => {
    const chartContainer = containerRef.current; // Get the chart container
    const visibleRange = chart.current.timeScale().getVisibleRange();

    const currentDate = new Date();
    const pastDate = new Date();
    pastDate.setDate(currentDate.getDate() - 349); // Set the date to 349 days ago

    // Use html2canvas to capture the chart container
    html2canvas(chartContainer, {
      useCORS: true, // Adjust if needed for cross-origin resources
      scale: 2, // Increase resolution for clearer snapshots (optional)
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png"); // Specify PNG format

      // Filter chartData to only include data points within the visible range
      const visibleData = chartData.current.filter(
        (dataPoint) =>
          dataPoint.time >= visibleRange.from &&
          dataPoint.time <= visibleRange.to
      );

      // Print the visible data to the console
      // console.log("this is visible data", visibleData);

      const fullData = data.timestamp.map((timestamp, index) => ({
        time: new Date(timestamp * 1000).toISOString().split("T")[0],
        open: data.indicators.quote[0].open[index],
        high: data.indicators.quote[0].high[index],
        low: data.indicators.quote[0].low[index],
        close: data.indicators.quote[0].close[index],
        volume: data.indicators.quote[0].volume[index],
        adj_close: data.indicators.adjclose[0].adjclose[index],
      }));

      // const fullData = data.timestamp
      //   .map((timestamp, index) => ({
      //     time: new Date(timestamp * 1000).toISOString().split("T")[0],
      //     open: data.indicators.quote[0].open[index],
      //     high: data.indicators.quote[0].high[index],
      //     low: data.indicators.quote[0].low[index],
      //     close: data.indicators.quote[0].close[index],
      //     volume: data.indicators.quote[0].volume[index],
      //   }))
      //   .filter((dataPoint) => new Date(dataPoint.time) >= pastDate);
      // console.log("this is full data", fullData);

      // Send image data to the backend as a Data URL using Axios
      axios
        .post(
          "http://127.0.0.1:8000/api/upload",
          // `${window.location.origin}/api/upload`,
          { image: imgData, data: visibleData, fdata: fullData },
          {
            // Log the data before sending the request
            onUploadProgress: (progressEvent) => {
              // console.log("Image Data:", imgData); // Log image data
              // console.log("Visible Data:", visibleData); // Log visible data
            },
          }
        )
        .then((response) => {
          // Handle response from backend
          setSnapshotData(response.data);
          // console.log(response.data);
          console.log("Success");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  };

  const snapshotButton = (
    <div className="flex items-center float-right">
      {snapshotData &&
        snapshotData.bounding_boxes &&
        snapshotData.bounding_boxes.length > 0 && (
          <button
            className="pr-5"
            onClick={() => myRef.current.scrollIntoView({ behavior: "smooth" })}
          >
            Output
          </button>
        )}
      <button
        type="button"
        className="button-merBkM5y apply-common-tooltip accessible-merBkM5y"
        tabIndex="-1"
        data-tooltip="Take a snapshot"
        aria-label="Take a snapshot"
        onClick={takeSnapshot} // Trigger snapshot on click
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

  // const searchStock = (
  //   <div className="hover:rounded-sm hover:bg-slate-200  m-[-4px]">
  //     <button
  //       aria-label="Symbol Search"
  //       id="header-toolbar-symbol-search"
  //       tabIndex="-1"
  //       type="button"
  //       className="flex items-center font-bold px-2 py-1"
  //       data-tooltip="Symbol Search"
  //     >
  //       <span className="icon-GwQQdU8S" role="img">
  //         <svg
  //           xmlns="http://www.w3.org/2000/svg"
  //           viewBox="0 0 18 18"
  //           width="18"
  //           height="18"
  //         >
  //           <path
  //             fill="currentColor"
  //             d="M3.5 8a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM8 2a6 6 0 1 0 3.65 10.76l3.58 3.58 1.06-1.06-3.57-3.57A6 6 0 0 0 8 2Z"
  //           ></path>
  //         </svg>
  //       </span>
  //       <div className="px-2">EURUSD</div>
  //     </button>
  //   </div>
  // );

  return (
    <div className="w-full">
      <div className="w-full h-10 border-[1px] border-black p-2  rounded-sm shadow-lg  bg-white flex justify-between">
        {/* {searchStock} */}
        <SearchStocks />
        {snapshotButton}
      </div>
      <div
        className={`relative w-full bg-white h-[500px] ${
          isLoading || error ? "dimmed" : ""
        }`}
      >
        {isLoading && (
          <div className="loading-container flex flex-col justify-center items-center py-[200px] z-10">
            {/* Display your loading indicator here (e.g., spinner, text) */}
            <div>
              <Loading />
            </div>
            <div>Loading chart data...</div>
          </div>
        )}
        {error && (
          <div className="overlay-content error-container flex flex-col justify-center items-center py-[200px] z-10">
            <div>
              <Loading />
              <p
                className="overlay-content text-blue-500 underline cursor-pointer hover:text-blue-700"
                onClick={handleRetryClick}
              >
                retry
              </p>
            </div>
            <div className="pt-5">
              {/* Display error message here */}
              Error fetching chart data: {error.message}
            </div>
          </div>
        )}
        {data && !isLoading && !error && (
          <div
            ref={containerRef}
            className="w-full"
            style={{ height: "500px" }}
          />
        )}
      </div>
      <div className="w-full h-16 border border-gray-500 mt-1 p-2 rounded-lg shadow-lg shadow-black bg-white flex justify-between items-center">
        <div>
          {snapshotData && (
            <div
              className={`pl-10 font-bold ${
                snapshotData.predicted_stock === "Bullish sentiment"
                  ? "text-green-500"
                  : snapshotData.predicted_stock === "Bearish sentiment"
                  ? "text-red-500"
                  : ""
              }`}
            >
              {" "}
              Based on the analysis of historic data, the market sentiment is:{" "}
              {snapshotData.predicted_stock}
            </div>
          )}
        </div>
        <div>
          <Clock time={now.getTime()} />
        </div>
      </div>
      <div ref={myRef} className="flex flex-col justify-center my-20">
        {snapshotData && (
          <div className="w-5/6 h-4/6 mx-auto my-5">
            <img
              src={`data:image/png;base64,${snapshotData.graph}`}
              alt="graph"
            />
          </div>
        )}
        {snapshotData &&
          snapshotData.bounding_boxes &&
          snapshotData.bounding_boxes.length > 0 && (
            <>
              <div className="w-5/6 h-4/6 mx-auto">
                <img
                  src={`data:image/png;base64,${snapshotData.img}`}
                  alt="Output"
                />
              </div>
              {/* <pre>{JSON.stringify(snapshotData.bounding_boxes, null, 2)}</pre> */}
            </>
          )}
      </div>
    </div>
  );
};

export default memo(LightWeightChart);
