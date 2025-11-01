'use client';

import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Stars, OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense, useMemo, useRef } from 'react';

function EarthMesh() {
  const [dayMap, normalMap, specMap, cloudsMap, lightsMap] = useLoader(THREE.TextureLoader, [
    '/assets/earth/earth_day.jpg',
    '/assets/earth/earth_normal.jpg',
    '/assets/earth/earth_spec.jpg',
    '/assets/earth/earth_clouds.png',
    '/assets/earth/earth_lights.png',
  ]);

  const earthRef = useRef<THREE.Mesh>(null!);
  const cloudsRef = useRef<THREE.Mesh>(null!);
  const nightRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    const rot = Math.min(delta * 0.05, 0.02); // suave / battery-friendly
    earthRef.current.rotation.y += rot;
    cloudsRef.current.rotation.y += rot * 1.2;
    nightRef.current.rotation.y += rot;
  });

  const geo = useMemo(() => new THREE.SphereGeometry(1, 96, 96), []);
  const mat = useMemo(() => new THREE.MeshPhongMaterial({
    map: dayMap,
    normalMap,
    specularMap: specMap,
    shininess: 12,
  }), [dayMap, normalMap, specMap]);

  // capa nocturna con city lights (blending)
  const nightMat = useMemo(() => new THREE.MeshBasicMaterial({
    map: lightsMap,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.9
  }), [lightsMap]);

  // nubes
  const cloudMat = useMemo(() => new THREE.MeshPhongMaterial({
    map: cloudsMap,
    transparent: true,
    opacity: 0.35,
    depthWrite: false
  }), [cloudsMap]);

  // halo atmosférico sencillo
  const glowMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color('#5ab9ff'),
    transparent: true,
    opacity: 0.08,
    side: THREE.BackSide
  }), []);

  return (
    <group>
      <mesh ref={earthRef} geometry={geo} material={mat} castShadow receiveShadow />
      <mesh ref={nightRef} geometry={geo} material={nightMat} />
      <mesh ref={cloudsRef} geometry={geo} material={cloudMat} scale={[1.01,1.01,1.01]} />
      <mesh geometry={geo} material={glowMat} scale={[1.08,1.08,1.08]} />
    </group>
  );
}

export default function EarthCanvas({ asBackground=false }: { asBackground?: boolean }) {
  return (
    <div className={asBackground ? 'pointer-events-none fixed inset-0 -z-10' : 'w-full h-[80vh]'} >
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ fov: 45, position: [0, 0, 3.2] }}
      >
        <Suspense fallback={<Html center style={{ color: '#999', fontSize: 12 }}>Loading Earth…</Html>}>
          <ambientLight intensity={0.2} />
          <directionalLight position={[4, 2, 2]} intensity={1.4} castShadow />
          <Stars radius={50} depth={80} count={4000} factor={4} fade />
          <EarthMesh />
          {!asBackground && <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.2} />}
        </Suspense>
      </Canvas>
    </div>
  );
}

