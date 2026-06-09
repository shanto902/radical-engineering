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

export default function SolarPlannerPage() {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const [hasMounted, setHasMounted] = useState(false);

  // Floor Dimensions
  const [roofWidth, setRoofWidth] = useState(8.0); // 8 meters
  const [roofHeight, setRoofHeight] = useState(6.0); // 6 meters

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
  }, [selectedId]);

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
    parsed = Math.min(25.0, Math.max(3.0, parsed));
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
    parsed = Math.min(18.0, Math.max(3.0, parsed));
    parsed = Math.round(parsed * 10) / 10;
    setRoofHeight(parsed);
    setInputTempValues((prev) => {
      const copy = { ...prev };
      delete copy["floorHeight"];
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
    if (isNaN(parsed)) parsed = currentPx / 50;
    parsed = Math.min(5.0, Math.max(0.5, parsed));
    const pxValue = Math.round((parsed * 50) / 5) * 5;
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
    if (isNaN(parsed)) parsed = currentPx / 50;
    parsed = Math.min(5.0, Math.max(0.5, parsed));
    const pxValue = Math.round((parsed * 50) / 5) * 5;
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

  // Calculate dynamic panel power based on dimensions: 1m x 1m = 200W density
  const getPanelPower = (widthPx: number, heightPx: number) => {
    const wMeters = widthPx / 50;
    const hMeters = heightPx / 50;
    return Math.round(wMeters * hMeters * 200);
  };

  // Add solar panel to the center
  const handleAddPanel = () => {
    const newId = `element-${Date.now()}`;
    const centerGridX = Math.round((roofWidth * 50) / 2 / 25) * 25;
    const centerGridY = Math.round((roofHeight * 50) / 2 / 25) * 25;

    const newPanel: PanelData = {
      id: newId,
      x: centerGridX,
      y: centerGridY,
      rotation: 0,
      width: 50, // 1.0m
      height: 100, // 2.0m
      type: "panel",
      power: 400, // 400W default
      tilt: 18, // 18 degrees default tilt
    };
    setPanels((prev) => [...prev, newPanel]);
    setSelectedId(newId);
  };

  // Add obstacle (stair, chimney, vent) to the center
  const handleAddObstacle = () => {
    const newId = `element-${Date.now()}`;
    const centerGridX = Math.round((roofWidth * 50) / 2 / 25) * 25;
    const centerGridY = Math.round((roofHeight * 50) / 2 / 25) * 25;

    const newObstacle: PanelData = {
      id: newId,
      x: centerGridX,
      y: centerGridY,
      rotation: 0,
      width: 50, // 1.0m
      height: 50, // 1.0m
      type: "obstacle",
    };
    setPanels((prev) => [...prev, newObstacle]);
    setSelectedId(newId);
  };

  const handleSelectPanel = (id: string | null) => {
    setSelectedId(id);
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
    }
  };

  const handleExportLayout = () => {
    if (canvasRef.current) {
      canvasRef.current.exportLayout();
    }
  };

  // Stats Calculations (ignoring obstacles)
  const activePanels = panels.filter((p) => p.type === "panel");
  const obstacles = panels.filter((p) => p.type === "obstacle");

  const systemSizeKW =
    activePanels.reduce((sum, p) => sum + (p.power || 400), 0) / 1000;

  const estimatedArea = activePanels.reduce(
    (sum, p) => sum + (p.width / 50) * (p.height / 50),
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
                m²
              </span>
            </div>
            <span className="text-base font-black text-foreground leading-none">
              {estimatedArea.toFixed(1)}
            </span>
          </div>
        </div>
      </section>

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
                      <span className="text-[10px] text-foreground/50 font-mono">
                        W:
                      </span>
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
                                : (selectedElement.width / 50).toFixed(1)
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
                            m
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
                      <span className="text-[10px] text-foreground/50 font-mono">
                        H:
                      </span>
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
                                  : (selectedElement.height / 50).toFixed(1)
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
                              m
                            </span>
                          </div>
                          {selectedElement.type === "panel" &&
                            selectedElement.tilt !== undefined &&
                            selectedElement.tilt > 0 && (
                              <span className="text-[8px] text-foreground/45 font-normal tracking-tight mt-0.5 leading-none select-none">
                                (
                                {(
                                  (selectedElement.height *
                                    Math.cos(
                                      (selectedElement.tilt * Math.PI) / 180,
                                    )) /
                                  50
                                ).toFixed(1)}
                                m)
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
              ) : (
                /* EDITABLE FLOOR DIMENSIONS ROW (When no element is selected) */
                <div className="flex flex-col gap-2.5 bg-primary/5 p-2.5 rounded-xl border border-primary/10 shadow-inner">
                  <div className="flex items-center justify-between text-foreground/70 text-xs font-semibold px-0.5">
                    <div className="flex items-center gap-1">
                      <Settings className="w-3.5 h-3.5 text-secondary" />
                      <span>Edit Floor Dimensions</span>
                    </div>
                    {obstacles.length > 0 && (
                      <span className="text-[9px] text-red-500 dark:text-red-400 font-mono">
                        {obstacles.length} Obstacle
                        {obstacles.length > 1 ? "s" : ""} placed
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Width Stepper */}
                    <div className="flex items-center justify-between bg-background border border-primary/10 px-2 py-1 rounded-xl">
                      <span className="text-[10px] text-foreground/50 font-mono">
                        W (m):
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setRoofWidth((w) => Math.max(3.0, w - 0.1));
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
                                : roofWidth.toFixed(1)
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
                            setRoofWidth((w) => Math.min(25.0, w + 0.1));
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
                      <span className="text-[10px] text-foreground/50 font-mono">
                        H (m):
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setRoofHeight((h) => Math.max(3.0, h - 0.1));
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
                                : roofHeight.toFixed(1)
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
                            setRoofHeight((h) => Math.min(18.0, h + 0.1));
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
                </div>
              )}

              {/* Primary Buttons Layout */}
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
