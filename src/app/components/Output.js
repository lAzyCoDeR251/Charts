import React, { useEffect, useState } from "react";
import axios from "axios";

const Output = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.post("http://127.0.0.1:8000/api/upload", {});
        setData(result.data);
        console.log(result.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);
   
  return (
    <div>   
      {data && (                  
        <>
          <img src={data.img} alt="Output" />
          <pre>{JSON.stringify(data.bounding_boxes, null, 2)}</pre>
        </>
      )}
    </div>
  );
};

export default Output;
