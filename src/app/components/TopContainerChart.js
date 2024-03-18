import React from "react";

const TopContainerChart = () => {
  return (
    <div>
      <div className="w-full h-10 border border-black p-2 bg-white flex justify-between">
        <div class="">
          <button
            aria-label="Symbol Search"
            id="header-toolbar-symbol-search"
            tabindex="-1"
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

        <div className="">
          <button
            type="button"
            className="button-merBkM5y apply-common-tooltip accessible-merBkM5y"
            tabindex="-1"
            data-tooltip="Take a snapshot"
            aria-label="Take a snapshot"
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
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopContainerChart;
