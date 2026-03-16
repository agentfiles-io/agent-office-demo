"use client";

// Bright, cozy isometric office — warm wood, good lighting, lived-in feel.
// Agents are AI personas "living" in this space. Cute, peekable, internet-friendly.

export default function Room() {
  return (
    <group>
      {/* Floor — bright warm wood */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[30, 26]} />
        <meshStandardMaterial color="#c4a882" metalness={0.02} roughness={0.85} />
      </mesh>

      {/* Floor grid - subtle */}
      <FloorGrid />

      {/* ALL 4 WALLS — bright warm beige/cream */}
      {/* Back wall (north) */}
      <mesh position={[0, 2.5, -13]} receiveShadow>
        <boxGeometry args={[30, 6, 0.2]} />
        <meshStandardMaterial color="#d4c4a8" roughness={0.8} />
      </mesh>
      {/* Left wall (west) */}
      <mesh position={[-15, 2.5, 0]} receiveShadow>
        <boxGeometry args={[0.2, 6, 26]} />
        <meshStandardMaterial color="#d4c4a8" roughness={0.8} />
      </mesh>
      {/* Right wall (east) */}
      <mesh position={[15, 2.5, 0]} receiveShadow>
        <boxGeometry args={[0.2, 6, 26]} />
        <meshStandardMaterial color="#cbb99d" roughness={0.8} />
      </mesh>
      {/* Front wall (south) — lower, like a half-wall so camera sees in */}
      <mesh position={[0, 1, 13]} receiveShadow>
        <boxGeometry args={[30, 2.5, 0.2]} />
        <meshStandardMaterial color="#cbb99d" roughness={0.8} />
      </mesh>

      {/* Baseboard accent strips — amber on all walls */}
      <mesh position={[0, 0.15, -12.85]}>
        <boxGeometry args={[30, 0.08, 0.08]} />
        <meshStandardMaterial color="#b8860b" emissive="#d97706" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[-14.85, 0.15, 0]}>
        <boxGeometry args={[0.08, 0.08, 26]} />
        <meshStandardMaterial color="#b8860b" emissive="#d97706" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[14.85, 0.15, 0]}>
        <boxGeometry args={[0.08, 0.08, 26]} />
        <meshStandardMaterial color="#b8860b" emissive="#d97706" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 0.15, 12.85]}>
        <boxGeometry args={[30, 0.08, 0.08]} />
        <meshStandardMaterial color="#b8860b" emissive="#d97706" emissiveIntensity={0.3} />
      </mesh>

      {/* Crown molding at top of walls */}
      <mesh position={[0, 5.45, -12.85]}>
        <boxGeometry args={[30, 0.1, 0.1]} />
        <meshStandardMaterial color="#e8d8bc" />
      </mesh>
      <mesh position={[-14.85, 5.45, 0]}>
        <boxGeometry args={[0.1, 0.1, 26]} />
        <meshStandardMaterial color="#e8d8bc" />
      </mesh>
      <mesh position={[14.85, 5.45, 0]}>
        <boxGeometry args={[0.1, 0.1, 26]} />
        <meshStandardMaterial color="#e8d8bc" />
      </mesh>

      {/* ===== FURNITURE ===== */}

      {/* Couch area — back left (moved to avoid blocking kanban board) */}
      <Couch position={[-12, 0, -3]} rotation={0.5} />
      <CoffeeTable position={[-10.5, 0, -2]} />

      {/* Bookshelves */}
      <Bookshelf position={[-5, 0, -9.3]} />
      <Bookshelf position={[-3, 0, -9.3]} />

      {/* Lamps — provide warm glow */}
      <FloorLamp position={[-11.5, 0, -4]} color="#fbbf24" />
      <FloorLamp position={[8, 0, -8]} color="#f59e0b" />
      <FloorLamp position={[3, 0, -8]} color="#fcd34d" />

      {/* Plants — cute touches */}
      <Plant position={[-12, 0, -8]} size={0.9} />
      <Plant position={[10, 0, -9]} size={0.7} />
      <Plant position={[-1, 0, 8]} size={0.6} />
      <Plant position={[12, 0, 4]} size={0.8} />
      <Plant position={[-12, 0, 5]} size={0.5} />

      {/* Rug under center area */}
      <Rug position={[0, 0.02, 0]} width={7} depth={5} color="#6b5030" />

      {/* Extra cozy rug by couch */}
      <Rug position={[-9, 0.02, -5.5]} width={4} depth={3} color="#7a5838" />

      {/* ===== ZONE FLOOR MATS — show each agent is on a different machine ===== */}
      {/* Claude zone — purple tint (swapped to right side) */}
      <Rug position={[9, 0.015, -2]} width={5} depth={4} color="#d8c8e8" />
      {/* Codex zone — blue tint */}
      <Rug position={[4, 0.015, 7]} width={5} depth={4} color="#c8d8f0" />
      {/* ChatGPT zone — orange tint (swapped to left side) */}
      <Rug position={[-8, 0.015, 4]} width={5} depth={4} color="#f0dcc8" />
      {/* OpenClaw zone — green tint */}
      <Rug position={[-6, 0.015, -5]} width={5} depth={4} color="#c8e8d0" />

      {/* Dashed floor divider lines between zones */}
      {[
        { pos: [-2, 0.02, 2] as [number, number, number], rot: 0.3, len: 8 },
        { pos: [3, 0.02, 2] as [number, number, number], rot: -0.6, len: 8 },
        { pos: [-2, 0.02, -1] as [number, number, number], rot: -0.4, len: 6 },
      ].map((line, i) => (
        <mesh key={`div-${i}`} position={line.pos} rotation={[-Math.PI / 2, 0, line.rot]}>
          <planeGeometry args={[line.len, 0.04]} />
          <meshStandardMaterial color="#9ca3af" transparent opacity={0.3} />
        </mesh>
      ))}

      {/* Water cooler */}
      <WaterCooler position={[10, 0, -8.5]} />

      {/* Extra desks (empty / decorative) */}
      <Desk position={[-10, 0, 3]} rotation={Math.PI / 4} />
      <Desk position={[10, 0, 7]} rotation={-Math.PI / 4} />

      {/* Chairs */}
      <Chair position={[-9, 0, 4]} rotation={Math.PI / 3} />
      <Chair position={[11, 0, 8]} rotation={-Math.PI / 6} />

      {/* Whiteboard */}
      <Whiteboard position={[4, 2.2, -9.7]} />

      {/* Cute wall clock on back wall */}
      <WallClock position={[-8, 3.5, -9.85]} />

      {/* Small shelf with a mug and photo frame on back wall */}
      <WallShelf position={[8, 2.5, -9.7]} />

      {/* Ceiling lights — brighter */}
      <CeilingLight position={[-6, 5.5, -3]} />
      <CeilingLight position={[4, 5.5, 1]} />
      <CeilingLight position={[-2, 5.5, 5]} />
      <CeilingLight position={[8, 5.5, -4]} />
    </group>
  );
}

