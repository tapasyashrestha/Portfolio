import { useState, useRef, useMemo, useEffect } from "react";

const techStack = [
  { name: "React.js", icon: "https://cdn.simpleicons.org/react/61DAFB", color: "#61DAFB" },
  { name: "TypeScript", icon: "https://cdn.simpleicons.org/typescript/3178C6", color: "#3178C6" },
  { name: "Python", icon: "https://cdn.simpleicons.org/python/3776AB", color: "#3776AB" },
  { name: "PyTorch", icon: "https://cdn.simpleicons.org/pytorch/EE4C2C", color: "#EE4C2C" },
  { name: "Scikit-Learn", icon: "https://cdn.simpleicons.org/scikitlearn/F7931E", color: "#F7931E" },
  { name: "Pandas", icon: "https://cdn.simpleicons.org/pandas/150458", color: "#150458" },
  { name: "NumPy", icon: "https://cdn.simpleicons.org/numpy/013243", color: "#013243" },
  { name: "FastAPI", icon: "https://cdn.simpleicons.org/fastapi/009688", color: "#009688" },
  { name: "PostgreSQL", icon: "https://cdn.simpleicons.org/postgresql/4169E1", color: "#4169E1" },
  { name: "Firebase", icon: "https://cdn.simpleicons.org/firebase/FFCA28", color: "#FFCA28" },
  { name: "Tailwind CSS", icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4", color: "#06B6D4" },
  { name: "Git", icon: "https://cdn.simpleicons.org/git/F05032", color: "#F05032" },
  { name: "Vite", icon: "https://cdn.simpleicons.org/vite/646CFF", color: "#646CFF" },
  { name: "HTML5", icon: "https://cdn.simpleicons.org/html5/E34F26", color: "#E34F26" },
  { name: "CSS3", icon: "https://cdn.simpleicons.org/css/1572B6", color: "#1572B6" },
  { name: "JavaScript", icon: "https://cdn.simpleicons.org/javascript/F7DF1E", color: "#F7DF1E" },
];

export default function TechSphere() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const [cursorStyle, setCursorStyle] = useState<"grab" | "grabbing">("grab");

  const rotX = useRef(0.3);
  const rotY = useRef(0);
  const velX = useRef(0);
  const velY = useRef(0.004);
  const isDragging = useRef(false);
  const lastMX = useRef(0);
  const lastMY = useRef(0);
  const dragVX = useRef(0);
  const dragVY = useRef(0);
  const rafId = useRef<number | undefined>(undefined);
  const itemEls = useRef<HTMLDivElement[]>([]);

  const n = techStack.length;

  // Fibonacci sphere positions on unit sphere
  const positions = useMemo(() => {
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    return Array.from({ length: n }, (_, i) => {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;
      return { x: Math.cos(theta) * r, y, z: Math.sin(theta) * r };
    });
  }, [n]);

  function project(pos: { x: number; y: number; z: number }, rx: number, ry: number) {
    const cosY = Math.cos(ry), sinY = Math.sin(ry);
    const x1 = pos.x * cosY - pos.z * sinY;
    const z1 = pos.x * sinY + pos.z * cosY;
    const cosX = Math.cos(rx), sinX = Math.sin(rx);
    const y2 = pos.y * cosX - z1 * sinX;
    const z2 = pos.y * sinX + z1 * cosX;
    return { x: x1, y: y2, z: z2 };
  }

  useEffect(() => {
    const els = itemEls.current;

    function render() {
      if (!sceneRef.current) return;
      
      const containerWidth = sceneRef.current.clientWidth;
      const containerHeight = sceneRef.current.clientHeight;
      
      const radiusX = containerWidth * 0.42; // Expanded horizontally
      const radiusY = containerHeight * 0.38; // Expanded vertically
      const centerX = containerWidth / 2;
      const centerY = containerHeight / 2;
      
      const minDimension = Math.min(containerWidth, containerHeight);
      const itemSize = Math.min(76, minDimension * 0.16); // Items scale dynamically
      const halfItem = itemSize / 2;

      if (!isDragging.current) {
        rotY.current += velY.current;
        rotX.current += velX.current;
        velX.current *= 0.97;
        velY.current = velY.current * 0.99 + 0.004 * 0.01;
        if (rotX.current > 0.6) velX.current -= 0.0005;
        if (rotX.current < -0.1) velX.current += 0.0005;
      }

      const projected = positions.map((pos, i) => ({
        el: els[i],
        p: project(pos, rotX.current, rotY.current),
      }));

      projected
        .slice()
        .sort((a, b) => a.p.z - b.p.z)
        .forEach(({ el, p }, idx) => {
          if (!el) return;
          const x = p.x * radiusX + centerX - halfItem;
          const y = p.y * radiusY + centerY - halfItem;
          const depth = (p.z + 1) / 2;
          const opacity = 0.25 + depth * 0.75;
          const scale = 0.55 + depth * 0.55;
          
          el.style.left = `${x}px`;
          el.style.top = `${y}px`;
          el.style.opacity = `${opacity}`;
          el.style.transform = `scale(${scale})`;
          el.style.zIndex = `${idx}`;
          el.style.width = `${itemSize}px`;
          el.style.height = `${itemSize}px`;
        });

      rafId.current = requestAnimationFrame(render);
    }

    rafId.current = requestAnimationFrame(render);
    return () => { if (rafId.current) cancelAnimationFrame(rafId.current); };
  }, [positions]);

  // Mouse drag handlers
  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    setCursorStyle("grabbing");
    lastMX.current = e.clientX;
    lastMY.current = e.clientY;
    dragVX.current = 0;
    dragVY.current = 0;
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastMX.current;
      const dy = e.clientY - lastMY.current;
      dragVX.current = dy * 0.005;
      dragVY.current = dx * 0.005;
      rotX.current += dragVX.current;
      rotY.current += dragVY.current;
      lastMX.current = e.clientX;
      lastMY.current = e.clientY;
    };
    
    const onMouseUp = () => {
      if (isDragging.current) {
        velX.current = dragVX.current;
        velY.current = dragVY.current || 0.004;
        isDragging.current = false;
        setCursorStyle("grab");
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  // Touch drag handlers
  const onTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    setCursorStyle("grabbing");
    lastMX.current = e.touches[0].clientX;
    lastMY.current = e.touches[0].clientY;
    dragVX.current = 0;
    dragVY.current = 0;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const dx = e.touches[0].clientX - lastMX.current;
    const dy = e.touches[0].clientY - lastMY.current;
    dragVX.current = dy * 0.005;
    dragVY.current = dx * 0.005;
    rotX.current += dragVX.current;
    rotY.current += dragVY.current;
    lastMX.current = e.touches[0].clientX;
    lastMY.current = e.touches[0].clientY;
  };

  const onTouchEnd = () => {
    velX.current = dragVX.current;
    velY.current = dragVY.current || 0.004;
    isDragging.current = false;
    setCursorStyle("grab");
  };

  return (
    <div className="tech-sphere-wrapper">
      {/* Decorative subtitle */}
      <div className="sphere-subtitle-wrap">
        <div className="sphere-line-left" />
        <span className="sphere-subtitle">
          ✦ Drag to rotate skills ✦
        </span>
        <div className="sphere-line-right" />
      </div>

      {/* Sphere Container */}
      <div
        ref={containerRef}
        className="sphere-container"
        style={{ cursor: cursorStyle }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Dynamic Scene */}
        <div
          ref={sceneRef}
          className="sphere-scene"
        >
          {techStack.map((tech, i) => (
            <div
              key={tech.name}
              ref={(el) => { if (el) itemEls.current[i] = el; }}
              className="sphere-item-wrapper"
            >
              <div
                className="sphere-item"
                style={{
                  boxShadow: `0 4px 12px rgba(0, 0, 0, 0.01), 0 0 16px -4px ${tech.color}35`,
                }}
              >
                <img
                  src={tech.icon}
                  alt={tech.name}
                  loading="lazy"
                  className="sphere-item-icon"
                />
                <span className="sphere-item-text">
                  {tech.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
