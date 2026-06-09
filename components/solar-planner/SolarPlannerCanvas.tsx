"use client";

import React, {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Stage, Layer, Rect, Line, Text, Group } from "react-konva";
import Konva from "konva";

// Constants
const GRID_SIZE = 25; // 25px grid spacing (0.5m per grid unit)

export interface PanelData {
  id: string;
  x: number; // center X coordinate
  y: number; // center Y coordinate
  rotation: number; // 0, 90, 180, 270 degrees
  width: number; // custom width in pixels
  height: number; // custom height in pixels
  type: "panel" | "obstacle";
  power?: number; // custom wattage
  tilt?: number; // tilt angle in degrees
}

interface SolarPlannerCanvasProps {
  panels: PanelData[];
  selectedId: string | null;
  onSelectPanel: (id: string | null) => void;
  onUpdatePanel: (id: string, updated: Partial<PanelData>) => void;
  onRotatePanel: (id: string) => void;
  roofWidth: number; // in meters (e.g. 8.0)
  roofHeight: number; // in meters (e.g. 6.0)
  theme: "light" | "dark";
}

export interface SolarPlannerCanvasRef {
  exportLayout: () => void;
}

const SolarPlannerCanvas = forwardRef<
  SolarPlannerCanvasRef,
  SolarPlannerCanvasProps
