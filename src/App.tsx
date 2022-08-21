import { Suspense, useMemo, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import * as THREE from "three";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import { MeshLine, MeshLineMaterial } from "meshline";
import Sparks from "./Sparks";
import {
  CameraShake,
  OrbitControls,
  Text3D,
  TorusKnot,
} from "@react-three/drei";
import Effects from "./Effects";
import {
  EffectComposer,
  Select,
  Selection,
  SelectiveBloom,
} from "@react-three/postprocessing";
const r = () => Math.max(0.2, Math.random());
function App() {
  const [count, setCount] = useState(0);
  const mouse = useRef([0, 0]);
  const light = useRef(null);
  const text = useRef(null);

  return (
    <div className="App">
      <Canvas camera={{ position: [0, 0, 30], fov: 100 }}>
        <fog attach="fog" args={["white", 50, 190]} />
        <pointLight ref={light} distance={100} intensity={4} color="white" />
        <OrbitControls />
        <Lines
          count={30}
          colors={[
            "#A2CCB6",
            "#FCEEB5",
            "#EE786E",
            "#e0feff",
            "lightpink",
            "lightblue",
          ]}
        />
        <Suspense fallback={null}>
          <Text3D
            ref={text}
            rotation={[0, 0.8, 0]}
            bevelSegments={5}
            scale={8}
            font="/Roboto_Regular.json"
          >
            P
            <meshNormalMaterial />
          </Text3D>
          <TorusKnot>
            <meshPhongMaterial color="blue" />
          </TorusKnot>
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;

extend({ MeshLine, MeshLineMaterial });

function Fatline({ curve, width, color, speed }) {
  const material = useRef(null);
  useFrame(() => (material.current.uniforms.dashOffset.value -= speed));
  return (
    <mesh>
      {/* @ts-ignore */}
      <meshLine attach="geometry" points={curve} />
      {/* @ts-ignore */}
      <meshLineMaterial
        attach="material"
        ref={material}
        transparent
        depthTest={false}
        lineWidth={width}
        color={color}
        dashArray={0.05}
        dashRatio={0.9}
      />
    </mesh>
  );
}

function Lines({ count, colors, radius = 10 }) {
  const lines = useMemo(
    () =>
      new Array(count).fill(0).map((_, index) => {
        const pos = new THREE.Vector3(
          Math.sin(0) * radius * r(),
          Math.cos(0) * radius * r(),
          0
        );
        const points = new Array(30).fill(0).map((_, index) => {
          const angle = (index / 20) * Math.PI * 2;
          return pos
            .add(
              new THREE.Vector3(
                Math.sin(angle) * radius * r(),
                Math.cos(angle) * radius * r(),
                0
              )
            )
            .clone();
        });
        const curve = new THREE.CatmullRomCurve3(points).getPoints(3000);
        return {
          color: colors[parseInt(colors.length * Math.random())],
          width: Math.max(0.1, (0.2 * index) / 100),
          speed: Math.max(0.001, 0.001 * Math.random()),
          curve,
        };
      }),
    [count]
  );
  return (
    <>
      <group position={[-radius * 2, -radius, -10]} scale={[1, 1.3, 1]}>
        {lines.map((props, index) => (
          <Fatline key={index} {...props} />
        ))}
      </group>
    </>
  );
}