/* ========== Furniture ========== */

function FloorGrid() {
  const lines = [];
  for (let i = -15; i <= 15; i += 2) {
    lines.push(
      <mesh key={`h${i}`} position={[0, 0.005, i]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 0.02]} />
        <meshStandardMaterial color="#b8a080" transparent opacity={0.25} />
      </mesh>,
      <mesh key={`v${i}`} position={[i, 0.005, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[26, 0.02]} />
        <meshStandardMaterial color="#b8a080" transparent opacity={0.25} />
      </mesh>
    );
  }
  return <>{lines}</>;
}

function Couch({ position, rotation }: { position: [number, number, number]; rotation: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[2.4, 0.4, 1]} />
        <meshStandardMaterial color="#a07850" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.7, -0.4]} castShadow>
        <boxGeometry args={[2.4, 0.5, 0.25]} />
        <meshStandardMaterial color="#8b6840" roughness={0.8} />
      </mesh>
      {[-1.1, 1.1].map((x) => (
        <mesh key={x} position={[x, 0.5, 0]} castShadow>
          <boxGeometry args={[0.2, 0.35, 1]} />
          <meshStandardMaterial color="#8b6840" roughness={0.8} />
        </mesh>
      ))}
      {/* Cute cushions */}
      {[-0.5, 0.5].map((x) => (
        <mesh key={x} position={[x, 0.6, 0.05]} castShadow>
          <boxGeometry args={[0.8, 0.18, 0.6]} />
          <meshStandardMaterial color="#dbb88a" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function CoffeeTable({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[1.2, 0.06, 0.7]} />
        <meshStandardMaterial color="#a07850" roughness={0.6} />
      </mesh>
      {[[-0.5, -0.25], [0.5, -0.25], [-0.5, 0.25], [0.5, 0.25]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.15, z]} castShadow>
          <boxGeometry args={[0.06, 0.3, 0.06]} />
          <meshStandardMaterial color="#8b6848" />
        </mesh>
      ))}
      {/* Cute tiny book on table */}
      <mesh position={[0.2, 0.36, 0]} castShadow>
        <boxGeometry args={[0.2, 0.04, 0.15]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
    </group>
  );
}

