import React, { useRef, useEffect, useCallback } from "react";

const CanvasComponent = ({
  boundingBoxes,
  chartWidth,
  chartHeight,
  minX,
  maxX,
  minY,
  maxY,
}) => {
  const canvasRef = useRef(null);

  const xToCanvasCoordinate = useCallback(
    (x) => {
      const chartAreaWidth = chartWidth;
      const timeRange = maxX - minX;
      const positionWithinRange = (x - minX) / timeRange;
      return positionWithinRange * chartAreaWidth;
    },
    [chartWidth, minX, maxX]
  );

  const yToCanvasCoordinate = useCallback(
    (y) => {
      const chartAreaHeight = chartHeight;
      const valueRange = maxY - minY;
      const positionWithinRange = (y - minY) / valueRange;
      return (1 - positionWithinRange) * chartAreaHeight;
    },
    [chartHeight, minY, maxY]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw bounding boxes
    boundingBoxes.forEach((box) => {
      console.log("Bounding Box:", box);
      ctx.beginPath();
      ctx.rect(
        xToCanvasCoordinate(box.time_start),
        yToCanvasCoordinate(box.value_start),
        xToCanvasCoordinate(box.time_end) - xToCanvasCoordinate(box.time_start),
        yToCanvasCoordinate(box.value_end) -
          yToCanvasCoordinate(box.value_start)
      );
      ctx.lineWidth = 2;
      ctx.strokeStyle = "red";
      ctx.stroke();
    });
  }, [boundingBoxes, xToCanvasCoordinate, yToCanvasCoordinate]);

  return <canvas ref={canvasRef} width={chartWidth} height={chartHeight} />;
};

export default CanvasComponent;