>(
  (
    {
      panels,
      selectedId,
      onSelectPanel,
      onUpdatePanel,
      onRotatePanel,
      roofWidth,
      roofHeight,
      theme,
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<Konva.Stage>(null);

    const [dimensions, setDimensions] = useState({ width: 380, height: 400 });
    const [scale, setScale] = useState(1);
    const [stagePos, setStagePos] = useState({ x: 0, y: 0 });

    const roofPixelWidth = roofWidth * 50; // 50 pixels per meter
    const roofPixelHeight = roofHeight * 50;

    // Theme color palettes mapped exactly to site variables
    const palette = {
      dark: {
        canvasBg: "#121212",
        gridLine: "#262626", // Faint dark lines
        roofBg: "#181818", // BackgroundDark var
        roofStroke: "#ff8533", // Primary orange
        roofText: "#a3a3a3",
        panelFillStart: "#1d4ed8", // Deep blue
        panelFillEnd: "#0f172a",
        panelStroke: "#475569",
        panelGrid: "#020617",
        panelLabel: "#ffffff",
        selectionOutline: "#ff8533", // Glowing orange
      },
      light: {
        canvasBg: "#eae5dd",
        gridLine: "#d8d1c0", // Faint warm light lines
        roofBg: "#f6f2ed", // BackgroundLight var
        roofStroke: "#3c1100", // Primary deep brown
        roofText: "#5c5043",
        panelFillStart: "#1e3a8a", // Classic blue
        panelFillEnd: "#172554",
        panelStroke: "#64748b",
        panelGrid: "#0f172a",
        panelLabel: "#ffffff",
        selectionOutline: "#3c1100", // Deep brown outline
      },
    }[theme];

    // Update canvas size to match the parent container dynamically
    useEffect(() => {
      if (!containerRef.current) return;

      const updateSize = () => {
        if (containerRef.current) {
          const width = containerRef.current.clientWidth;
          const height = containerRef.current.clientHeight || 400;
          setDimensions({ width, height });
        }
      };

      updateSize();
      window.addEventListener("resize", updateSize);

      let resizeObserver: ResizeObserver | null = null;
      if (typeof window !== "undefined" && window.ResizeObserver) {
        resizeObserver = new window.ResizeObserver(() => {
          updateSize();
        });
        resizeObserver.observe(containerRef.current);
      }

      // Timer fallbacks to ensure correct size after transitions settle
      const timer1 = setTimeout(updateSize, 100);
      const timer2 = setTimeout(updateSize, 350);

      return () => {
        window.removeEventListener("resize", updateSize);
        if (resizeObserver) {
          resizeObserver.disconnect();
        }
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }, []);

    // Center the floor area inside the viewport whenever its dimensions or container size change
    useEffect(() => {
      const { width, height } = dimensions;
      const initialX = (width - roofPixelWidth) / 2;
      const initialY = (height - roofPixelHeight) / 2;
      setStagePos({ x: initialX, y: initialY });
    }, [
      dimensions.width,
      dimensions.height,
      roofWidth,
      roofHeight,
      roofPixelWidth,
      roofPixelHeight,
    ]);

    // Snap position to closest grid line (anchored to top-left edge of the element to support arbitrary sizes)
    const snapPosition = (rawX: number, rawY: number, w: number, h: number) => {
      const topLeftX = rawX - w / 2;
      const topLeftY = rawY - h / 2;
      // Snap to 5px (0.1m) instead of GRID_SIZE (25px) for 0.1m precision placement
      const snappedTLX = Math.round(topLeftX / 5) * 5;
      const snappedTLY = Math.round(topLeftY / 5) * 5;
      return {
        x: snappedTLX + w / 2,
        y: snappedTLY + h / 2,
      };
    };

    // Zoom controls
    const handleZoom = (factor: number) => {
      setScale((prev) => Math.min(Math.max(0.5, prev * factor), 2));
    };

    const resetView = () => {
      setScale(1);
      const { width, height } = dimensions;
      setStagePos({
        x: (width - roofPixelWidth) / 2,
        y: (height - roofPixelHeight) / 2,
      });
    };

    // Expose export functionality to parent
    useImperativeHandle(ref, () => ({
      exportLayout() {
        if (!stageRef.current) return;

        // Temporarily reset position & zoom to fit the exact floor area with padding
        const currentScaleX = stageRef.current.scaleX();
        const currentScaleY = stageRef.current.scaleY();
        const currentX = stageRef.current.x();
        const currentY = stageRef.current.y();

        stageRef.current.scale({ x: 1, y: 1 });
        stageRef.current.position({ x: 0, y: 0 });

        // Deselect panels temporarily for a clean layout shot
        onSelectPanel(null);
        stageRef.current.batchDraw();

        // Capture data URL matching current editable roof area
        const padding = 20;
        const dataURL = stageRef.current.toDataURL({
          x: -padding,
          y: -padding,
          width: roofPixelWidth + padding * 2,
          height: roofPixelHeight + padding * 2,
          pixelRatio: 3,
        });

        // Restore user view state
        stageRef.current.scale({ x: currentScaleX, y: currentScaleY });
        stageRef.current.position({ x: currentX, y: currentY });
        stageRef.current.batchDraw();

        // Download trigger
        const link = document.createElement("a");
        link.download = `solar-roof-layout-${Date.now()}.png`;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
    }));

    // Grid lines generation
    const renderGrid = () => {
      const lines = [];
      const size = 1500;
      const start = -500;
      const end = 1000;

      // Vertical lines
      for (let x = start; x <= end; x += GRID_SIZE) {
        lines.push(
          <Line
            key={`v-${x}`}
            points={[x, start, x, end]}
            stroke={palette.gridLine}
            strokeWidth={1}
            opacity={0.5}
          />,
        );
      }

      // Horizontal lines
      for (let y = start; y <= end; y += GRID_SIZE) {
        lines.push(
          <Line
            key={`h-${y}`}
            points={[start, y, end, y]}
            stroke={palette.gridLine}
            strokeWidth={1}
            opacity={0.5}
          />,
        );
      }

      return lines;
    };

    return (
      <div
        className="relative w-full h-full overflow-hidden select-none transition-colors duration-300"
        style={{ backgroundColor: palette.canvasBg }}
        ref={containerRef}
      >
        {/* Zoom / Viewport HUD overlay */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <button
            onClick={() => handleZoom(1.2)}
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg active:scale-95 transition-all select-none shadow-md border"
            style={{
              backgroundColor: theme === "dark" ? "#1e1e1e" : "#ffffff",
              color: theme === "dark" ? "#f3f4f6" : "#1f2937",
              borderColor: theme === "dark" ? "#2e2e2e" : "#e5e7eb",
            }}
            title="Zoom In"
          >
            ＋
          </button>
          <button
            onClick={() => handleZoom(0.8)}
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg active:scale-95 transition-all select-none shadow-md border"
            style={{
              backgroundColor: theme === "dark" ? "#1e1e1e" : "#ffffff",
              color: theme === "dark" ? "#f3f4f6" : "#1f2937",
              borderColor: theme === "dark" ? "#2e2e2e" : "#e5e7eb",
            }}
            title="Zoom Out"
          >
            －
          </button>
          <button
            onClick={resetView}
            className="px-2 py-1.5 rounded-lg text-xs font-medium active:scale-95 transition-all select-none shadow-md border"
            style={{
              backgroundColor: theme === "dark" ? "#1e1e1e" : "#ffffff",
              color: theme === "dark" ? "#d1d5db" : "#374151",
              borderColor: theme === "dark" ? "#2e2e2e" : "#e5e7eb",
            }}
            title="Reset View"
          >
            Reset
          </button>
        </div>

        {/* Grid Scale HUD indicator */}
        <div
          className="absolute bottom-4 left-4 z-10 pointer-events-none select-none px-3 py-1.5 rounded-lg border text-[10px] font-mono flex flex-col shadow-sm"
          style={{
            backgroundColor: theme === "dark" ? "#181818f0" : "#f6f2edf0",
            borderColor: theme === "dark" ? "#2e2e2e" : "#e3dec9",
            color: theme === "dark" ? "#a3a3a3" : "#5c5043",
          }}
        >
          <span style={{ color: palette.roofStroke }}>
            Scale: 1 Unit = 0.5m (25px)
          </span>
          <span>
            Floor Size: {roofWidth.toFixed(1)}m × {roofHeight.toFixed(1)}m
          </span>
        </div>

        <Stage
          ref={stageRef}
          width={dimensions.width}
          height={dimensions.height}
          x={stagePos.x}
          y={stagePos.y}
          scaleX={scale}
          scaleY={scale}
          draggable
          onDragEnd={(e) => {
            if (e.target === stageRef.current) {
              setStagePos({ x: e.target.x(), y: e.target.y() });
            }
          }}
          onClick={(e) => {
            if (
              e.target === stageRef.current ||
              e.target.name() === "roof-bg" ||
              e.target.name() === "grid-bg"
            ) {
              onSelectPanel(null);
            }
          }}
          onTouchStart={(e) => {
            if (
              e.target === stageRef.current ||
              e.target.name() === "roof-bg" ||
              e.target.name() === "grid-bg"
            ) {
              onSelectPanel(null);
            }
          }}
        >
          <Layer>
            {/* Virtual Grid backdrop */}
            {renderGrid()}

            {/* Roof design boundary box */}
            <Group name="roof-bg">
              <Rect
                x={0}
                y={0}
                width={roofPixelWidth}
                height={roofPixelHeight}
                fill={palette.roofBg}
                stroke={palette.roofStroke}
                strokeWidth={2.5}
                cornerRadius={8}
                shadowColor="#000"
                shadowBlur={16}
                shadowOpacity={theme === "dark" ? 0.5 : 0.15}
                shadowOffset={{ x: 3, y: 3 }}
              />
              <Text
                x={12}
                y={12}
                text={`DESIGNATED ROOF AREA (${roofWidth.toFixed(
                  1,
                )}m × ${roofHeight.toFixed(1)}m)`}
                fontSize={9}
                fontFamily="monospace"
                fontStyle="bold"
                fill={palette.roofText}
                letterSpacing={1.2}
              />
              {/* Subtle Layout Watermark */}
              <Text
                x={roofPixelWidth - 210}
                y={roofPixelHeight - 26}
                width={200}
                text="RADICAL ENGINEERING https://radicalengineering.com.bd"
                fontSize={7.5}
                fontFamily="monospace"
                fontStyle="bold"
                fill={palette.roofText}
                align="right"
                letterSpacing={1}
                opacity={0.45}
              />
            </Group>

            {/* Render Panels and Obstacles */}
            {panels.map((panel, idx) => {
              const isSelected = selectedId === panel.id;
              const { width, type } = panel;

              // Calculate top-down projected height based on tilt angle (cos(theta))
              const tiltAngle = type === "panel" ? (panel.tilt !== undefined ? panel.tilt : 18) : 0;
              const tiltRad = (tiltAngle * Math.PI) / 180;
              const height = panel.height * Math.cos(tiltRad);

              // Generate cell divisions dynamically for panels
              const gridLines = [];
              if (type === "panel") {
                const cols = Math.max(1, Math.round(width / 8.3));
                const rows = Math.max(1, Math.round(height / 10));
                const cellWidth = width / cols;
                const cellHeight = height / rows;

                // Vertical lines
                for (let c = 1; c < cols; c++) {
                  const lineX = -width / 2 + c * cellWidth;
                  gridLines.push(
                    <Line
                      key={`pv-${panel.id}-${c}`}
                      points={[lineX, -height / 2, lineX, height / 2]}
                      stroke={palette.panelGrid}
                      strokeWidth={0.5}
                    />,
                  );
                }
                // Horizontal lines
                for (let r = 1; r < rows; r++) {
                  const lineY = -height / 2 + r * cellHeight;
                  gridLines.push(
                    <Line
                      key={`ph-${panel.id}-${r}`}
                      points={[-width / 2, lineY, width / 2, lineY]}
                      stroke={palette.panelGrid}
                      strokeWidth={0.5}
                    />,
                  );
                }
              }

              return (
                <Group
                  key={panel.id}
                  x={panel.x}
                  y={panel.y}
                  rotation={panel.rotation}
                  draggable
                  onDragStart={() => {
                    onSelectPanel(panel.id);
                  }}
                  onDragMove={(e) => {
                    // Dynamic edge-aware snap
                    const snapped = snapPosition(
                      e.target.x(),
                      e.target.y(),
                      width,
                      height,
                    );
                    onUpdatePanel(panel.id, { x: snapped.x, y: snapped.y });
                  }}
                  onDragEnd={(e) => {
                    const snapped = snapPosition(
                      e.target.x(),
                      e.target.y(),
                      width,
                      height,
                    );
                    onUpdatePanel(panel.id, { x: snapped.x, y: snapped.y });
                    e.target.x(snapped.x);
                    e.target.y(snapped.y);
                  }}
                  onClick={(e) => {
                    e.cancelBubble = true;
                    if (selectedId !== panel.id) {
                      onSelectPanel(panel.id);
                    }
                  }}
                  onTouchEnd={(e) => {
                    e.cancelBubble = true;
                    if (selectedId !== panel.id) {
                      onSelectPanel(panel.id);
                    }
                  }}
                >
                  {/* Selection glow border */}
                  {isSelected && (
                    <Rect
                      x={-width / 2 - 4}
                      y={-height / 2 - 4}
                      width={width + 8}
                      height={height + 8}
                      stroke={
                        type === "obstacle"
                          ? "#ef4444"
                          : palette.selectionOutline
                      }
                      strokeWidth={2}
                      cornerRadius={6}
                      shadowColor={
                        type === "obstacle"
                          ? "#ef4444"
                          : palette.selectionOutline
                      }
                      shadowBlur={10}
                      shadowOpacity={0.8}
                    />
                  )}

                  {/* Main Element Body */}
                  {type === "obstacle" ? (
                    // Obstacle Render
                    <>
                      <Rect
                        x={-width / 2}
                        y={-height / 2}
                        width={width}
                        height={height}
                        fill={theme === "dark" ? "#ef444415" : "#ef444408"}
                        stroke="#ef4444"
                        strokeWidth={1.5}
                        cornerRadius={3}
                        dash={[4, 4]}
                      />
                      {/* Warning diagonals inside obstacle */}
                      <Line
                        points={[
                          -width / 2,
                          -height / 2,
                          width / 2,
                          height / 2,
                        ]}
                        stroke="#ef4444"
                        strokeWidth={1.5}
                        opacity={0.4}
                      />
                      <Line
                        points={[
                          width / 2,
                          -height / 2,
                          -width / 2,
                          height / 2,
                        ]}
                        stroke="#ef4444"
                        strokeWidth={1.5}
                        opacity={0.4}
                      />
                    </>
                  ) : (
                    // Solar Panel Render
                    <>
                      <Rect
                        x={-width / 2}
                        y={-height / 2}
                        width={width}
                        height={height}
                        fillLinearGradientStartPoint={{
                          x: -width / 2,
                          y: -height / 2,
                        }}
                        fillLinearGradientEndPoint={{
                          x: width / 2,
                          y: height / 2,
                        }}
                        fillLinearGradientColorStops={[
                          0,
                          palette.panelFillStart,
                          0.7,
                          palette.panelFillEnd,
                          1,
                          "#020617",
                        ]}
                        stroke={
                          isSelected
                            ? palette.selectionOutline
                            : palette.panelStroke
                        }
                        strokeWidth={1.5}
                        cornerRadius={4}
                        shadowColor="#000"
                        shadowBlur={6}
                        shadowOpacity={0.3}
                        shadowOffset={{ x: 1.5, y: 1.5 }}
                      />
                      {/* Dynamic grid cell lines */}
                      {gridLines}
                      {/* Anti-reflective glare */}
                      <Line
                        points={[
                          -width / 2 + 5,
                          -height / 2 + 5,
                          width / 2 - 5,
                          height / 2 - 5,
                        ]}
                        stroke="#ffffff"
                        strokeWidth={1}
                        opacity={0.05}
                      />
                    </>
                  )}

                  {/* Element Labels */}
                  {type === "obstacle" ? (
                    <Text
                      x={-width / 2}
                      y={-4}
                      width={width}
                      text="OBSTACLE"
                      fontSize={7.5}
                      fontFamily="monospace"
                      fontStyle="bold"
                      align="center"
                      fill="#ef4444"
                    />
                  ) : (
                    <>
                      <Text
                        x={-width / 2 + 4}
                        y={-height / 2 + 6}
                        text={`P${idx + 1}`}
                        fontSize={8}
                        fontFamily="monospace"
                        fontStyle="bold"
                        fill={palette.panelLabel}
                      />
                      {height >= 40 && (
                        <Text
                          x={-width / 2 + 4}
                          y={height / 2 - 12}
                          text={`${panel.power || 400}W`}
                          fontSize={7}
                          fontFamily="monospace"
                          fill="#94a3b8"
                          opacity={0.8}
                        />
                      )}
                    </>
                  )}
                </Group>
              );
            })}
          </Layer>
        </Stage>
      </div>
    );
  },
);

SolarPlannerCanvas.displayName = "SolarPlannerCanvas";

export default SolarPlannerCanvas;
