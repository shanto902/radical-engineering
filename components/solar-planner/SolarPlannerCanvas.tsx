"use client";

import React, {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Stage, Layer, Rect, Line, Text, Group, Circle } from "react-konva";
import Konva from "konva";

// Constants
const GRID_SIZE = 25; // 25px grid spacing (20 inches per grid unit)
const SCALE_FACTOR = 1.25; // 1.25 pixels per inch

function formatInches(inches: number): string {
  const ft = Math.floor(inches / 12);
  const rIn = Math.round(inches % 12);
  if (ft === 0) return `${rIn}"`;
  if (rIn === 0) return `${ft}'`;
  return `${ft}' ${rIn}"`;
}

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

  // Custom Polygon Roof Props
  roofType: "rectangle" | "polygon";
  roofPoints: { x: number; y: number }[];
  onUpdateRoofPoints: (points: { x: number; y: number }[]) => void;
  isDrawingRoof: boolean;
  onAddRoofPoint?: (point: { x: number; y: number }) => void;
  selectedVertexIndex: number | null;
  onSelectVertex: (index: number | null) => void;
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
      roofType,
      roofPoints,
      onUpdateRoofPoints,
      isDrawingRoof,
      onAddRoofPoint,
      selectedVertexIndex,
      onSelectVertex,
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<Konva.Stage>(null);

    const [dimensions, setDimensions] = useState({ width: 380, height: 400 });
    const [scale, setScale] = useState(1);
    const [stagePos, setStagePos] = useState({ x: 0, y: 0 });

    const [drawingCursorPos, setDrawingCursorPos] = useState<{
      x: number;
      y: number;
    } | null>(null);
    const [hoveredVertex, setHoveredVertex] = useState<number | null>(null);
    const [isExporting, setIsExporting] = useState(false);
    const exportStateRef = useRef<{
      currentScaleX: number;
      currentScaleY: number;
      currentX: number;
      currentY: number;
    } | null>(null);

    const roofPixelWidth = roofWidth * SCALE_FACTOR; // SCALE_FACTOR pixels per inch
    const roofPixelHeight = roofHeight * SCALE_FACTOR;

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
      let minX = 0, minY = 0, maxX = roofPixelWidth, maxY = roofPixelHeight;
      if (roofType === "polygon" && roofPoints.length > 0) {
        minX = Math.min(...roofPoints.map((p) => p.x));
        minY = Math.min(...roofPoints.map((p) => p.y));
        maxX = Math.max(...roofPoints.map((p) => p.x));
        maxY = Math.max(...roofPoints.map((p) => p.y));
      }
      const designWidth = maxX - minX;
      const designHeight = maxY - minY;
      const initialX = (width - designWidth) / 2 - minX;
      const initialY = (height - designHeight) / 2 - minY;
      setStagePos({ x: initialX, y: initialY });
    }, [
      dimensions.width,
      dimensions.height,
      roofWidth,
      roofHeight,
      roofPixelWidth,
      roofPixelHeight,
      roofType,
      roofPoints.length,
    ]);

    // Snap position to closest grid line (anchored to top-left edge of the element to support arbitrary sizes)
    const snapPosition = (rawX: number, rawY: number, w: number, h: number) => {
      const topLeftX = rawX - w / 2;
      const topLeftY = rawY - h / 2;
      // Snap to GRID_SIZE for grid-aligned precision placement
      const snappedTLX = Math.round(topLeftX / GRID_SIZE) * GRID_SIZE;
      const snappedTLY = Math.round(topLeftY / GRID_SIZE) * GRID_SIZE;
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
      let minX = 0, minY = 0, maxX = roofPixelWidth, maxY = roofPixelHeight;
      if (roofType === "polygon" && roofPoints.length > 0) {
        minX = Math.min(...roofPoints.map((p) => p.x));
        minY = Math.min(...roofPoints.map((p) => p.y));
        maxX = Math.max(...roofPoints.map((p) => p.x));
        maxY = Math.max(...roofPoints.map((p) => p.y));
      }
      const designWidth = maxX - minX;
      const designHeight = maxY - minY;
      setStagePos({
        x: (width - designWidth) / 2 - minX,
        y: (height - designHeight) / 2 - minY,
      });
    };

    // Expose export functionality to parent
    useImperativeHandle(ref, () => ({
      exportLayout() {
        if (!stageRef.current) return;
        // Save current view state
        exportStateRef.current = {
          currentScaleX: stageRef.current.scaleX(),
          currentScaleY: stageRef.current.scaleY(),
          currentX: stageRef.current.x(),
          currentY: stageRef.current.y(),
        };
        // Trigger export state, which will hide selection indicators and re-render
        setIsExporting(true);
      },
    }));

    useEffect(() => {
      if (isExporting && exportStateRef.current) {
        // Wait for React to render the canvas without selection outlines
        const timer = setTimeout(() => {
          if (!stageRef.current || !exportStateRef.current) {
            setIsExporting(false);
            return;
          }

          const { currentScaleX, currentScaleY, currentX, currentY } = exportStateRef.current;

          // Temporarily reset position & zoom to fit the exact floor area with padding
          stageRef.current.scale({ x: 1, y: 1 });
          stageRef.current.position({ x: 0, y: 0 });
          stageRef.current.draw();

          // Calculate custom bounds for polygon
          let minX = 0, minY = 0, maxX = roofPixelWidth, maxY = roofPixelHeight;
          if (roofType === "polygon" && roofPoints.length > 0) {
            minX = Math.min(...roofPoints.map((p) => p.x));
            minY = Math.min(...roofPoints.map((p) => p.y));
            maxX = Math.max(...roofPoints.map((p) => p.x));
            maxY = Math.max(...roofPoints.map((p) => p.y));
          }

          // Encompass panels and obstacles too in case they extend beyond roof bounds
          if (panels.length > 0) {
            const panelMinX = Math.min(...panels.map((p) => p.x - p.width / 2));
            const panelMinY = Math.min(...panels.map((p) => p.y - p.height / 2));
            const panelMaxX = Math.max(...panels.map((p) => p.x + p.width / 2));
            const panelMaxY = Math.max(...panels.map((p) => p.y + p.height / 2));

            minX = Math.min(minX, panelMinX);
            minY = Math.min(minY, panelMinY);
            maxX = Math.max(maxX, panelMaxX);
            maxY = Math.max(maxY, panelMaxY);
          }

          const width = maxX - minX;
          const height = maxY - minY;

          // Capture data URL matching current editable roof area
          const padding = 50;
          const dataURL = stageRef.current.toDataURL({
            x: minX - padding,
            y: minY - padding,
            width: width + padding * 2,
            height: height + padding * 2,
            pixelRatio: 3,
          });

          // Restore user view state
          stageRef.current.scale({ x: currentScaleX, y: currentScaleY });
          stageRef.current.position({ x: currentX, y: currentY });
          stageRef.current.draw();

          // Download trigger
          const link = document.createElement("a");
          link.download = `solar-roof-layout-${Date.now()}.png`;
          link.href = dataURL;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Reset exporting state to restore selection outlines
          setIsExporting(false);
          exportStateRef.current = null;
        }, 80);
        return () => clearTimeout(timer);
      }
    }, [isExporting, roofType, roofPoints, roofPixelWidth, roofPixelHeight]);

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

    const renderSegmentLabels = () => {
      if (roofType !== "polygon" || roofPoints.length === 0) return null;

      const labels = [];
      const numPoints = roofPoints.length;
      const limit = isDrawingRoof ? numPoints - 1 : numPoints;

      for (let i = 0; i < limit; i++) {
        const p1 = roofPoints[i];
        const p2 = roofPoints[(i + 1) % numPoints];

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const distancePx = Math.sqrt(dx * dx + dy * dy);
        const distanceInches = distancePx / SCALE_FACTOR;

        if (distanceInches < 2) continue;

        const mx = p1.x + dx / 2;
        const my = p1.y + dy / 2;

        const len = distancePx || 1;
        const px = -dy / len;
        const py = dx / len;
        const offsetX = px * 12;
        const offsetY = py * 12;

        const textStr = formatInches(distanceInches);
        const labelWidth = Math.max(32, textStr.length * 6 + 6);

        labels.push(
          <Group key={`segment-label-${i}`} x={mx + offsetX} y={my + offsetY}>
            <Rect
              x={-labelWidth / 2}
              y={-7}
              width={labelWidth}
              height={14}
              fill={theme === "dark" ? "#1e1e1e" : "#ffffff"}
              stroke={palette.roofStroke}
              strokeWidth={0.5}
              cornerRadius={4}
              shadowColor="black"
              shadowBlur={2}
              shadowOpacity={0.15}
              shadowOffset={{ x: 0, y: 1 }}
            />
            <Text
              x={-labelWidth / 2}
              y={-5}
              width={labelWidth}
              text={textStr}
              fontSize={8.5}
              fontFamily="monospace"
              fontStyle="bold"
              fill={theme === "dark" ? "#ffffff" : "#000000"}
              align="center"
            />
          </Group>
        );
      }

      return labels;
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
            Scale: 1 Unit = 1' 8" (25px)
          </span>
          {roofType === "rectangle" ? (
            <span>
              Floor Size: {formatInches(roofWidth)} × {formatInches(roofHeight)}
            </span>
          ) : (
            <span>Polygon Roof (Vertices: {roofPoints.length})</span>
          )}
        </div>

        {/* Instructions overlay for drawing roof */}
        {roofType === "polygon" && isDrawingRoof && (
          <div className="absolute top-4 left-4 z-10 pointer-events-none select-none px-4 py-2.5 rounded-xl border border-primary/20 bg-background/90 backdrop-blur-md text-xs flex flex-col gap-1 shadow-md max-w-xs animate-in fade-in duration-200">
            <span className="font-bold flex items-center gap-1.5 text-primary">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping inline-block" />
              Drawing Custom Roof Area
            </span>
            <span className="text-foreground/75 leading-relaxed text-[11px]">
              Click on the grid to place vertices. Click the first point (green circle) or use the footer controls to close the polygon and finish.
            </span>
          </div>
        )}

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
          onMouseMove={(e) => {
            if (isDrawingRoof) {
              const stage = stageRef.current;
              if (!stage) return;
              const pointer = stage.getPointerPosition();
              if (pointer) {
                const stageX = stage.x();
                const stageY = stage.y();
                const stageScale = stage.scaleX();
                const relativeX = (pointer.x - stageX) / stageScale;
                const relativeY = (pointer.y - stageY) / stageScale;
                const snappedX = Math.round(relativeX / 5) * 5;
                const snappedY = Math.round(relativeY / 5) * 5;
                setDrawingCursorPos({ x: snappedX, y: snappedY });
              }
            } else if (drawingCursorPos) {
              setDrawingCursorPos(null);
            }
          }}
          onMouseLeave={() => {
            setDrawingCursorPos(null);
          }}
          onClick={(e) => {
            const stage = stageRef.current;
            if (!stage) return;

            if (isDrawingRoof) {
              const pointer = stage.getPointerPosition();
              if (pointer) {
                const stageX = stage.x();
                const stageY = stage.y();
                const stageScale = stage.scaleX();
                const relativeX = (pointer.x - stageX) / stageScale;
                const relativeY = (pointer.y - stageY) / stageScale;
                const snappedX = Math.round(relativeX / 5) * 5;
                const snappedY = Math.round(relativeY / 5) * 5;
                if (onAddRoofPoint) {
                  onAddRoofPoint({ x: snappedX, y: snappedY });
                }
              }
              return;
            }

            if (
              e.target === stageRef.current ||
              e.target.name() === "roof-bg" ||
              e.target.name() === "grid-bg" ||
              e.target.name() === "roof-polygon"
            ) {
              onSelectPanel(null);
              onSelectVertex(null);
            }
          }}
          onTouchEnd={(e) => {
            const stage = stageRef.current;
            if (!stage) return;

            if (isDrawingRoof) {
              const pointer = stage.getPointerPosition();
              if (pointer) {
                const stageX = stage.x();
                const stageY = stage.y();
                const stageScale = stage.scaleX();
                const relativeX = (pointer.x - stageX) / stageScale;
                const relativeY = (pointer.y - stageY) / stageScale;
                const snappedX = Math.round(relativeX / 5) * 5;
                const snappedY = Math.round(relativeY / 5) * 5;
                if (onAddRoofPoint) {
                  onAddRoofPoint({ x: snappedX, y: snappedY });
                }
              }
              return;
            }

            if (
              e.target === stageRef.current ||
              e.target.name() === "roof-bg" ||
              e.target.name() === "grid-bg" ||
              e.target.name() === "roof-polygon"
            ) {
              onSelectPanel(null);
              onSelectVertex(null);
            }
          }}
        >
          <Layer>
            {/* Virtual Grid backdrop */}
            {renderGrid()}

            {/* Rectangle Roof design boundary box */}
            {roofType === "rectangle" && (
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
                  text={`DESIGNATED ROOF AREA (${formatInches(roofWidth)} × ${formatInches(roofHeight)})`}
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
            )}

            {/* Custom Polygon Roof */}
            {roofType === "polygon" && roofPoints.length > 0 && (
              <Group name="roof-polygon-group">
                {/* Main Filled & Outlined Polygon */}
                <Line
                  points={roofPoints.flatMap((p) => [p.x, p.y])}
                  fill={palette.roofBg}
                  stroke={palette.roofStroke}
                  strokeWidth={2.5}
                  closed={!isDrawingRoof}
                  dash={isDrawingRoof ? [5, 5] : undefined}
                  name="roof-polygon"
                  shadowColor="#000"
                  shadowBlur={16}
                  shadowOpacity={theme === "dark" ? 0.5 : 0.15}
                  shadowOffset={{ x: 3, y: 3 }}
                  onDblClick={(e) => {
                    if (isDrawingRoof) return;
                    const stage = e.target.getStage();
                    if (!stage) return;
                    const pointer = stage.getPointerPosition();
                    if (pointer) {
                      const stageX = stage.x();
                      const stageY = stage.y();
                      const stageScale = stage.scaleX();
                      const clickX = (pointer.x - stageX) / stageScale;
                      const clickY = (pointer.y - stageY) / stageScale;

                      // Vector math to find the closest segment and insert a vertex
                      let minDistance = Infinity;
                      let insertIndex = -1;
                      let bestPoint = { x: clickX, y: clickY };

                      for (let i = 0; i < roofPoints.length; i++) {
                        const p1 = roofPoints[i];
                        const p2 = roofPoints[(i + 1) % roofPoints.length];

                        const dx = p2.x - p1.x;
                        const dy = p2.y - p1.y;
                        const lenSq = dx * dx + dy * dy;
                        if (lenSq === 0) continue;

                        const t = Math.max(
                          0,
                          Math.min(
                            1,
                            ((clickX - p1.x) * dx + (clickY - p1.y) * dy) /
                              lenSq,
                          ),
                        );
                        const projX = p1.x + t * dx;
                        const projY = p1.y + t * dy;

                        const distX = clickX - projX;
                        const distY = clickY - projY;
                        const distSq = distX * distX + distY * distY;

                        if (distSq < minDistance) {
                          minDistance = distSq;
                          insertIndex = i + 1;
                          bestPoint = { x: projX, y: projY };
                        }
                      }

                      if (insertIndex !== -1) {
                        const snappedPoint = {
                          x: Math.round(bestPoint.x / 5) * 5,
                          y: Math.round(bestPoint.y / 5) * 5,
                        };
                        const newPoints = [...roofPoints];
                        newPoints.splice(insertIndex, 0, snappedPoint);
                        onUpdateRoofPoints(newPoints);
                        onSelectVertex(insertIndex);
                        onSelectPanel(null);
                      }
                    }
                  }}
                />

                {/* Designation Text */}
                {roofPoints.length >= 3 && !isDrawingRoof && (() => {
                  const cx = roofPoints.reduce((sum, p) => sum + p.x, 0) / roofPoints.length;
                  const cy = roofPoints.reduce((sum, p) => sum + p.y, 0) / roofPoints.length;
                  return (
                    <Text
                      x={cx - 100}
                      y={cy - 5}
                      width={200}
                      align="center"
                      text={`DESIGNATED CUSTOM ROOF AREA`}
                      fontSize={8}
                      fontFamily="monospace"
                      fontStyle="bold"
                      fill={palette.roofText}
                      letterSpacing={1.2}
                      opacity={0.65}
                    />
                  );
                })()}

                {/* Segment Labels */}
                {renderSegmentLabels()}

                {/* Vertex Draggable Handles (Only when NOT drawing) */}
                {!isDrawingRoof && !isExporting &&
                  roofPoints.map((p, idx) => {
                    const isSelected = selectedVertexIndex === idx;
                    const isHovered = hoveredVertex === idx;
                    return (
                      <Circle
                        key={`vertex-handle-${idx}`}
                        x={p.x}
                        y={p.y}
                        radius={isHovered ? 8 : 5.5}
                        fill={
                          isSelected
                            ? palette.roofStroke
                            : theme === "dark"
                            ? "#1e1e1e"
                            : "#ffffff"
                        }
                        stroke={palette.roofStroke}
                        strokeWidth={isSelected ? 3 : 1.5}
                        draggable
                        onDragMove={(e) => {
                          const snappedX = Math.round(e.target.x() / 5) * 5;
                          const snappedY = Math.round(e.target.y() / 5) * 5;
                          const boundedX = Math.max(
                            -500,
                            Math.min(1500, snappedX),
                          );
                          const boundedY = Math.max(
                            -500,
                            Math.min(1500, snappedY),
                          );

                          const newPoints = [...roofPoints];
                          newPoints[idx] = { x: boundedX, y: boundedY };
                          onUpdateRoofPoints(newPoints);

                          e.target.x(boundedX);
                          e.target.y(boundedY);
                        }}
                        onMouseEnter={(e) => {
                          const stage = e.target.getStage();
                          if (stage) stage.container().style.cursor = "pointer";
                          setHoveredVertex(idx);
                        }}
                        onMouseLeave={(e) => {
                          const stage = e.target.getStage();
                          if (stage) stage.container().style.cursor = "default";
                          setHoveredVertex(null);
                        }}
                        onClick={(e) => {
                          e.cancelBubble = true;
                          onSelectVertex(idx);
                          onSelectPanel(null);
                        }}
                        onTouchEnd={(e) => {
                          e.cancelBubble = true;
                          onSelectVertex(idx);
                          onSelectPanel(null);
                        }}
                      />
                    );
                  })}

                {/* Vertex handles during drawing */}
                {isDrawingRoof &&
                  roofPoints.map((p, idx) => (
                    <Circle
                      key={`vertex-drawing-${idx}`}
                      x={p.x}
                      y={p.y}
                      radius={idx === 0 ? 6 : 4.5}
                      fill={idx === 0 ? "#22c55e" : palette.roofStroke}
                      stroke={palette.roofStroke}
                      strokeWidth={1}
                      onClick={(e) => {
                        e.cancelBubble = true;
                        if (idx === 0 && roofPoints.length >= 3) {
                          if (onAddRoofPoint) {
                            onAddRoofPoint(p);
                          }
                        }
                      }}
                    />
                  ))}

                {/* Target cursor snap indicator when drawing */}
                {isDrawingRoof && drawingCursorPos && (
                  <Group>
                    <Circle
                      x={drawingCursorPos.x}
                      y={drawingCursorPos.y}
                      radius={6}
                      stroke={palette.roofStroke}
                      strokeWidth={1}
                      dash={[2, 2]}
                      opacity={0.8}
                    />
                    <Text
                      x={drawingCursorPos.x + 8}
                      y={drawingCursorPos.y - 12}
                      text={`(${(drawingCursorPos.x / SCALE_FACTOR).toFixed(0)}in, ${(
                        drawingCursorPos.y / SCALE_FACTOR
                      ).toFixed(0)}in)`}
                      fontSize={7.5}
                      fontFamily="monospace"
                      fill={palette.roofStroke}
                    />
                  </Group>
                )}
              </Group>
            )}

            {/* Render Panels and Obstacles */}
            {panels.map((panel, idx) => {
              const isSelected = selectedId === panel.id && !isExporting;
              const { width, type } = panel;

              // Calculate top-down projected height based on tilt angle (cos(theta))
              const tiltAngle = type === "panel" ? (panel.tilt !== undefined ? panel.tilt : 18) : 0;
              const tiltRad = (tiltAngle * Math.PI) / 180;
              const height = panel.height * Math.cos(tiltRad);

              // 1 inch = 1 * SCALE_FACTOR visual gap between panels
              const gapPx = type === "panel" ? 1 * SCALE_FACTOR : 0;
              const visualWidth = Math.max(1, width - gapPx);
              const visualHeight = Math.max(1, height - gapPx);

              // Generate cell divisions dynamically for panels
              const gridLines = [];
              if (type === "panel") {
                const cols = Math.max(1, Math.round(width / 8.3));
                const rows = Math.max(1, Math.round(height / 10));
                const cellWidth = visualWidth / cols;
                const cellHeight = visualHeight / rows;

                // Vertical lines
                for (let c = 1; c < cols; c++) {
                  const lineX = -visualWidth / 2 + c * cellWidth;
                  gridLines.push(
                    <Line
                      key={`pv-${panel.id}-${c}`}
                      points={[lineX, -visualHeight / 2, lineX, visualHeight / 2]}
                      stroke={palette.panelGrid}
                      strokeWidth={0.5}
                    />,
                  );
                }
                // Horizontal lines
                for (let r = 1; r < rows; r++) {
                  const lineY = -visualHeight / 2 + r * cellHeight;
                  gridLines.push(
                    <Line
                      key={`ph-${panel.id}-${r}`}
                      points={[-visualWidth / 2, lineY, visualWidth / 2, lineY]}
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
                      x={-visualWidth / 2 - 4}
                      y={-visualHeight / 2 - 4}
                      width={visualWidth + 8}
                      height={visualHeight + 8}
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
                        x={-visualWidth / 2}
                        y={-visualHeight / 2}
                        width={visualWidth}
                        height={visualHeight}
                        fill={theme === "dark" ? "#ef444415" : "#ef444408"}
                        stroke="#ef4444"
                        strokeWidth={1.5}
                        cornerRadius={3}
                        dash={[4, 4]}
                      />
                      {/* Warning diagonals inside obstacle */}
                      <Line
                        points={[
                          -visualWidth / 2,
                          -visualHeight / 2,
                          visualWidth / 2,
                          visualHeight / 2,
                        ]}
                        stroke="#ef4444"
                        strokeWidth={1.5}
                        opacity={0.4}
                      />
                      <Line
                        points={[
                          visualWidth / 2,
                          -visualHeight / 2,
                          -visualWidth / 2,
                          visualHeight / 2,
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
                        x={-visualWidth / 2}
                        y={-visualHeight / 2}
                        width={visualWidth}
                        height={visualHeight}
                        fillLinearGradientStartPoint={{
                          x: -visualWidth / 2,
                          y: -visualHeight / 2,
                        }}
                        fillLinearGradientEndPoint={{
                          x: visualWidth / 2,
                          y: visualHeight / 2,
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
                          -visualWidth / 2 + 5,
                          -visualHeight / 2 + 5,
                          visualWidth / 2 - 5,
                          visualHeight / 2 - 5,
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
                      x={-visualWidth / 2}
                      y={-4}
                      width={visualWidth}
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
                        x={-visualWidth / 2 + 4}
                        y={-visualHeight / 2 + 6}
                        text={`P${idx + 1}`}
                        fontSize={8}
                        fontFamily="monospace"
                        fontStyle="bold"
                        fill={palette.panelLabel}
                      />
                      {visualHeight >= 40 && (
                        <Text
                          x={-visualWidth / 2 + 4}
                          y={visualHeight / 2 - 12}
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