function Bookshelf({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[1.6, 3, 0.5]} />
        <meshStandardMaterial color="#8b6848" roughness={0.8} />
      </mesh>
      {[0.4, 1.2, 2.0, 2.8].map((y) => (
        <mesh key={y} position={[0, y, 0.02]} castShadow>
          <boxGeometry args={[1.4, 0.06, 0.45]} />
          <meshStandardMaterial color="#a07850" />
        </mesh>
      ))}
      {[
        { pos: [-0.4, 0.65, 0.02], color: "#dc2626", w: 0.15, h: 0.4 },
        { pos: [-0.15, 0.6, 0.02], color: "#2563eb", w: 0.12, h: 0.35 },
        { pos: [0.05, 0.65, 0.02], color: "#16a34a", w: 0.18, h: 0.4 },
        { pos: [0.3, 0.6, 0.02], color: "#d97706", w: 0.12, h: 0.3 },
        { pos: [-0.3, 1.45, 0.02], color: "#9333ea", w: 0.14, h: 0.35 },
        { pos: [0.1, 1.4, 0.02], color: "#e11d48", w: 0.2, h: 0.3 },
        { pos: [0.4, 1.45, 0.02], color: "#0891b2", w: 0.12, h: 0.4 },
        { pos: [-0.2, 2.25, 0.02], color: "#ca8a04", w: 0.16, h: 0.35 },
        { pos: [0.2, 2.3, 0.02], color: "#15803d", w: 0.18, h: 0.45 },
      ].map((book, i) => (
        <mesh key={i} position={[book.pos[0], book.pos[1], book.pos[2]]} castShadow>
          <boxGeometry args={[book.w, book.h, 0.35]} />
          <meshStandardMaterial color={book.color} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function FloorLamp({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.25, 0.1, 8]} />
        <meshStandardMaterial color="#6b5030" />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 2.8, 6]} />
        <meshStandardMaterial color="#a07850" />
      </mesh>
      <mesh position={[0, 2.8, 0]}>
        <cylinderGeometry args={[0.15, 0.3, 0.4, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} transparent opacity={0.85} />
      </mesh>
      <pointLight position={[0, 2.5, 0]} color={color} intensity={4} distance={8} castShadow />
    </group>
  );
}

function Plant({ position, size }: { position: [number, number, number]; size: number }) {
  return (
    <group position={position} scale={size}>
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.2, 0.5, 8]} />
        <meshStandardMaterial color="#b45309" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.05, 8]} />
        <meshStandardMaterial color="#6b5030" />
      </mesh>
      {[
        [0, 0.85, 0],
        [0.15, 1.05, 0.1],
        [-0.12, 0.95, -0.1],
        [0.05, 1.2, 0.05],
        [-0.08, 1.1, 0.12],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[0, i * 0.8, 0]} castShadow>
          <boxGeometry args={[0.25, 0.2, 0.25]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#22c55e" : "#16a34a"} roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

function Rug({ position, width, depth, color }: { position: [number, number, number]; width: number; depth: number; color: string }) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[width, depth]} />
      <meshStandardMaterial color={color} roughness={0.95} />
    </mesh>
  );
}

function WaterCooler({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.4, 1, 0.4]} />
        <meshStandardMaterial color="#e5e7eb" roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.12, 0.5, 8]} />
        <meshStandardMaterial color="#93c5fd" transparent opacity={0.5} roughness={0.2} />
      </mesh>
    </group>
  );
}

