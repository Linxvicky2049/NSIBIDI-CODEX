import React, { useRef, useState, useEffect } from "react";
import { Camera } from "lucide-react";
import { SigilRenderer } from "./SigilRenderer";
import { OracleResult } from "../types";

interface NsibidiArCameraProps {
  currentSigilName: string;
  result: OracleResult | null;
}

export const NsibidiArCamera: React.FC<NsibidiArCameraProps> = ({
  currentSigilName,
  result,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Controls
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [opacity, setOpacity] = useState(0.85);
  const [glowIntensity, setGlowIntensity] = useState(15);
  const [colorMode, setColorMode] = useState<"cyan" | "magenta" | "gold">("cyan");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // Interactive WebGL/Canvas glowing matrix particles

  // Auto spin state
  const [autoSpin, setAutoSpin] = useState(true);

  // Stop camera stream safely
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Start camera stream
  const startCamera = async () => {
    setErrorMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((e) => console.log("Video play failed:", e));
      }
      setHasPermission(true);
    } catch (err: any) {
      console.error("Camera access error:", err);
      setHasPermission(false);
      setErrorMsg(
        err.name === "NotAllowedError"
          ? "Camera permission denied by browser settings."
          : "Could not open camera. Please verify device connection."
      );
    }
  };

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isActive]);

  // Rotations animation tick
  useEffect(() => {
    let animationId: number;
    let angle = rotation;

    const tick = () => {
      if (autoSpin && isActive) {
        angle = (angle + 0.4) % 360;
        setRotation(angle);
      }
      animationId = requestAnimationFrame(tick);
    };

    if (autoSpin && isActive) {
      animationId = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [autoSpin, isActive]);

  // Handle particle overlay background (Canvas WebGL styling)
  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || 640;
      canvas.height = canvas.parentElement?.clientHeight || 480;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Dynamic glowing matrix nodes to simulate WebGL visual space
    const particles: Array<{ x: number; y: number; r: number; speed: number; angle: number }> = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.5 + 0.2,
        angle: Math.random() * Math.PI * 2,
      });
    }

    const colorHex = {
      cyan: "rgba(0, 240, 255, ",
      magenta: "rgba(255, 0, 85, ",
      gold: "rgba(199, 143, 62, ",
    }[colorMode];

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.02;

      // Draw subtle holographic overlay grid lines
      ctx.strokeStyle = colorHex + "0.04)";
      ctx.lineWidth = 0.5;
      const step = 30;
      for (let x = 0; x < canvas.width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw orbital particles
      particles.forEach((p) => {
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;

        // Bounce boundaries
        if (p.x < 0 || p.x > canvas.width) p.angle = Math.PI - p.angle;
        if (p.y < 0 || p.y > canvas.height) p.angle = -p.angle;

        const pulseGlow = (Math.sin(time + p.x) + 1.2) * 0.4;
        ctx.fillStyle = colorHex + pulseGlow.toFixed(2) + ")";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        // Trace orbital lines to center
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const dx = p.x - cx;
        const dy = p.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          ctx.strokeStyle = colorHex + ((1 - dist / 180) * 0.08).toFixed(2) + ")";
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(cx, cy);
          ctx.stroke();
        }
      });

      // Target reticle HUD bounds
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      ctx.strokeStyle = colorHex + "0.25)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      // top-left angle bracket
      ctx.moveTo(cx - 100, cy - 80);
      ctx.lineTo(cx - 100, cy - 100);
      ctx.lineTo(cx - 80, cy - 100);
      // top-right
      ctx.moveTo(cx + 80, cy - 100);
      ctx.lineTo(cx + 100, cy - 100);
      ctx.lineTo(cx + 100, cy - 80);
      // bottom-left
      ctx.moveTo(cx - 100, cy + 80);
      ctx.lineTo(cx - 100, cy + 100);
      ctx.lineTo(cx - 80, cy + 100);
      // bottom-right
      ctx.moveTo(cx + 80, cy + 100);
      ctx.lineTo(cx + 100, cy + 100);
      ctx.lineTo(cx + 100, cy + 80);
      ctx.stroke();

      // Core scanning line
      const scanY = cy + Math.sin(time * 1.5) * 100;
      const scanGrad = ctx.createLinearGradient(cx - 100, scanY, cx + 100, scanY);
      scanGrad.addColorStop(0, "rgba(255,255,255,0)");
      scanGrad.addColorStop(0.5, colorHex + "0.4)");
      scanGrad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.strokeStyle = scanGrad;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(cx - 100, scanY);
      ctx.lineTo(cx + 100, scanY);
      ctx.stroke();

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isActive, colorMode]);

  // Snap photo logic: Merges video stream frame & overlay canvas & vector sigil into JPEG
  const snapPhoto = () => {
    if (!videoRef.current || !captureCanvasRef.current || !result) return;

    const video = videoRef.current;
    const canvas = captureCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set size to matches camera format
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    // 1. Draw Camera Stream Background Frame (mirrored option could exist)
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 2. Setup colors based on mode
    const mainColor = {
      cyan: "#00f0ff",
      magenta: "#ff0055",
      gold: "#c78f3e",
    }[colorMode];

    // 3. Draw Holographic Target Scope on Photo
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    
    ctx.strokeStyle = mainColor;
    ctx.lineWidth = 1.5;
    ctx.shadowColor = mainColor;
    ctx.shadowBlur = 10;
    
    // Tiny center reticle
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.stroke();

    // 4. Draw Floating Vector Sigil Aligned with UI transformation
    const sigilSize = Math.min(canvas.width, canvas.height) * 0.35 * scale;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((rotation * Math.PI) / 180);

    // Render outer rings
    ctx.strokeStyle = mainColor;
    ctx.lineWidth = 3;
    ctx.shadowColor = mainColor;
    ctx.shadowBlur = glowIntensity;
    ctx.globalAlpha = opacity;

    ctx.beginPath();
    ctx.arc(0, 0, sigilSize, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, sigilSize * 0.92, 0, Math.PI * 2);
    ctx.stroke();

    // Draw the active sigil elements using canvas lines
    const elements = result.symbolElements;
    const coordScale = (sigilSize * 0.95) / 100; // Scales 100px elements to actual size

    ctx.strokeStyle = mainColor;
    ctx.fillStyle = mainColor;

    elements.forEach((el) => {
      const fw = (el.fw ?? 2) * coordScale * 0.8;
      ctx.lineWidth = Math.max(1, fw);

      if (el.t === "c") {
        const r = (el.r ?? 30) * coordScale;
        const x = ((el.cx ?? 100) - 100) * coordScale;
        const y = ((el.cy ?? 100) - 100) * coordScale;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        if (el.f) ctx.fill();
        else ctx.stroke();
      } else if (el.t === "l") {
        const x1 = ((el.x1 ?? 100) - 100) * coordScale;
        const y1 = ((el.y1 ?? 50) - 100) * coordScale;
        const x2 = ((el.x2 ?? 100) - 100) * coordScale;
        const y2 = ((el.y2 ?? 150) - 100) * coordScale;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      } else if (el.t === "d") {
        const x = ((el.cx ?? 100) - 100) * coordScale;
        const y = ((el.cy ?? 100) - 100) * coordScale;
        const r = (el.r ?? 4) * coordScale;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      } else if (el.t === "p" || el.t === "pl") {
        const ptsStr = el.pts || "";
        const pairs = ptsStr.split(" ");
        if (pairs.length > 1) {
          ctx.beginPath();
          pairs.forEach((ptStr, idx) => {
            const pt = ptStr.split(",");
            if (pt.length === 2) {
              const x = (parseFloat(pt[0]) - 100) * coordScale;
              const y = (parseFloat(pt[1]) - 100) * coordScale;
              if (idx === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
          });
          if (el.t === "p") {
            ctx.closePath();
            if (el.f) ctx.fill();
            else ctx.stroke();
          } else {
            ctx.stroke();
          }
        }
      }
    });

    // Draw central dot
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow & translate changes
    ctx.restore();

    // 5. Draw Watermark info on bottom right
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = "#ffffff";
    ctx.font = "italic 14px Georgia";
    ctx.fillText(`${currentSigilName.toUpperCase()} ALIGNMENT`, 40, canvas.height - 50);
    ctx.font = "bold 9px monospace";
    ctx.fillStyle = mainColor;
    ctx.fillText("NSIBIDI CODEX AR SCOPE • ACTIVE TRANSMISSION LOGSF30", 40, canvas.height - 32);

    // Save as dynamic download
    const url = canvas.toDataURL("image/jpeg", 0.95);
    const link = document.createElement("a");
    link.href = url;
    link.download = `nsibidi-ar-capture-${currentSigilName.toLowerCase()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-card border border-cyber-blue/15 p-6 rounded-xl relative overflow-hidden mb-12">
      <div className="absolute top-0 right-0 w-48 h-48 bg-cyber-blue/[0.01] pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
        <div>
          <h2 className="font-display text-lg font-black uppercase tracking-wider text-white">
            WebGL AR Cosmic Camera Overlay
          </h2>
          <p className="text-xs text-ash mt-1 leading-relaxed max-w-xl">
            Authorize camera stream access to overlay your custom {currentSigilName} alignment sigil onto real-world frames in real-time. Size, rotate, calibrate and capture your seal anywhere on Earth.
          </p>
        </div>

        <div>
          {!isActive ? (
            <button
              onClick={() => setIsActive(true)}
              className="px-6 py-3.5 bg-cyber-blue text-black font-cinzel text-xs font-bold tracking-widest uppercase rounded-lg hover:bg-cyber-magenta hover:text-white transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
            >
              <Camera className="w-4 h-4" />
              Initialize AR Scope
            </button>
          ) : (
            <button
              onClick={() => {
                setIsActive(false);
                stopCamera();
              }}
              className="px-5 py-3 border border-red-500 bg-red-950/20 hover:bg-red-600 text-white font-mono text-xs font-semibold tracking-wider uppercase rounded-lg transition-all cursor-pointer"
            >
              Dismiss Scope
            </button>
          )}
        </div>
      </div>

      {isActive && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Stream display section */}
          <div className="lg:col-span-8 relative rounded-xl border border-cyber-blue/20 overflow-hidden bg-black/95 aspect-video flex items-center justify-center">
            
            {/* Real HTML5 webcam stream */}
            <video
              ref={videoRef}
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
              style={{ transform: "scaleX(-1)" }} // Mirror image for intuitive movement
            />

            {/* Matrix overlay scope grid lines */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 z-10 pointer-events-none"
            />

            {/* Float Vector Overlay Sigil aligned dynamically on stream center */}
            {result && (
              <div 
                className="absolute z-20 pointer-events-none transition-transform"
                style={{
                  transform: `rotate(${rotation}deg) scale(${scale})`,
                  opacity: opacity,
                  filter: `drop-shadow(0 0 ${glowIntensity}px ${{
                    cyan: "rgba(0,240,255,0.95)",
                    magenta: "rgba(255,0,85,0.95)",
                    gold: "rgba(199,143,62,0.95)",
                  }[colorMode]})`,
                }}
              >
                <div className="w-48 h-48 md:w-56 md:h-56 p-4">
                  <SigilRenderer name={currentSigilName} elements={result.symbolElements} className="w-full h-full" />
                </div>
              </div>
            )}

            {/* Scanning HUD borders */}
            <div className="absolute top-4 left-4 z-20 font-mono text-[9px] text-[#00f0ff] uppercase bg-black/60 px-2.5 py-1 rounded border border-cyber-blue/20">
              AR FEED LIVE F30
            </div>

            <div className="absolute bottom-4 left-4 z-20 font-mono text-[9px] text-cyber-magenta uppercase bg-black/60 px-2.5 py-1 rounded border border-cyber-blue/20">
              Active Sigil: {currentSigilName}
            </div>

            {/* Snap Button on Viewport lower rim */}
            {hasPermission && (
              <button
                onClick={snapPhoto}
                className="absolute bottom-4 right-4 z-30 bg-cyber-blue hover:bg-cyber-magenta text-black hover:text-white font-cinzel font-bold text-xs tracking-widest px-5 py-3 rounded-lg flex items-center gap-2 hover:scale-105 transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                <span>Snap Cosmic Photo</span>
              </button>
            )}

            {/* Handle missing permissions or errors */}
            {hasPermission === false && (
              <div className="absolute inset-x-8 inset-y-8 z-30 bg-black/90 p-6 rounded-lg text-center flex flex-col items-center justify-center border border-red-500/40">
                <p className="text-red-400 font-mono text-xs uppercase mb-2">Camera Connection Blocked</p>
                <p className="text-ash text-xs mb-4">{errorMsg || "Requested device permissions denied."}</p>
                <button
                  onClick={startCamera}
                  className="px-4 py-2 border border-cyber-blue font-mono text-xs font-semibold text-cyber-blue hover:bg-cyber-blue hover:text-black rounded transition-all cursor-pointer"
                >
                  Request Access Permission again
                </button>
              </div>
            )}
          </div>

          {/* Configuration dials section */}
          <div className="lg:col-span-4 glass-card border border-cyber-blue/15 p-6 rounded-xl space-y-6">
            <h3 className="font-mono text-[10px] text-cyber-magenta tracking-[3px] uppercase border-b border-cyber-blue/15 pb-2 font-bold select-none">
              HUD Scope Parameters
            </h3>

            {/* Color mode switcher */}
            <div className="space-y-2">
              <label className="block text-[9px] font-mono text-ash uppercase tracking-wider select-none">
                Holographic Aura Color
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "cyan", hex: "bg-[#00f0ff]" },
                  { value: "magenta", hex: "bg-[#ff0055]" },
                  { value: "gold", hex: "bg-[#c78f3e]" },
                ].map((col) => (
                  <button
                    key={col.value}
                    onClick={() => setColorMode(col.value as any)}
                    className={`py-2 px-1 text-[8px] font-mono tracking-widest uppercase rounded border transition-all cursor-pointer font-bold ${
                      colorMode === col.value
                        ? "border-white bg-[#010915] text-white shadow-md font-semibold"
                        : "border-cyber-blue/15 hover:border-cyber-blue text-ash"
                    }`}
                  >
                    <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${col.hex}`} />
                    {col.value}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider 1: Scale */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[9px] font-mono text-ash">
                <span className="uppercase tracking-wider">Sigil Lens Scale</span>
                <span className="text-white">{(scale * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.4"
                max="1.7"
                step="0.05"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full accent-cyber-blue"
              />
            </div>

            {/* Slider 2: Rotation */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[9px] font-mono text-ash">
                <span className="uppercase tracking-wider">Manual Frame Angle</span>
                <span className="text-white">{rotation.toFixed(0)} deg</span>
              </div>
              <input
                type="range"
                min="0"
                max="359"
                step="1"
                value={rotation}
                onChange={(e) => {
                  setRotation(parseInt(e.target.value));
                  setAutoSpin(false); // Stop auto spin when manually overridden
                }}
                className="w-full accent-cyber-blue"
              />
            </div>

            {/* Slider 3: Opacity */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[9px] font-mono text-ash">
                <span className="uppercase tracking-wider">Hologram Density</span>
                <span className="text-white">{(opacity * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-full accent-cyber-blue"
              />
            </div>

            {/* Slider 4: Glow */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[9px] font-mono text-ash">
                <span className="uppercase tracking-wider">Glow Radiance Radius</span>
                <span className="text-white">{glowIntensity}px</span>
              </div>
              <input
                type="range"
                min="2"
                max="30"
                step="1"
                value={glowIntensity}
                onChange={(e) => setGlowIntensity(parseInt(e.target.value))}
                className="w-full accent-cyber-blue"
              />
            </div>

            <div className="border-t border-cyber-blue/15 pt-4 flex items-center justify-between select-none">
              <span className="text-[9px] font-mono text-ash uppercase tracking-wider">Auto Orbital Rotation</span>
              <button
                onClick={() => setAutoSpin(!autoSpin)}
                className={`px-3 py-1.5 text-[8px] font-mono tracking-widest uppercase rounded border transition-all cursor-pointer font-bold ${
                  autoSpin
                    ? "bg-cyber-blue text-black border-cyber-blue"
                    : "border-cyber-blue/15 text-ash"
                }`}
              >
                {autoSpin ? "ENABLED" : "PAUSED"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offscreen hidden capture canvas */}
      <canvas ref={captureCanvasRef} className="hidden" />
    </div>
  );
};
