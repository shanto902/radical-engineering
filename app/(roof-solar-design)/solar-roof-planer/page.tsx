"use client";

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Plus,
  RotateCw,
  Trash2,
  Camera,
  RefreshCw,
  Info,
  Sun,
  Zap,
  ArrowLeft,
  Settings,
  ShieldAlert,
  ChevronUp,
  ChevronDown,
  Undo,
  Check,
  X,
} from "lucide-react";
import {
  PanelData,
  SolarPlannerCanvasRef,
} from "@/components/solar-planner/SolarPlannerCanvas";

// Dynamically import the Konva canvas with SSR disabled to prevent HTML5 canvas hydration mismatches
const SolarPlannerCanvas = dynamic(
  () => import("@/components/solar-planner/SolarPlannerCanvas"),
  { ssr: false },
);

function formatInches(inches: number): string {
  const ft = Math.floor(inches / 12);
  const rIn = Math.round(inches % 12);
  if (ft === 0) return `${rIn}"`;
  if (rIn === 0) return `${ft}'`;
  return `${ft}' ${rIn}"`;
}

export default function SolarPlannerPage() {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const [hasMounted, setHasMounted] = useState(false);

  const SCALE_FACTOR = 1.25; // 1.25 pixels per inch (e.g. 40 inches = 50px)
  const GRID_SIZE = 25;

  // Floor Dimensions
  const [roofWidth, setRoofWidth] = useState(300.0); // 300 inches (25 feet)
  const [roofHeight, setRoofHeight] = useState(200.0); // 200 inches (16.6 feet)

  // Custom Polygon Roof States
  const [roofType, setRoofType] = useState<"rectangle" | "polygon">("rectangle");
  const [roofPoints, setRoofPoints] = useState<{ x: number; y: number }[]>([]);
  const [backupRoofPoints, setBackupRoofPoints] = useState<{ x: number; y: number }[]>([]);
  const [isDrawingRoof, setIsDrawingRoof] = useState(false);
  const [selectedVertexIndex, setSelectedVertexIndex] = useState<number | null>(null);

  // Custom segment measurement states
  const [drawLength, setDrawLength] = useState("80");
  const [drawDirection, setDrawDirection] = useState("right");
  const [drawCustomAngle, setDrawCustomAngle] = useState("0");

  const [panels, setPanels] = useState<PanelData[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isFooterMinimized, setIsFooterMinimized] = useState(false);
  const canvasRef = useRef<SolarPlannerCanvasRef>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const [inputTempValues, setInputTempValues] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    setInputTempValues({});
  }, [selectedId, selectedVertexIndex]);

  // Point in Polygon math
  const isPointInPolygon = (
    point: { x: number; y: number },
    polygon: { x: number; y: number }[],
  ) => {
    if (polygon.length < 3) return false;
    const x = point.x, y = point.y;
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x, yi = polygon[i].y;
      const xj = polygon[j].x, yj = polygon[j].y;
      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  };

  const getPanelCorners = (panel: PanelData) => {
    const w = panel.width;
    const tiltAngle = panel.tilt !== undefined ? panel.tilt : 18;
    const tiltRad = (tiltAngle * Math.PI) / 180;
    const h = panel.height * Math.cos(tiltRad);

    const rad = ((panel.rotation || 0) * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const halfW = w / 2;
    const halfH = h / 2;

    const localCorners = [
      { x: -halfW, y: -halfH },
      { x: halfW, y: -halfH },
      { x: halfW, y: halfH },
      { x: -halfW, y: halfH },
    ];

    return localCorners.map((pt) => ({
      x: panel.x + (pt.x * cos - pt.y * sin),
      y: panel.y + (pt.x * sin + pt.y * cos),
    }));
  };

  const isPanelInsideRoof = (panel: PanelData) => {
    const corners = getPanelCorners(panel);
    if (roofType === "rectangle") {
      return corners.every(
        (pt) =>
          pt.x >= -0.01 &&
          pt.x <= roofWidth * SCALE_FACTOR + 0.01 &&
          pt.y >= -0.01 &&
          pt.y <= roofHeight * SCALE_FACTOR + 0.01,
      );
    } else {
      if (roofPoints.length < 3) return false;
      return corners.every((pt) => isPointInPolygon(pt, roofPoints));
    }
  };

  const panelsOutside = panels.filter((p) => !isPanelInsideRoof(p));
  const hasPanelsOutside = panelsOutside.length > 0;

  const handleCommitFloorWidth = (current: number) => {
    const rawVal = inputTempValues["floorWidth"];
    if (rawVal === undefined || rawVal.trim() === "") {
      setInputTempValues((prev) => {
        const copy = { ...prev };
        delete copy["floorWidth"];
        return copy;
      });
      return;
    }
    let parsed = parseFloat(rawVal);
    if (isNaN(parsed)) parsed = current;
    parsed = Math.min(100000.0, Math.max(10.0, parsed));
    parsed = Math.round(parsed * 10) / 10;
    setRoofWidth(parsed);
    setInputTempValues((prev) => {
      const copy = { ...prev };
      delete copy["floorWidth"];
      return copy;
    });
  };

  const handleCommitFloorHeight = (current: number) => {
    const rawVal = inputTempValues["floorHeight"];
    if (rawVal === undefined || rawVal.trim() === "") {
      setInputTempValues((prev) => {
        const copy = { ...prev };
        delete copy["floorHeight"];
        return copy;
      });
      return;
    }
    let parsed = parseFloat(rawVal);
    if (isNaN(parsed)) parsed = current;
    parsed = Math.min(100000.0, Math.max(10.0, parsed));
    parsed = Math.round(parsed * 10) / 10;
    setRoofHeight(parsed);
    setInputTempValues((prev) => {
      const copy = { ...prev };
      delete copy["floorHeight"];
      return copy;
    });
  };

  const handleCommitVertexX = (currentPx: number) => {
    const rawVal = inputTempValues["vertexX"];
    if (rawVal === undefined || rawVal.trim() === "") {
      setInputTempValues((prev) => {
        const copy = { ...prev };
        delete copy["vertexX"];
        return copy;
      });
      return;
    }
    let parsed = parseFloat(rawVal);
    if (isNaN(parsed)) parsed = currentPx / SCALE_FACTOR;
    parsed = Math.min(100000.0, Math.max(-100000.0, parsed));
    const pxValue = Math.round((parsed * SCALE_FACTOR) / 5) * 5;
    if (selectedVertexIndex !== null) {
      const updated = [...roofPoints];
      updated[selectedVertexIndex] = { ...updated[selectedVertexIndex], x: pxValue };
      setRoofPoints(updated);
    }
    setInputTempValues((prev) => {
      const copy = { ...prev };
      delete copy["vertexX"];
      return copy;
    });
  };

  const handleCommitVertexY = (currentPx: number) => {
    const rawVal = inputTempValues["vertexY"];
    if (rawVal === undefined || rawVal.trim() === "") {
      setInputTempValues((prev) => {
        const copy = { ...prev };
        delete copy["vertexY"];
        return copy;
      });
      return;
    }
    let parsed = parseFloat(rawVal);
    if (isNaN(parsed)) parsed = currentPx / SCALE_FACTOR;
    parsed = Math.min(100000.0, Math.max(-100000.0, parsed));
    const pxValue = Math.round((parsed * SCALE_FACTOR) / 5) * 5;
    if (selectedVertexIndex !== null) {
      const updated = [...roofPoints];
      updated[selectedVertexIndex] = { ...updated[selectedVertexIndex], y: pxValue };
      setRoofPoints(updated);
    }
    setInputTempValues((prev) => {
      const copy = { ...prev };
      delete copy["vertexY"];
      return copy;
    });
  };

  const handleCommitElementWidth = (currentPx: number) => {
    const rawVal = inputTempValues["elementWidth"];
    if (rawVal === undefined || rawVal.trim() === "") {
      setInputTempValues((prev) => {
        const copy = { ...prev };
        delete copy["elementWidth"];
        return copy;
      });
      return;
    }
    let parsed = parseFloat(rawVal);
    if (isNaN(parsed)) parsed = currentPx / SCALE_FACTOR;
    parsed = Math.min(200.0, Math.max(10.0, parsed));
    const pxValue = Math.round((parsed * SCALE_FACTOR) / 5) * 5;
    if (selectedId) {
      handleUpdatePanel(selectedId, { width: pxValue });
    }
    setInputTempValues((prev) => {
      const copy = { ...prev };
      delete copy["elementWidth"];
      return copy;
    });
  };

  const handleCommitElementHeight = (currentPx: number) => {
    const rawVal = inputTempValues["elementHeight"];
    if (rawVal === undefined || rawVal.trim() === "") {
      setInputTempValues((prev) => {
        const copy = { ...prev };
        delete copy["elementHeight"];
        return copy;
      });
      return;
    }
    let parsed = parseFloat(rawVal);
    if (isNaN(parsed)) parsed = currentPx / SCALE_FACTOR;
    parsed = Math.min(200.0, Math.max(10.0, parsed));
    const pxValue = Math.round((parsed * SCALE_FACTOR) / 5) * 5;
    if (selectedId) {
      handleUpdatePanel(selectedId, { height: pxValue });
    }
    setInputTempValues((prev) => {
      const copy = { ...prev };
      delete copy["elementHeight"];
      return copy;
    });
  };

  const handleCommitElementPower = (current: number) => {
    const rawVal = inputTempValues["elementPower"];
    if (rawVal === undefined || rawVal.trim() === "") {
      setInputTempValues((prev) => {
        const copy = { ...prev };
        delete copy["elementPower"];
        return copy;
      });
      return;
    }
    let parsed = parseInt(rawVal, 10);
    if (isNaN(parsed)) parsed = current;
    parsed = Math.min(700, Math.max(200, parsed));
    if (selectedId) {
      handleUpdatePanel(selectedId, { power: parsed });
    }
    setInputTempValues((prev) => {
      const copy = { ...prev };
      delete copy["elementPower"];
      return copy;
    });
  };

  const handleCommitElementTilt = (current: number) => {
    const rawVal = inputTempValues["elementTilt"];
    if (rawVal === undefined || rawVal.trim() === "") {
      setInputTempValues((prev) => {
        const copy = { ...prev };
        delete copy["elementTilt"];
        return copy;
      });
      return;
    }
    let parsed = parseInt(rawVal, 10);
    if (isNaN(parsed)) parsed = current;
    parsed = Math.min(60, Math.max(0, parsed));
    if (selectedId) {
      handleUpdatePanel(selectedId, { tilt: parsed });
    }
    setInputTempValues((prev) => {
      const copy = { ...prev };
      delete copy["elementTilt"];
      return copy;
    });
  };

  const currentTheme = hasMounted ? mode : "dark";

  // Calculate dynamic panel power based on dimensions: 0.129W per sq inch density (~200W/sqm)
  const getPanelPower = (widthPx: number, heightPx: number) => {
    const wInches = widthPx / SCALE_FACTOR;
    const hInches = heightPx / SCALE_FACTOR;
    return Math.round(wInches * hInches * 0.129);
  };

  // Add solar panel to the center
  const handleAddPanel = () => {
    const newId = `element-${Date.now()}`;
    let centerGridX = Math.round((roofWidth * SCALE_FACTOR) / 2 / GRID_SIZE) * GRID_SIZE;
    let centerGridY = Math.round((roofHeight * SCALE_FACTOR) / 2 / GRID_SIZE) * GRID_SIZE;

    if (roofType === "polygon" && roofPoints.length > 0) {
      const minX = Math.min(...roofPoints.map((p) => p.x));
      const maxX = Math.max(...roofPoints.map((p) => p.x));
      const minY = Math.min(...roofPoints.map((p) => p.y));
      const maxY = Math.max(...roofPoints.map((p) => p.y));
      centerGridX = Math.round((minX + (maxX - minX) / 2) / GRID_SIZE) * GRID_SIZE;
      centerGridY = Math.round((minY + (maxY - minY) / 2) / GRID_SIZE) * GRID_SIZE;
    }

    const lastPanel = [...panels].reverse().find((p) => p.type === "panel");

    const newPanel: PanelData = {
      id: newId,
      x: centerGridX,
      y: centerGridY,
      rotation: 0,
      width: lastPanel ? lastPanel.width : 50, // 40" default
      height: lastPanel ? lastPanel.height : 100, // 80" default
      type: "panel",
      power: lastPanel ? lastPanel.power : 400, // 400W default
      tilt: lastPanel !== undefined && lastPanel.tilt !== undefined ? lastPanel.tilt : 18, // 18 degrees default tilt
    };
    setPanels((prev) => [...prev, newPanel]);
    setSelectedId(newId);
    setSelectedVertexIndex(null);
  };

  // Add obstacle (stair, chimney, vent) to the center
  const handleAddObstacle = () => {
    const newId = `element-${Date.now()}`;
    let centerGridX = Math.round((roofWidth * SCALE_FACTOR) / 2 / GRID_SIZE) * GRID_SIZE;
    let centerGridY = Math.round((roofHeight * SCALE_FACTOR) / 2 / GRID_SIZE) * GRID_SIZE;

    if (roofType === "polygon" && roofPoints.length > 0) {
      const minX = Math.min(...roofPoints.map((p) => p.x));
      const maxX = Math.max(...roofPoints.map((p) => p.x));
      const minY = Math.min(...roofPoints.map((p) => p.y));
      const maxY = Math.max(...roofPoints.map((p) => p.y));
      centerGridX = Math.round((minX + (maxX - minX) / 2) / GRID_SIZE) * GRID_SIZE;
      centerGridY = Math.round((minY + (maxY - minY) / 2) / GRID_SIZE) * GRID_SIZE;
    }

    const lastObstacle = [...panels].reverse().find((p) => p.type === "obstacle");

    const newObstacle: PanelData = {
      id: newId,
      x: centerGridX,
      y: centerGridY,
      rotation: 0,
      width: lastObstacle ? lastObstacle.width : 50, // 40" default
      height: lastObstacle ? lastObstacle.height : 50, // 40" default
      type: "obstacle",
    };
    setPanels((prev) => [...prev, newObstacle]);
    setSelectedId(newId);
    setSelectedVertexIndex(null);
  };

  const handleSelectPanel = (id: string | null) => {
    setSelectedId(id);
    if (id !== null) {
      setSelectedVertexIndex(null);
    }
  };

  const handleSelectVertex = (idx: number | null) => {
    setSelectedVertexIndex(idx);
    if (idx !== null) {
      setSelectedId(null);
    }
  };

  const handleUpdatePanel = (id: string, updated: Partial<PanelData>) => {
    setPanels((prev) =>
      prev.map((panel) => (panel.id === id ? { ...panel, ...updated } : panel)),
    );
  };

  const handleRotatePanel = (id: string) => {
    setPanels((prev) =>
      prev.map((panel) =>
        panel.id === id
          ? { ...panel, rotation: (panel.rotation + 90) % 360 }
          : panel,
      ),
    );
  };

  const handleDeletePanel = () => {
    if (!selectedId) return;
    setPanels((prev) => prev.filter((panel) => panel.id !== selectedId));
    setSelectedId(null);
  };

  const handleClearLayout = () => {
    if (confirm("Are you sure you want to clear your current layout design?")) {
      setPanels([]);
      setSelectedId(null);
      setSelectedVertexIndex(null);
    }
  };

  const handleExportLayout = () => {
    if (canvasRef.current) {
      canvasRef.current.exportLayout();
    }
  };

  // Custom drawing handlers
  const handleStartDrawingRoof = () => {
    setBackupRoofPoints(roofPoints);
    setRoofPoints([]);
    setIsDrawingRoof(true);
    setSelectedVertexIndex(null);
    setSelectedId(null);
  };

  const handleCancelDrawingRoof = () => {
    setRoofPoints(backupRoofPoints);
    setIsDrawingRoof(false);
    setSelectedVertexIndex(null);
  };

  const handleFinishDrawingRoof = () => {
    if (roofPoints.length < 3) {
      alert("Please draw at least 3 points to outline a roof boundary.");
      return;
    }
    setIsDrawingRoof(false);
    setSelectedVertexIndex(null);
  };

  const handleDeleteVertex = () => {
    if (selectedVertexIndex === null || roofPoints.length <= 3) return;
    const updated = [...roofPoints];
    updated.splice(selectedVertexIndex, 1);
    setRoofPoints(updated);
    setSelectedVertexIndex(null);
  };

  const handleStartDrawingMeasurementCenter = () => {
    const centerGridX = Math.round((roofWidth * SCALE_FACTOR) / 2 / GRID_SIZE) * GRID_SIZE;
    const centerGridY = Math.round((roofHeight * SCALE_FACTOR) / 2 / GRID_SIZE) * GRID_SIZE;
    setRoofPoints([{ x: centerGridX, y: centerGridY }]);
  };

  const handleAddSegmentByMeasurement = () => {
    if (roofPoints.length === 0) {
      handleStartDrawingMeasurementCenter();
      return;
    }

    const last = roofPoints[roofPoints.length - 1];
    const lenM = parseFloat(drawLength);
    if (isNaN(lenM) || lenM <= 0) return;
    const lenPx = lenM * SCALE_FACTOR;

    let angleDeg = 0;
    if (drawDirection === "right") angleDeg = 0;
    else if (drawDirection === "down") angleDeg = 90;
    else if (drawDirection === "left") angleDeg = 180;
    else if (drawDirection === "up") angleDeg = 270;
    else {
      angleDeg = parseFloat(drawCustomAngle);
      if (isNaN(angleDeg)) angleDeg = 0;
    }

    const angleRad = (angleDeg * Math.PI) / 180;
    const nextX = last.x + lenPx * Math.cos(angleRad);
    const nextY = last.y + lenPx * Math.sin(angleRad);

    const snappedX = Math.round(nextX / 5) * 5;
    const snappedY = Math.round(nextY / 5) * 5;

    const boundedX = Math.max(-500, Math.min(1500, snappedX));
    const boundedY = Math.max(-500, Math.min(1500, snappedY));

    setRoofPoints((prev) => [...prev, { x: boundedX, y: boundedY }]);
  };

  const handleAddRoofPoint = (point: { x: number; y: number }) => {
    if (roofPoints.length >= 3) {
      const first = roofPoints[0];
      const dist = Math.sqrt((point.x - first.x) ** 2 + (point.y - first.y) ** 2);
      if (dist < 15) {
        setIsDrawingRoof(false);
        setSelectedVertexIndex(null);
        return;
      }
    }
    setRoofPoints((prev) => [...prev, point]);
  };

  // Stats Calculations (ignoring obstacles)
  const activePanels = panels.filter((p) => p.type === "panel");
  const obstacles = panels.filter((p) => p.type === "obstacle");

  const systemSizeKW =
    activePanels.reduce((sum, p) => sum + (p.power || 400), 0) / 1000;

  const estimatedArea = activePanels.reduce(
    (sum, p) => sum + (p.width / SCALE_FACTOR) * (p.height / SCALE_FACTOR),
    0,
  );

  const annualSavingsBDT = systemSizeKW * 1450 * 12;

  const selectedElement = panels.find((p) => p.id === selectedId);
  const selectedIndex = panels.findIndex((p) => p.id === selectedId);

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-background text-foreground select-none overflow-hidden font-sans transition-colors duration-300">
      {/* Top Header */}
      <header className="w-full border-b border-primary/10 bg-background/95 backdrop-blur-md z-20 shrink-0">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-10 h-10 rounded-xl border border-primary/10 flex items-center justify-center text-foreground/70 active:text-foreground active:scale-95 transition-all bg-primary/5"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-base font-bold tracking-tight flex items-center gap-1.5 text-foreground">
                <Sun className="w-4 h-4 text-secondary fill-secondary/20" />
                Solar Roof Planner
              </h1>
              <p className="text-[10px] text-foreground/60 font-mono tracking-wider">
                RADICAL ENGINEERING
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {panels.length > 0 && (
              <button
                onClick={handleClearLayout}
                className="px-2.5 py-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold active:scale-95 transition-all flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Clear
              </button>
            )}
            <div className="w-10 h-10 rounded-xl border border-primary/10 flex items-center justify-center text-foreground/70 bg-primary/5 active:scale-95 transition-all">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Stats Board Section */}
      <section className="w-full bg-primary/5 border-b border-primary/10 z-10 shrink-0">
        <div className="max-w-7xl mx-auto px-4 py-1.5 grid grid-cols-3 gap-2">
          {/* Panels Card */}
          <div className="bg-background/80 border border-primary/5 rounded-xl px-2.5 py-1.5 flex items-center justify-between shadow-sm">
            <div className="flex flex-col leading-none">
              <span className="text-[9px] text-foreground/50 font-medium uppercase tracking-wider">
                Panels
              </span>
              <span className="text-[8px] text-foreground/40 font-mono mt-0.5">
                Qty
              </span>
            </div>
            <span className="text-base font-black text-secondary leading-none">
              {activePanels.length}
            </span>
          </div>

          {/* Output Card */}
          <div className="bg-background/80 border border-primary/5 rounded-xl px-2.5 py-1.5 flex items-center justify-between shadow-sm">
            <div className="flex flex-col leading-none">
              <span className="text-[9px] text-foreground/50 font-medium uppercase tracking-wider flex items-center gap-0.5">
                <Zap className="w-2 h-2 text-secondary" /> Output
              </span>
              <span className="text-[8px] text-foreground/40 font-mono mt-0.5">
                kWp
              </span>
            </div>
            <span className="text-base font-black text-foreground leading-none">
              {systemSizeKW.toFixed(2)}
            </span>
          </div>

          {/* Area Card */}
          <div className="bg-background/80 border border-primary/5 rounded-xl px-2.5 py-1.5 flex items-center justify-between shadow-sm">
            <div className="flex flex-col leading-none">
              <span className="text-[9px] text-foreground/50 font-medium uppercase tracking-wider">
                Area
              </span>
              <span className="text-[8px] text-foreground/40 font-mono mt-0.5">
                sq ft
              </span>
            </div>
            <span className="text-base font-black text-foreground leading-none">
              {(estimatedArea / 144).toFixed(0)}
            </span>
          </div>
        </div>
      </section>

      {/* Warning alert if panels are outside roof */}
      {hasPanelsOutside && (
        <div className="w-full bg-red-500/10 border-b border-red-500/20 text-red-600 dark:text-red-400 py-1.5 px-4 z-10 shrink-0 text-center text-[10px] font-bold tracking-wide flex items-center justify-center gap-1.5 animate-in fade-in duration-200">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
          <span>
            {panelsOutside.length} element{panelsOutside.length > 1 ? "s" : ""} placed outside the designated roof area.
          </span>
        </div>
      )}

      {/* Main Interactive Canvas Area */}
      <main className="flex-1 w-full relative overflow-hidden bg-background">
        <SolarPlannerCanvas
          ref={canvasRef}
          panels={panels}
          selectedId={selectedId}
          onSelectPanel={handleSelectPanel}
          onUpdatePanel={handleUpdatePanel}
          onRotatePanel={handleRotatePanel}
          roofWidth={roofWidth}
          roofHeight={roofHeight}
          theme={currentTheme}
          roofType={roofType}
          roofPoints={roofPoints}
          onUpdateRoofPoints={setRoofPoints}
          isDrawingRoof={isDrawingRoof}
          onAddRoofPoint={handleAddRoofPoint}
          selectedVertexIndex={selectedVertexIndex}
          onSelectVertex={handleSelectVertex}
        />
      </main>

      {/* Bottom Floating Control Panel */}
      <footer className="w-full border-t border-primary/10 bg-background/95 backdrop-blur-lg z-20 shrink-0 pb-safe-bottom shadow-[0_-4px_16px_rgba(0,0,0,0.05)] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 pt-2 pb-4 flex flex-col gap-2">
          {/* Minimize/Maximize Handle */}
          <div className="flex justify-center -mt-5 mb-1">
            <button
              onClick={() => setIsFooterMinimized(!isFooterMinimized)}
              className="w-16 h-5 rounded-t-lg bg-background border-t border-x border-primary/10 flex items-center justify-center text-foreground/40 hover:text-foreground active:scale-95 transition-all shadow-[0_-2px_4px_rgba(0,0,0,0.03)]"
              title={
                isFooterMinimized ? "Expand controls" : "Minimize controls"
              }
            >
              {isFooterMinimized ? (
                <ChevronUp className="w-3.5 h-3.5 stroke-[2.5]" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
              )}
            </button>
          </div>

          {!isFooterMinimized ? (
            <div className="flex flex-col gap-3.5 animate-in fade-in slide-in-from-bottom-1 duration-200">
              {/* EDIT ELEMENT TOOLBAR (When element is selected) */}
              {selectedId && selectedElement ? (
                <div className="flex flex-col gap-2.5 bg-primary/5 p-2.5 rounded-xl border border-primary/10 shadow-inner">
                  {/* Header / Type Switch */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 shrink-0">
                      {selectedElement.type === "obstacle" ? (
                        <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                      ) : (
                        <Sun className="w-3.5 h-3.5 text-secondary" />
                      )}
                      <span className="text-[11px] font-bold text-foreground">
                        #{selectedIndex + 1}{" "}
                        {selectedElement.type === "obstacle"
                          ? "Obstacle"
                          : "Panel"}
                      </span>
                    </div>

                    {/* Type Switch Toggle */}
                    <div className="flex bg-background border border-primary/10 p-0.5 rounded-lg text-[9px] font-bold">
                      <button
                        onClick={() =>
                          handleUpdatePanel(selectedId, {
                            type: "panel",
                            width: 50,
                            height: 100,
                            power: 400,
                            tilt: 18,
                          })
                        }
                        className={`px-2 py-0.5 rounded-md transition-all ${
                          selectedElement.type === "panel"
                            ? "bg-primary text-background"
                            : "text-foreground/60"
                        }`}
                      >
                        Solar Panel
                      </button>
                      <button
                        onClick={() =>
                          handleUpdatePanel(selectedId, {
                            type: "obstacle",
                            width: 50,
                            height: 50,
                          })
                        }
                        className={`px-2 py-0.5 rounded-md transition-all ${
                          selectedElement.type === "obstacle"
                            ? "bg-red-600 text-white"
                            : "text-foreground/60"
                        }`}
                      >
                        Obstacle
                      </button>
                    </div>
                  </div>

                  {/* 2x2 Grid of Steppers */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* Element Width */}
                    <div className="flex items-center justify-between bg-background border border-primary/10 px-2 py-1 rounded-xl">
                      <div className="flex flex-col leading-none">
                        <span className="text-[10px] text-foreground/50 font-mono">
                          W:
                        </span>
                        <span className="text-[8px] text-primary/70 font-mono font-bold mt-0.5 select-none">
                          ({formatInches(selectedElement.width / SCALE_FACTOR)})
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            handleUpdatePanel(selectedId, {
                              width: Math.max(25, selectedElement.width - 5),
                            });
                            setInputTempValues((prev) => {
                              const copy = { ...prev };
                              delete copy.elementWidth;
                              return copy;
                            });
                          }}
                          className="w-6 h-6 rounded-lg bg-primary/5 border border-primary/10 text-foreground flex items-center justify-center font-black text-xs active:scale-90 transition-all select-none"
                        >
                          －
                        </button>
                        <div className="flex items-center justify-center font-bold font-mono text-xs text-foreground min-w-[28px]">
                          <input
                            type="text"
                            inputMode="decimal"
                            value={
                              inputTempValues["elementWidth"] !== undefined
                                ? inputTempValues["elementWidth"]
                                : (selectedElement.width / SCALE_FACTOR).toFixed(1)
                            }
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === "" || /^\d*\.?\d*$/.test(val)) {
                                setInputTempValues((prev) => ({
                                  ...prev,
                                  elementWidth: val,
                                }));
                              }
                            }}
                            onBlur={() =>
                              handleCommitElementWidth(selectedElement.width)
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter")
                                handleCommitElementWidth(selectedElement.width);
                            }}
                            className="w-8 text-center bg-transparent border-b border-transparent focus:border-primary/30 focus:bg-primary/5 rounded px-0.5 focus:outline-none transition-all py-0.5 font-bold"
                          />
                          <span className="text-[10px] text-foreground/50 ml-0.5 select-none">
                            in
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            handleUpdatePanel(selectedId, {
                              width: Math.min(250, selectedElement.width + 5),
                            });
                            setInputTempValues((prev) => {
                              const copy = { ...prev };
                              delete copy.elementWidth;
                              return copy;
                            });
                          }}
                          className="w-6 h-6 rounded-lg bg-primary/5 border border-primary/10 text-foreground flex items-center justify-center font-black text-xs active:scale-90 transition-all select-none"
                        >
                          ＋
                        </button>
                      </div>
                    </div>

                    {/* Element Height */}
                    <div className="flex items-center justify-between bg-background border border-primary/10 px-2 py-1 rounded-xl">
                      <div className="flex flex-col leading-none">
                        <span className="text-[10px] text-foreground/50 font-mono">
                          H:
                        </span>
                        <span className="text-[8px] text-primary/70 font-mono font-bold mt-0.5 select-none">
                          ({formatInches(selectedElement.height / SCALE_FACTOR)})
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            handleUpdatePanel(selectedId, {
                              height: Math.max(25, selectedElement.height - 5),
                            });
                            setInputTempValues((prev) => {
                              const copy = { ...prev };
                              delete copy.elementHeight;
                              return copy;
                            });
                          }}
                          className="w-6 h-6 rounded-lg bg-primary/5 border border-primary/10 text-foreground flex items-center justify-center font-black text-xs active:scale-90 transition-all select-none"
                        >
                          －
                        </button>
                        <div className="flex items-center justify-center font-bold font-mono text-xs text-foreground min-w-[28px] flex-col leading-none">
                          <div className="flex items-center justify-center">
                            <input
                              type="text"
                              inputMode="decimal"
                              value={
                                inputTempValues["elementHeight"] !== undefined
                                  ? inputTempValues["elementHeight"]
                                  : (selectedElement.height / SCALE_FACTOR).toFixed(1)
                              }
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === "" || /^\d*\.?\d*$/.test(val)) {
                                  setInputTempValues((prev) => ({
                                    ...prev,
                                    elementHeight: val,
                                  }));
                                }
                              }}
                              onBlur={() =>
                                handleCommitElementHeight(
                                  selectedElement.height,
                                )
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter")
                                  handleCommitElementHeight(
                                    selectedElement.height,
                                  );
                              }}
                              className="w-8 text-center bg-transparent border-b border-transparent focus:border-primary/30 focus:bg-primary/5 rounded px-0.5 focus:outline-none transition-all py-0.5 font-bold"
                            />
                            <span className="text-[10px] text-foreground/50 ml-0.5 select-none">
                              in
                            </span>
                          </div>
                          {selectedElement.type === "panel" &&
                            selectedElement.tilt !== undefined &&
                            selectedElement.tilt > 0 && (
                              <span className="text-[8px] text-foreground/45 font-normal tracking-tight mt-0.5 leading-none select-none">
                                (Proj: {formatInches(
                                  (selectedElement.height *
                                    Math.cos(
                                      (selectedElement.tilt * Math.PI) / 180,
                                    )) /
                                  SCALE_FACTOR
                                )})
                              </span>
                            )}
                        </div>
                        <button
                          onClick={() => {
                            handleUpdatePanel(selectedId, {
                              height: Math.min(250, selectedElement.height + 5),
                            });
                            setInputTempValues((prev) => {
                              const copy = { ...prev };
                              delete copy.elementHeight;
                              return copy;
                            });
                          }}
                          className="w-6 h-6 rounded-lg bg-primary/5 border border-primary/10 text-foreground flex items-center justify-center font-black text-xs active:scale-90 transition-all select-none"
                        >
                          ＋
                        </button>
                      </div>
                    </div>

                    {/* Panel Wattage Stepper */}
                    {selectedElement.type === "panel" && (
                      <div className="flex items-center justify-between bg-background border border-primary/10 px-2 py-1 rounded-xl">
                        <span className="text-[10px] text-foreground/50 font-mono">
                          Watt:
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              handleUpdatePanel(selectedId, {
                                power: Math.max(
                                  200,
                                  (selectedElement.power || 400) - 5,
                                ),
                              });
                              setInputTempValues((prev) => {
                                const copy = { ...prev };
                                delete copy.elementPower;
                                return copy;
                              });
                            }}
                            className="w-6 h-6 rounded-lg bg-primary/5 border border-primary/10 text-foreground flex items-center justify-center font-black text-xs active:scale-90 transition-all select-none"
                          >
                            －
                          </button>
                          <div className="flex items-center justify-center font-bold font-mono text-xs text-foreground min-w-[36px]">
                            <input
                              type="text"
                              inputMode="numeric"
                              value={
                                inputTempValues["elementPower"] !== undefined
                                  ? inputTempValues["elementPower"]
                                  : (selectedElement.power || 400).toString()
                              }
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === "" || /^\d*$/.test(val)) {
                                  setInputTempValues((prev) => ({
                                    ...prev,
                                    elementPower: val,
                                  }));
                                }
                              }}
                              onBlur={() =>
                                handleCommitElementPower(
                                  selectedElement.power || 400,
                                )
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter")
                                  handleCommitElementPower(
                                    selectedElement.power || 400,
                                  );
                              }}
                              className="w-10 text-center bg-transparent border-b border-transparent focus:border-primary/30 focus:bg-primary/5 rounded px-0.5 focus:outline-none transition-all py-0.5 font-bold"
                            />
                            <span className="text-[10px] text-foreground/50 ml-0.5 select-none">
                              W
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              handleUpdatePanel(selectedId, {
                                power: Math.min(
                                  700,
                                  (selectedElement.power || 400) + 5,
                                ),
                              });
                              setInputTempValues((prev) => {
                                const copy = { ...prev };
                                delete copy.elementPower;
                                return copy;
                              });
                            }}
                            className="w-6 h-6 rounded-lg bg-primary/5 border border-primary/10 text-foreground flex items-center justify-center font-black text-xs active:scale-90 transition-all select-none"
                          >
                            ＋
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Panel Tilt Stepper */}
                    {selectedElement.type === "panel" && (
                      <div className="flex items-center justify-between bg-background border border-primary/10 px-2 py-1 rounded-xl">
                        <span className="text-[10px] text-foreground/50 font-mono">
                          Tilt:
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              handleUpdatePanel(selectedId, {
                                tilt: Math.max(
                                  0,
                                  (selectedElement.tilt !== undefined
                                    ? selectedElement.tilt
                                    : 18) - 1,
                                ),
                              });
                              setInputTempValues((prev) => {
                                const copy = { ...prev };
                                delete copy.elementTilt;
                                return copy;
                              });
                            }}
                            className="w-6 h-6 rounded-lg bg-primary/5 border border-primary/10 text-foreground flex items-center justify-center font-black text-xs active:scale-90 transition-all select-none"
                          >
                            －
                          </button>
                          <div className="flex items-center justify-center font-bold font-mono text-xs text-foreground min-w-[28px]">
                            <input
                              type="text"
                              inputMode="numeric"
                              value={
                                inputTempValues["elementTilt"] !== undefined
                                  ? inputTempValues["elementTilt"]
                                  : (selectedElement.tilt !== undefined
                                      ? selectedElement.tilt
                                      : 18
                                    ).toString()
                              }
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === "" || /^\d*$/.test(val)) {
                                  setInputTempValues((prev) => ({
                                    ...prev,
                                    elementTilt: val,
                                  }));
                                }
                              }}
                              onBlur={() =>
                                handleCommitElementTilt(
                                  selectedElement.tilt !== undefined
                                    ? selectedElement.tilt
                                    : 18,
                                )
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter")
                                  handleCommitElementTilt(
                                    selectedElement.tilt !== undefined
                                      ? selectedElement.tilt
                                      : 18,
                                  );
                              }}
                              className="w-6 text-center bg-transparent border-b border-transparent focus:border-primary/30 focus:bg-primary/5 rounded px-0.5 focus:outline-none transition-all py-0.5 font-bold"
                            />
                            <span className="text-[10px] text-foreground/50 ml-0.5 select-none">
                              °
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              handleUpdatePanel(selectedId, {
                                tilt: Math.min(
                                  60,
                                  (selectedElement.tilt !== undefined
                                    ? selectedElement.tilt
                                    : 18) + 1,
                                ),
                              });
                              setInputTempValues((prev) => {
                                const copy = { ...prev };
                                delete copy.elementTilt;
                                return copy;
                              });
                            }}
                            className="w-6 h-6 rounded-lg bg-primary/5 border border-primary/10 text-foreground flex items-center justify-center font-black text-xs active:scale-90 transition-all select-none"
                          >
                            ＋
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Element Operations */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRotatePanel(selectedId)}
                      className="flex-1 py-1.5 rounded-lg bg-background border border-primary/10 text-foreground font-semibold text-xs active:scale-95 transition-all flex items-center justify-center gap-1"
                    >
                      <RotateCw className="w-3.5 h-3.5 text-secondary" />
                      Rotate
                    </button>

                    <button
                      onClick={handleDeletePanel}
                      className="flex-1 py-1.5 rounded-lg bg-red-600/10 border border-red-500/20 active:scale-95 text-red-600 dark:text-red-400 font-semibold text-xs transition-all flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              ) : selectedVertexIndex !== null ? (
                /* VERTEX EDITOR (When a custom polygon vertex is selected) */
                <div className="flex flex-col gap-2.5 bg-primary/5 p-2.5 rounded-xl border border-primary/10 shadow-inner animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-foreground/70 text-xs font-semibold px-0.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span>Edit Vertex #{selectedVertexIndex + 1} Coordinates</span>
                    </div>
                    <button
                      onClick={() => handleSelectVertex(null)}
                      className="text-[10px] text-foreground/50 hover:text-foreground active:scale-95 font-bold transition-all px-1.5 py-0.5 rounded border border-primary/10 bg-background"
                    >
                      Deselect
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Vertex X Coordinate */}
                    <div className="flex items-center justify-between bg-background border border-primary/10 px-2 py-1 rounded-xl">
                      <span className="text-[10px] text-foreground/50 font-mono">
                        X Position (in):
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            if (selectedVertexIndex !== null) {
                              const current = roofPoints[selectedVertexIndex].x;
                              const updated = [...roofPoints];
                              updated[selectedVertexIndex] = {
                                ...updated[selectedVertexIndex],
                                  x: Math.max(-500, current - 5), // snap to 5px
                              };
                              setRoofPoints(updated);
                            }
                            setInputTempValues((prev) => {
                              const copy = { ...prev };
                              delete copy.vertexX;
                              return copy;
                            });
                          }}
                          className="w-6 h-6 rounded-lg bg-primary/5 border border-primary/10 text-foreground flex items-center justify-center font-black text-xs active:scale-90 active:bg-primary/10 transition-all select-none"
                        >
                          －
                        </button>
                        <div className="flex items-center justify-center font-bold font-mono text-xs text-foreground min-w-[28px]">
                          <input
                            type="text"
                            inputMode="decimal"
                            value={
                              selectedVertexIndex !== null && inputTempValues["vertexX"] !== undefined
                                ? inputTempValues["vertexX"]
                                : selectedVertexIndex !== null
                                ? (roofPoints[selectedVertexIndex].x / SCALE_FACTOR).toFixed(1)
                                : "0"
                            }
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === "" || /^-?\d*\.?\d*$/.test(val)) {
                                setInputTempValues((prev) => ({
                                  ...prev,
                                  vertexX: val,
                                }));
                              }
                            }}
                            onBlur={() => selectedVertexIndex !== null && handleCommitVertexX(roofPoints[selectedVertexIndex].x)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && selectedVertexIndex !== null)
                                handleCommitVertexX(roofPoints[selectedVertexIndex].x);
                            }}
                            className="w-8 text-center bg-transparent border-b border-transparent focus:border-primary/30 focus:bg-primary/5 rounded px-0.5 focus:outline-none transition-all py-0.5 font-bold"
                          />
                        </div>
                        <button
                          onClick={() => {
                            if (selectedVertexIndex !== null) {
                              const current = roofPoints[selectedVertexIndex].x;
                              const updated = [...roofPoints];
                              updated[selectedVertexIndex] = {
                                ...updated[selectedVertexIndex],
                                x: Math.min(1500, current + 5),
                              };
                              setRoofPoints(updated);
                            }
                            setInputTempValues((prev) => {
                              const copy = { ...prev };
                              delete copy.vertexX;
                              return copy;
                            });
                          }}
                          className="w-6 h-6 rounded-lg bg-primary/5 border border-primary/10 text-foreground flex items-center justify-center font-black text-xs active:scale-90 active:bg-primary/10 transition-all select-none"
                        >
                          ＋
                        </button>
                      </div>
                    </div>

                    {/* Vertex Y Coordinate */}
                    <div className="flex items-center justify-between bg-background border border-primary/10 px-2 py-1 rounded-xl">
                      <span className="text-[10px] text-foreground/50 font-mono">
                        Y Position (in):
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            if (selectedVertexIndex !== null) {
                              const current = roofPoints[selectedVertexIndex].y;
                              const updated = [...roofPoints];
                              updated[selectedVertexIndex] = {
                                ...updated[selectedVertexIndex],
                                y: Math.max(-500, current - 5),
                              };
                              setRoofPoints(updated);
                            }
                            setInputTempValues((prev) => {
                              const copy = { ...prev };
                              delete copy.vertexY;
                              return copy;
                            });
                          }}
                          className="w-6 h-6 rounded-lg bg-primary/5 border border-primary/10 text-foreground flex items-center justify-center font-black text-xs active:scale-90 active:bg-primary/10 transition-all select-none"
                        >
                          －
                        </button>
                        <div className="flex items-center justify-center font-bold font-mono text-xs text-foreground min-w-[28px]">
                          <input
                            type="text"
                            inputMode="decimal"
                            value={
                              selectedVertexIndex !== null && inputTempValues["vertexY"] !== undefined
                                ? inputTempValues["vertexY"]
                                : selectedVertexIndex !== null
                                ? (roofPoints[selectedVertexIndex].y / SCALE_FACTOR).toFixed(1)
                                : "0"
                            }
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === "" || /^-?\d*\.?\d*$/.test(val)) {
                                setInputTempValues((prev) => ({
                                  ...prev,
                                  vertexY: val,
                                }));
                              }
                            }}
                            onBlur={() => selectedVertexIndex !== null && handleCommitVertexY(roofPoints[selectedVertexIndex].y)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && selectedVertexIndex !== null)
                                handleCommitVertexY(roofPoints[selectedVertexIndex].y);
                            }}
                            className="w-8 text-center bg-transparent border-b border-transparent focus:border-primary/30 focus:bg-primary/5 rounded px-0.5 focus:outline-none transition-all py-0.5 font-bold"
                          />
                        </div>
                        <button
                          onClick={() => {
                            if (selectedVertexIndex !== null) {
                              const current = roofPoints[selectedVertexIndex].y;
                              const updated = [...roofPoints];
                              updated[selectedVertexIndex] = {
                                ...updated[selectedVertexIndex],
                                y: Math.min(1500, current + 5),
                              };
                              setRoofPoints(updated);
                            }
                            setInputTempValues((prev) => {
                              const copy = { ...prev };
                              delete copy.vertexY;
                              return copy;
                            });
                          }}
                          className="w-6 h-6 rounded-lg bg-primary/5 border border-primary/10 text-foreground flex items-center justify-center font-black text-xs active:scale-90 active:bg-primary/10 transition-all select-none"
                        >
                          ＋
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleDeleteVertex}
                      disabled={roofPoints.length <= 3}
                      className="flex-1 py-1.5 rounded-lg bg-red-600/10 border border-red-500/20 active:scale-95 text-red-600 dark:text-red-400 font-semibold text-xs transition-all flex items-center justify-center gap-1 disabled:opacity-40 disabled:pointer-events-none"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Vertex
                    </button>
                  </div>
                </div>
              ) : (
                /* EDITABLE ROOF SHAPE / BOUNDS SECTION */
                <div className="flex flex-col gap-2.5 bg-primary/5 p-2.5 rounded-xl border border-primary/10 shadow-inner">
                  {/* Roof Mode Switcher (Tab segmented bar) */}
                  <div className="flex items-center justify-between text-foreground/70 text-xs font-semibold px-0.5 mb-0.5">
                    <div className="flex items-center gap-1 shrink-0">
                      <Settings className="w-3.5 h-3.5 text-secondary" />
                      <span>Roof Mode & Dimensions</span>
                    </div>
                    {/* Roof Mode Selector Tab */}
                    {!isDrawingRoof && (
                      <div className="flex bg-background border border-primary/10 p-0.5 rounded-lg text-[9px] font-bold">
                        <button
                          onClick={() => {
                            if (roofType === "polygon") {
                              if (
                                confirm(
                                  "Switching to rectangular mode will reset your custom shape. Do you want to proceed?",
                                )
                              ) {
                                setRoofType("rectangle");
                                setSelectedVertexIndex(null);
                                setSelectedId(null);
                              }
                            }
                          }}
                          className={`px-2 py-0.5 rounded-md transition-all ${
                            roofType === "rectangle"
                              ? "bg-primary text-background"
                              : "text-foreground/60"
                          }`}
                        >
                          Rectangle
                        </button>
                        <button
                          onClick={() => {
                            if (roofType === "rectangle") {
                              if (roofPoints.length === 0) {
                                setRoofPoints([
                                  { x: 0, y: 0 },
                                  { x: roofWidth * SCALE_FACTOR, y: 0 },
                                  { x: roofWidth * SCALE_FACTOR, y: roofHeight * SCALE_FACTOR },
                                  { x: 0, y: roofHeight * SCALE_FACTOR },
                                ]);
                              }
                              setRoofType("polygon");
                              setSelectedVertexIndex(null);
                              setSelectedId(null);
                            }
                          }}
                          className={`px-2 py-0.5 rounded-md transition-all ${
                            roofType === "polygon"
                              ? "bg-primary text-background"
                              : "text-foreground/60"
                          }`}
                        >
                          Polygon (Custom)
                        </button>
                      </div>
                    )}
                  </div>

                  {roofType === "rectangle" ? (
                    /* Rectangle Width / Height steppers */
                    <div className="grid grid-cols-2 gap-2">
                      {/* Width Stepper */}
                      <div className="flex items-center justify-between bg-background border border-primary/10 px-2 py-1 rounded-xl">
                        <div className="flex flex-col leading-none">
                          <span className="text-[10px] text-foreground/50 font-mono">
                            W (in):
                          </span>
                          <span className="text-[8px] text-primary/70 font-mono font-bold mt-0.5 select-none">
                            ({formatInches(roofWidth)})
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setRoofWidth((w) => Math.max(100.0, w - 20));
                              setInputTempValues((prev) => {
                                const copy = { ...prev };
                                delete copy.floorWidth;
                                return copy;
                              });
                            }}
                            className="w-6 h-6 rounded-lg bg-primary/5 border border-primary/10 text-foreground flex items-center justify-center font-black text-xs active:scale-90 active:bg-primary/10 transition-all select-none"
                          >
                            －
                          </button>
                          <div className="flex items-center justify-center font-bold font-mono text-xs text-foreground min-w-[28px]">
                            <input
                              type="text"
                              inputMode="decimal"
                              value={
                                inputTempValues["floorWidth"] !== undefined
                                  ? inputTempValues["floorWidth"]
                                  : roofWidth.toFixed(0)
                              }
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === "" || /^\d*\.?\d*$/.test(val)) {
                                  setInputTempValues((prev) => ({
                                    ...prev,
                                    floorWidth: val,
                                  }));
                                }
                              }}
                              onBlur={() => handleCommitFloorWidth(roofWidth)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter")
                                  handleCommitFloorWidth(roofWidth);
                              }}
                              className="w-8 text-center bg-transparent border-b border-transparent focus:border-primary/30 focus:bg-primary/5 rounded px-0.5 focus:outline-none transition-all py-0.5 font-bold"
                            />
                          </div>
                          <button
                            onClick={() => {
                              setRoofWidth((w) => Math.min(100000.0, w + 20));
                              setInputTempValues((prev) => {
                                const copy = { ...prev };
                                delete copy.floorWidth;
                                return copy;
                              });
                            }}
                            className="w-6 h-6 rounded-lg bg-primary/5 border border-primary/10 text-foreground flex items-center justify-center font-black text-xs active:scale-90 active:bg-primary/10 transition-all select-none"
                          >
                            ＋
                          </button>
                        </div>
                      </div>

                      {/* Height Stepper */}
                      <div className="flex items-center justify-between bg-background border border-primary/10 px-2 py-1 rounded-xl">
                        <div className="flex flex-col leading-none">
                          <span className="text-[10px] text-foreground/50 font-mono">
                            H (in):
                          </span>
                          <span className="text-[8px] text-primary/70 font-mono font-bold mt-0.5 select-none">
                            ({formatInches(roofHeight)})
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setRoofHeight((h) => Math.max(100.0, h - 20));
                              setInputTempValues((prev) => {
                                const copy = { ...prev };
                                delete copy.floorHeight;
                                return copy;
                              });
                            }}
                            className="w-6 h-6 rounded-lg bg-primary/5 border border-primary/10 text-foreground flex items-center justify-center font-black text-xs active:scale-90 active:bg-primary/10 transition-all select-none"
                          >
                            －
                          </button>
                          <div className="flex items-center justify-center font-bold font-mono text-xs text-foreground min-w-[28px]">
                            <input
                              type="text"
                              inputMode="decimal"
                              value={
                                inputTempValues["floorHeight"] !== undefined
                                  ? inputTempValues["floorHeight"]
                                  : roofHeight.toFixed(0)
                              }
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === "" || /^\d*\.?\d*$/.test(val)) {
                                  setInputTempValues((prev) => ({
                                    ...prev,
                                    floorHeight: val,
                                  }));
                                }
                              }}
                              onBlur={() => handleCommitFloorHeight(roofHeight)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter")
                                  handleCommitFloorHeight(roofHeight);
                              }}
                              className="w-8 text-center bg-transparent border-b border-transparent focus:border-primary/30 focus:bg-primary/5 rounded px-0.5 focus:outline-none transition-all py-0.5 font-bold"
                            />
                          </div>
                          <button
                            onClick={() => {
                              setRoofHeight((h) => Math.min(100000.0, h + 20));
                              setInputTempValues((prev) => {
                                const copy = { ...prev };
                                delete copy.floorHeight;
                                return copy;
                              });
                            }}
                            className="w-6 h-6 rounded-lg bg-primary/5 border border-primary/10 text-foreground flex items-center justify-center font-black text-xs active:scale-90 active:bg-primary/10 transition-all select-none"
                          >
                            ＋
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Polygon mode */
                    <div className="flex flex-col gap-2">
                      {isDrawingRoof ? (
                        /* Drawing State Controls */
                        <div className="flex flex-col gap-2 animate-in fade-in duration-200">
                          {/* Segment Entry by Measurement */}
                          <div className="bg-background border border-primary/10 p-2 rounded-xl flex flex-col gap-2">
                            <span className="text-[10px] text-foreground/50 font-bold uppercase tracking-wide">
                              Add next segment by measurement
                            </span>

                            {roofPoints.length === 0 ? (
                              <button
                                onClick={handleStartDrawingMeasurementCenter}
                                className="w-full py-1.5 rounded-lg bg-primary text-background font-bold text-xs active:scale-[0.98] transition-all"
                              >
                                Set First Vertex at Center (X: {formatInches(roofWidth / 2)}, Y: {formatInches(roofHeight / 2)})
                              </button>
                            ) : (
                              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                                {/* Length Input */}
                                <div className="flex-1 min-w-[80px] bg-primary/5 border border-primary/10 px-2 py-1 rounded-lg flex items-center justify-between">
                                  <span className="text-[9px] text-foreground/50 font-mono shrink-0 mr-1">
                                    Length:
                                  </span>
                                  <div className="flex items-center">
                                    <input
                                      type="text"
                                      value={drawLength}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === "" || /^\d*\.?\d*$/.test(val)) {
                                          setDrawLength(val);
                                        }
                                      }}
                                      className="w-10 text-center bg-transparent border-none focus:outline-none font-bold text-xs"
                                    />
                                    <span className="text-[9px] text-foreground/50 font-mono ml-0.5">in</span>
                                  </div>
                                </div>

                                {/* Direction Dropdown */}
                                <select
                                  value={drawDirection}
                                  onChange={(e) => setDrawDirection(e.target.value)}
                                  className="bg-background border border-primary/10 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none min-w-[90px]"
                                >
                                  <option value="right">Right (0°)</option>
                                  <option value="down">Down (90°)</option>
                                  <option value="left">Left (180°)</option>
                                  <option value="up">Up (270°)</option>
                                  <option value="custom">Custom Angle</option>
                                </select>

                                {/* Custom Angle Input (if custom selected) */}
                                {drawDirection === "custom" && (
                                  <div className="w-16 bg-primary/5 border border-primary/10 px-2 py-1 rounded-lg flex items-center justify-between">
                                    <input
                                      type="text"
                                      value={drawCustomAngle}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === "" || /^-?\d*$/.test(val)) {
                                          setDrawCustomAngle(val);
                                        }
                                      }}
                                      className="w-10 text-center bg-transparent border-none focus:outline-none font-bold text-xs"
                                    />
                                    <span className="text-[9px] text-foreground/50 font-mono ml-0.5">°</span>
                                  </div>
                                )}

                                <button
                                  onClick={handleAddSegmentByMeasurement}
                                  className="px-3 py-1 rounded-lg bg-secondary text-background font-bold text-xs active:scale-95 transition-all shadow-sm shrink-0"
                                >
                                  Add Point
                                </button>
                              </div>
                            )}

                            {/* Coordinate Summary breadcrumbs */}
                            {roofPoints.length > 0 && (
                              <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none max-w-full">
                                <span className="text-[8px] font-mono text-foreground/40 shrink-0">Points ({roofPoints.length}):</span>
                                {roofPoints.map((pt, idx) => (
                                  <span
                                    key={`breadcrumb-${idx}`}
                                    className="text-[8px] font-mono px-1.5 py-0.5 rounded border border-primary/5 bg-primary/5 shrink-0"
                                  >
                                    P{idx+1}: ({formatInches(pt.x / SCALE_FACTOR)}, {formatInches(pt.y / SCALE_FACTOR)})
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Action controls for drawing */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setRoofPoints((prev) => prev.slice(0, -1));
                              }}
                              disabled={roofPoints.length === 0}
                              className="flex-1 py-1.5 rounded-lg bg-background border border-primary/10 text-foreground font-semibold text-xs active:scale-95 transition-all flex items-center justify-center gap-1 disabled:opacity-40"
                            >
                              <Undo className="w-3.5 h-3.5" />
                              Undo Point
                            </button>

                            <button
                              onClick={handleFinishDrawingRoof}
                              disabled={roofPoints.length < 3}
                              className="flex-1 py-1.5 rounded-lg bg-green-600 text-white font-semibold text-xs active:scale-95 transition-all flex items-center justify-center gap-1 disabled:opacity-40"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Close Shape
                            </button>

                            <button
                              onClick={handleCancelDrawingRoof}
                              className="flex-1 py-1.5 rounded-lg bg-red-600/15 border border-red-500/20 text-red-600 dark:text-red-400 font-semibold text-xs active:scale-95 transition-all flex items-center justify-center gap-1"
                            >
                              <X className="w-3.5 h-3.5" />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* DRAWN POLYGON EDIT STATE */
                        <div className="flex gap-2 animate-in fade-in duration-200">
                          <button
                            onClick={handleStartDrawingRoof}
                            className="flex-1 py-2 rounded-xl bg-primary text-background font-bold text-xs active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Draw Custom Shape
                          </button>
                          <div className="flex-1 bg-background border border-primary/10 rounded-xl px-3 py-1 flex items-center justify-between text-xs font-semibold leading-tight">
                            <div className="flex flex-col leading-none">
                              <span className="text-[9px] text-foreground/50">Roof Boundaries</span>
                              <span className="text-[10px] text-foreground/80 font-mono mt-0.5">
                                {roofPoints.length} Vertices
                              </span>
                            </div>
                            <span className="text-[10px] text-secondary font-bold">
                              Double-click edges to insert vertices
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Primary Buttons Layout */}
              {!isDrawingRoof && (
                <div className="flex flex-col gap-2">
                  {/* Main Action Buttons */}
                  <div className="grid grid-cols-12 gap-2">
                    {/* Add Panel Button */}
                    <button
                      onClick={handleAddPanel}
                      className="col-span-6 h-11 rounded-xl bg-primary text-background font-bold text-sm flex items-center justify-center gap-1 shadow-sm active:scale-[0.98] transition-all"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      Add Panel
                    </button>

                    {/* Add Obstacle Button */}
                    <button
                      onClick={handleAddObstacle}
                      className="col-span-6 h-11 rounded-xl bg-background border border-red-500/30 text-red-600 dark:text-red-400 font-bold text-sm flex items-center justify-center gap-1 shadow-sm active:scale-[0.98] transition-all bg-red-500/5 hover:bg-red-500/10"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      Add Obstacle
                    </button>
                  </div>

                  {/* Secondary Action Buttons (Export Layout) */}
                  <button
                    onClick={handleExportLayout}
                    disabled={panels.length === 0}
                    className="w-full h-10 rounded-xl bg-background border border-primary/10 disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98] transition-all text-foreground font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Camera className="w-3.5 h-3.5 text-secondary" />
                    Export Layout Design
                  </button>
                </div>
              )}

              {/* Projected savings footer */}
              {activePanels.length > 0 && (
                <div className="flex items-center justify-between text-[9px] text-foreground/50 font-mono px-1 border-t border-primary/5 pt-2">
                  <span>
                    Est. Savings: ~৳
                    {annualSavingsBDT.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                    /yr
                  </span>
                  <span>
                    Est. Generation: ~{(systemSizeKW * 1450).toFixed(0)} kWh/yr
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="py-2.5 flex items-center justify-between text-xs text-foreground/50 font-semibold px-2 animate-in fade-in duration-200">
              <span className="font-mono text-[10px]">Controls Minimized</span>
              <button
                onClick={() => setIsFooterMinimized(false)}
                className="px-3 py-1 rounded-lg border border-primary/10 bg-primary/5 text-primary text-[10px] font-bold active:scale-95 transition-all"
              >
                Expand Controls
              </button>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
