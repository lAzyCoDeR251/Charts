import React, { useState, useContext } from "react";
import axios from "axios";
import SelectedResultContext from "./context/Context";

const SearchStocks = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { selectedResult, setSelectedResult } = useContext(
    SelectedResultContext
  );

  const fetchSearchResults = async (term) => {
    const options = {
      method: "GET",
      // url: `https://yahoo-finance127.p.rapidapi.com/search/${term}`,
      headers: {
        "X-RapidAPI-Key": "abd9d4cad7mshaf985f2e231dfa0p193642jsn38ce770626fa",
        "X-RapidAPI-Host": "yahoo-finance127.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      setSearchResults(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    fetchSearchResults(e.target.value);
  };

  return (
    <div className="relative hover:rounded-sm hover:bg-slate-200 m-[-4px] mx-2">
      <button
        data-modal-target="default-modal"
        data-modal-toggle="default-modal"
        aria-label="Symbol Search"
        id="header-toolbar-symbol-search"
        tabIndex="-1"
        type="button"
        className="flex items-center font-bold px-2 py-1"
        data-tooltip="Symbol Search"
        onClick={() => setModalOpen(true)}
      >
        <span className="icon-GwQQdU8S" role="img">
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
        <div className="px-2">
          {selectedResult ? selectedResult : <p className=" text-sm">Symbol</p>}
        </div>
      </button>
      {modalOpen && (
        <div
          id="default-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="overflow-y-auto overflow-x-hidden fixed top-10 right-0 left-60 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-2xl max-h-full top-10 md:left-80">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white ">
                  Symbol Search
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-hide="default-modal"
                  onClick={() => setModalOpen(false)}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              <div className="flex items-center px-4">
                <span className="icon-qm7Rg5MB" role="img">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="none"
                  >
                    <path
                      stroke="currentColor"
                      d="M12.4 12.5a7 7 0 1 0-4.9 2 7 7 0 0 0 4.9-2zm0 0l5.101 5"
                    ></path>
                  </svg>
                </span>
                <input
                  type="text"
                  className="border-none outline-none focus:ring-transparent"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex flex-col border-b items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                {searchResults.quotes &&
                  searchResults.quotes.map((result, index) => (
                    // <p key={result.id}>{result.symbol}</p>
                    <p
                      key={`${result.symbol}-${index}`}
                      className="text-xl font-semibold text-gray-900 dark:text-white p-4 md:p-5 border-b rounded-t dark:border-gray-600 cursor-pointer w-full"
                      onClick={() => {
                        setSelectedResult(result.symbol);
                        setModalOpen(false);
                      }}
                    >
                      {result.shortname}
                    </p>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchStocks;