function Desk({ position, rotation }: { position: [number, number, number]; rotation: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.08, 0.9]} />
        <meshStandardMaterial color="#8b6848" roughness={0.7} />
      </mesh>
      {[[-0.75, -0.3], [0.75, -0.3], [-0.75, 0.3], [0.75, 0.3]].map(([dx, dz], i) => (
        <mesh key={i} position={[dx, 0.22, dz]} castShadow>
          <boxGeometry args={[0.06, 0.44, 0.06]} />
          <meshStandardMaterial color="#6b5030" />
        </mesh>
      ))}
      <mesh position={[0, 0.75, -0.2]} castShadow>
        <boxGeometry args={[0.5, 0.35, 0.04]} />
        <meshStandardMaterial color="#1f2937" emissive="#475569" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0, 0.55, -0.15]} castShadow>
        <boxGeometry args={[0.06, 0.15, 0.06]} />
        <meshStandardMaterial color="#6b7280" />
      </mesh>
    </group>
  );
}

function Chair({ position, rotation }: { position: [number, number, number]; rotation: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[0.5, 0.06, 0.5]} />
        <meshStandardMaterial color="#2563eb" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.6, -0.22]} castShadow>
        <boxGeometry args={[0.5, 0.45, 0.06]} />
        <meshStandardMaterial color="#2563eb" roughness={0.8} />
      </mesh>
      {[[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]].map(([dx, dz], i) => (
        <mesh key={i} position={[dx, 0.16, dz]}>
          <boxGeometry args={[0.04, 0.32, 0.04]} />
          <meshStandardMaterial color="#6b7280" />
        </mesh>
      ))}
    </group>
  );
}

function Whiteboard({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[2.5, 1.5, 0.08]} />
        <meshStandardMaterial color="#f9fafb" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, -0.01]}>
        <boxGeometry args={[2.6, 1.6, 0.04]} />
        <meshStandardMaterial color="#9ca3af" roughness={0.6} />
      </mesh>
      {[
        { y: 0.4, w: 1.2, color: "#2563eb" },
        { y: 0.15, w: 1.8, color: "#dc2626" },
        { y: -0.1, w: 0.9, color: "#16a34a" },
        { y: -0.35, w: 1.5, color: "#9333ea" },
      ].map((line, i) => (
        <mesh key={i} position={[-0.3, line.y, 0.05]}>
          <boxGeometry args={[line.w, 0.03, 0.01]} />
          <meshStandardMaterial color={line.color} />
        </mesh>
      ))}
    </group>
  );
}

function WallClock({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Clock face */}
      <mesh castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.06, 16]} />
        <meshStandardMaterial color="#f9fafb" roughness={0.4} />
      </mesh>
      {/* Frame */}
      <mesh>
        <cylinderGeometry args={[0.43, 0.43, 0.04, 16]} />
        <meshStandardMaterial color="#a07850" roughness={0.7} />
      </mesh>
      {/* Hour hand */}
      <mesh position={[0.05, 0, 0.04]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[0.04, 0.2, 0.01]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      {/* Minute hand */}
      <mesh position={[-0.02, 0.05, 0.04]} rotation={[0, 0, 0.8]}>
        <boxGeometry args={[0.03, 0.28, 0.01]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
    </group>
  );
}

function WallShelf({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[1.2, 0.06, 0.3]} />
        <meshStandardMaterial color="#a07850" roughness={0.7} />
      </mesh>
      {/* Photo frame */}
      <mesh position={[-0.3, 0.2, 0]} castShadow>
        <boxGeometry args={[0.25, 0.3, 0.04]} />
        <meshStandardMaterial color="#8b6914" roughness={0.6} />
      </mesh>
      {/* Tiny plant */}
      <mesh position={[0.3, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.06, 0.15, 6]} />
        <meshStandardMaterial color="#b45309" />
      </mesh>
      <mesh position={[0.3, 0.25, 0]} castShadow>
        <boxGeometry args={[0.12, 0.12, 0.12]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>
    </group>
  );
}

function CeilingLight({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[1.5, 0.08, 0.3]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.6} />
      </mesh>
      <pointLight color="#fef3c7" intensity={5} distance={12} castShadow />
    </group>
  );
}
