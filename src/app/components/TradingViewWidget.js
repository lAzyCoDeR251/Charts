// import React, { useEffect, useRef, memo } from "react";
// import html2canvas from "html2canvas";

// function TradingViewWidget() {
//   const containerRef = useRef();

//   useEffect(() => {
//     const loadTradingViewScript = () => {
//       const script = document.createElement("script");
//       script.src =
//         "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
//       script.type = "text/javascript";
//       script.async = true;
//       script.innerHTML = JSON.stringify({
//         autosize: true,
//         symbol: "NASDAQ:AAPL",
//         interval: "D",
//         timezone: "Etc/UTC",
//         theme: "light",
//         style: "1",
//         locale: "in",
//         allow_symbol_change: true,
//         container_id: "tradingview_33f92",
//         custom_css_url:"global.css",
//         disabled_features:"header_screenshot",
//       });

//       containerRef.current.appendChild(script);
//     };

//     loadTradingViewScript();

//     return () => {
//       containerRef.current.innerHTML = "";
//     };
//   }, []);

//   const handleCustomSnapshot = async () => {
//     try {
//       const chartContainer = document.getElementById("tradingview_33f92");
//       const canvas = await html2canvas(chartContainer);
//       const image = canvas.toDataURL("image/png");

//       const downloadLink = document.createElement("a");
//       downloadLink.href = image;
//       downloadLink.download = "tradingview_snapshot.png";
//       downloadLink.click();
//     } catch (error) {
//       console.error("Error handling snapshot:", error);
//     }
//   };

//   return (
//     <div className="tradingview-widget-container h-[600px]">
//       <div className="h-"></div>
//       <div
//         id="tradingview_33f92"
//         ref={containerRef}
//         style={{ height: "500px", width: "100%" }}
//       ></div>
//       <button onClick={handleCustomSnapshot}>Take Custom Snapshot</button>
//       <div className="group-MBOVGQRI">
//         <button
//           type="button"
//           className="button-merBkM5y apply-common-tooltip accessible-merBkM5y"
//           tabindex="-1"
//           data-tooltip="Take a snapshot"
//           aria-label="Take a snapshot"
//         >
//           <div
//             id="header-toolbar-screenshot"
//             data-role="button"
//             className="iconButton-OhqNVIYA button-GwQQdU8S"
//           >
//             <span className="icon-GwQQdU8S" role="img">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="28"
//                 height="28"
//                 fill="currentColor"
//               >
//                 <path
//                   fill-rule="evenodd"
//                   clip-rule="evenodd"
//                   d="M11.118 6a.5.5 0 0 0-.447.276L9.809 8H5.5A1.5 1.5 0 0 0 4 9.5v10A1.5 1.5 0 0 0 5.5 21h16a1.5 1.5 0 0 0 1.5-1.5v-10A1.5 1.5 0 0 0 21.5 8h-4.309l-.862-1.724A.5.5 0 0 0 15.882 6h-4.764zm-1.342-.17A1.5 1.5 0 0 1 11.118 5h4.764a1.5 1.5 0 0 1 1.342.83L17.809 7H21.5A2.5 2.5 0 0 1 24 9.5v10a2.5 2.5 0 0 1-2.5 2.5h-16A2.5 2.5 0 0 1 3 19.5v-10A2.5 2.5 0 0 1 5.5 7h3.691l.585-1.17z"
//                 ></path>
//                 <path
//                   fill-rule="evenodd"
//                   clip-rule="evenodd"
//                   d="M13.5 18a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm0 1a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9z"
//                 ></path>
//               </svg>
//             </span>
//           </div>
//         </button>
//       </div>
//     </div>
//   );
// }

// export default memo(TradingViewWidget);

import React, { useEffect, useRef, memo } from "react";
import { createChart } from "lightweight-charts";
import axios from "axios";
import html2canvas from "html2canvas";

const TradingViewWidgets = () => {
  const containerRef = useRef();

  useEffect(() => {
    const chartOptions = {
      layout: {
        textColor: "black",
        background: { type: "solid", color: "white" },
      },
    };

    if (!containerRef.current) return; // Ensure container exists

    const chart = createChart(containerRef.current, chartOptions);

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });
    candlestickSeries.setData([
      { time: "2018-12-01", open: 100, high: 110, low: 90, close: 105 }, // Left shoulder
      { time: "2018-12-02", open: 105, high: 115, low: 95, close: 110 },
      { time: "2018-12-03", open: 110, high: 120, low: 100, close: 115 },
      { time: "2018-12-04", open: 115, high: 125, low: 105, close: 120 }, // Head
      { time: "2018-12-05", open: 120, high: 130, low: 110, close: 125 },
      { time: "2018-12-06", open: 125, high: 135, low: 115, close: 130 },
      { time: "2018-12-07", open: 130, high: 140, low: 120, close: 135 },

      { time: "2018-12-08", open: 125, high: 135, low: 115, close: 130 }, // Right shoulder
      { time: "2018-12-09", open: 120, high: 130, low: 130, close: 135 },
      { time: "2018-12-10", open: 115, high: 125, low: 115, close: 130 },
      { time: "2018-12-11", open: 110, high: 120, low: 120, close: 125 },
      { time: "2018-12-12", open: 105, high: 115, low: 145, close: 120 },
      { time: "2018-12-13", open: 100, high: 110, low: 150, close: 115 },

      { time: "2018-12-14", open: 100, high: 110, low: 90, close: 105 }, // Left shoulder
      { time: "2018-12-15", open: 105, high: 115, low: 95, close: 110 },
      { time: "2018-12-16", open: 110, high: 120, low: 100, close: 115 },
      { time: "2018-12-17", open: 115, high: 125, low: 105, close: 120 }, // Head
      { time: "2018-12-18", open: 120, high: 130, low: 110, close: 125 },
      { time: "2018-12-19", open: 125, high: 135, low: 115, close: 130 },
      { time: "2018-12-20", open: 130, high: 140, low: 120, close: 135 },
      { time: "2018-12-21", open: 135, high: 145, low: 125, close: 135 },
      { time: "2018-12-22", open: 140, high: 150, low: 130, close: 140 },

      { time: "2018-12-23", open: 125, high: 135, low: 115, close: 130 }, // Right shoulder
      { time: "2018-12-24", open: 120, high: 130, low: 130, close: 135 },
      { time: "2018-12-25", open: 115, high: 125, low: 115, close: 130 },
      { time: "2018-12-26", open: 110, high: 120, low: 120, close: 125 },
      { time: "2018-12-27", open: 105, high: 115, low: 145, close: 120 },
      { time: "2018-12-28", open: 100, high: 110, low: 150, close: 115 },

      { time: "2018-12-29", open: 100, high: 110, low: 90, close: 105 }, // Left shoulder
      { time: "2018-12-30", open: 105, high: 115, low: 95, close: 110 },
      { time: "2018-12-31", open: 110, high: 120, low: 100, close: 115 },
      { time: "2019-01-01", open: 115, high: 125, low: 105, close: 120 }, // Head
      { time: "2019-01-02", open: 120, high: 130, low: 110, close: 125 },
      { time: "2019-01-03", open: 125, high: 135, low: 115, close: 130 },

   // Right shoulder
      { time: "2019-01-04", open: 120, high: 130, low: 130, close: 135 },
      { time: "2019-01-05", open: 115, high: 125, low: 115, close: 130 },
      { time: "2019-01-06", open: 110, high: 120, low: 120, close: 125 },
      { time: "2019-01-07", open: 105, high: 115, low: 145, close: 120 },
      { time: "2019-01-08", open: 100, high: 110, low: 150, close: 115 },
    
    ]);

    chart.timeScale().fitContent();

    return () => {
      chart.remove(); // Cleanup chart when component unmounts
    };
  }, []);

  // const takeSnapshot = () => {
  //   const chartContainer = containerRef.current; // Get the chart container

  //   // Use html2canvas to capture the chart container
  //   html2canvas(chartContainer, {
  //     useCORS: true, // Adjust if needed for cross-origin resources
  //     scale: 2, // Increase resolution for clearer snapshots (optional)
  //   }).then((canvas) => {
  //     const imgData = canvas.toDataURL(); // Get base64 image data

  //     // Choose your preferred way to handle the snapshot:
  //     // 1. Trigger download as PNG (simple but limited):

  //     const link = document.createElement("a");
  //     link.href = imgData;
  //     link.download = "chart-snapshot.png";
  //     link.click();

  //     // 2. Open preview or send to server for more flexibility:
  //     // const img = document.createElement('img');
  //     // img.src = imgData;
  //     // document.body.appendChild(img); // Preview in a modal or elsewhere

  //     // 3. Generate PDF (requires a server-side solution):
  //     // Send the base64 data to your server, use a library like `pdfmake`
  //     // to generate a PDF, and send the PDF back to the browser for download.
  //   });
  // };
  // Frontend (React)
  // const takeSnapshot = () => {
  //   const chartContainer = containerRef.current; // Get the chart container

  //   // Use html2canvas to capture the chart container
  //   html2canvas(chartContainer, {
  //     useCORS: true, // Adjust if needed for cross-origin resources
  //     scale: 2, // Increase resolution for clearer snapshots (optional)
  //   }).then((canvas) => {
  //     const imgData = canvas.toDataURL();// Get base64 image data
  //     console.log(imgData);

  //     // Send base64 image data to the backend
  //     fetch('/upload', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ image: imgData }),
  //     })
  //       .then(response => response.json())
  //       .then(data => {
  //         // Handle response from backend
  //         console.log(data);
  //         console.log("Success");
  //       })
  //       .catch(error => {
  //         console.error('Error:', error);
  //       });
  //   });
  // };
  const takeSnapshot = () => {
    const chartContainer = containerRef.current; // Get the chart container

    // Use html2canvas to capture the chart container
    html2canvas(chartContainer, {
      useCORS: true, // Adjust if needed for cross-origin resources
      scale: 2, // Increase resolution for clearer snapshots (optional)
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png"); // Specify PNG format

      // Send image data to the backend as a Data URL using Axios
      axios
        .post("http://127.0.0.1:8000/api/upload", { image: imgData })
        .then((response) => {
          // Handle response from backend
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
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M11.118 6a.5.5 0 0 0-.447.276L9.809 8H5.5A1.5 1.5 0 0 0 4 9.5v10A1.5 1.5 0 0 0 5.5 21h16a1.5 1.5 0 0 0 1.5-1.5v-10A1.5 1.5 0 0 0 21.5 8h-4.309l-.862-1.724A.5.5 0 0 0 15.882 6h-4.764zm-1.342-.17A1.5 1.5 0 0 1 11.118 5h4.764a1.5 1.5 0 0 1 1.342.83L17.809 7H21.5A2.5 2.5 0 0 1 24 9.5v10a2.5 2.5 0 0 1-2.5 2.5h-16A2.5 2.5 0 0 1 3 19.5v-10A2.5 2.5 0 0 1 5.5 7h3.691l.585-1.17z"
              ></path>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M13.5 18a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm0 1a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9z"
              ></path>
            </svg>
          </span>
        </div>
        {/* Your existing button content */}
      </button>
    </div>
  );

  const searchStock = (
    <div className="">
      <button
        aria-label="Symbol Search"
        id="header-toolbar-symbol-search"
        tabIndex="-1"
        type="button"
        className="flex items-center font-bold px-2"
        data-tooltip="Symbol Search"
      >
        <span class="icon-GwQQdU8S" role="img">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 18 18"
            width="18"
            height="18"
          >
            <path
              fill="currentColor"
              d="M3.5 8a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM8 2a6 6 0 1 0 3.65 10.76l3.58 3.58 1.06-1.06-3.57-3.57A6 6 0 0 0 8 2Z"
            ></path>
          </svg>
        </span>
        <div className="px-2">EURUSD</div>
      </button>
      {/* <button
      aria-label="Compare or Add Symbol"
      id="header-toolbar-compare"
      tabindex="-1"
      type="button"
      class="button-OhqNVIYA button-ptpAHg8E withoutText-ptpAHg8E button-GwQQdU8S apply-common-tooltip isInteractive-GwQQdU8S accessible-GwQQdU8S"
      data-tooltip="Compare or Add Symbol"
    >
      <span class="icon-GwQQdU8S" role="img">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 28 28"
          width="28"
          height="28"
        >
          <path
            fill="currentColor"
            d="M13.5 6a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM4 14.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z"
          ></path>
          <path
            fill="currentColor"
            d="M9 14h4v-4h1v4h4v1h-4v4h-1v-4H9v-1z"
          ></path>
        </svg>
      </span>
    </button> */}
    </div>
  );

  return (
    <div className="w-full">
      <div className="w-full h-10 border border-black p-2 bg-white flex justify-between">
        {searchStock}
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

export default memo(TradingViewWidgets);
