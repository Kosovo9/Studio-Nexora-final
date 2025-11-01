'use client';

import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Stars, OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(!!mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);
  return reduced;
}

function EarthMesh({ active }: { active: boolean }) {
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
  const accum = useRef(0);

  useFrame((_, delta) => {
    if (!active) return;
    accum.current += delta;
    const step = 1 / 48;
    if (accum.current < step) return;
    const rot = Math.min(accum.current * 0.05, 0.02);
    earthRef.current.rotation.y += rot;
    cloudsRef.current.rotation.y += rot * 1.2;
    nightRef.current.rotation.y += rot;
    accum.current = 0;
  });

  const geo = useMemo(() => new THREE.SphereGeometry(1, 96, 96), []);
  const mat = useMemo(() => new THREE.MeshPhongMaterial({
    map: dayMap, normalMap, specularMap: specMap, shininess: 12,
  }), [dayMap, normalMap, specMap]);

  const nightMat = useMemo(() => new THREE.MeshBasicMaterial({
    map: lightsMap, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.9
  }), [lightsMap]);

  const cloudMat = useMemo(() => new THREE.MeshPhongMaterial({
    map: cloudsMap, transparent: true, opacity: 0.35, depthWrite: false
  }), [cloudsMap]);

  const glowMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color('#5ab9ff'), transparent: true, opacity: 0.08, side: THREE.BackSide
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

export default function EarthCanvas({
  asBackground=false,
  pauseOnBlur=true,
  respectReducedMotion=true,
  forceStatic=false,
}: {
  asBackground?: boolean;
  pauseOnBlur?: boolean;
  respectReducedMotion?: boolean;
  forceStatic?: boolean;
}) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!pauseOnBlur) return;
    const onVis = () => setActive(document.visibilityState === 'visible');
    const onBlur = () => setActive(false);
    const onFocus = () => setActive(true);
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
    };
  }, [pauseOnBlur]);

  const [dpr, setDpr] = useState<[number, number]>([1, 1.75]);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const base = Math.max(1, Math.min(window.devicePixelRatio || 1, 1.75));
    const hi = (respectReducedMotion && reduced) ? 1.25 : base;
    setDpr([1, hi]);
  }, [reduced, respectReducedMotion]);

  // Modo Ahorro forzado (o reduced-motion del SO) -> fallback estático
  if (forceStatic || (respectReducedMotion && reduced)) {
    return (
      <div className={asBackground ? 'pointer-events-none fixed inset-0 -z-10' : 'w-full h-[80vh]'}>
        <img
          src='/assets/earth/earth_day.jpg'
          alt='Earth static'
          className={asBackground ? 'w-full h-full object-cover' : 'w-full h-full object-contain bg-black'}
        />
      </div>
    );
  }

  const starCount = (respectReducedMotion && reduced) ? 800 : 3200;

  return (
    <div className={asBackground ? 'pointer-events-none fixed inset-0 -z-10' : 'w-full h-[80vh]'} >
      <Canvas shadows dpr={dpr} camera={{ fov: 45, position: [0, 0, 3.2] }}>
        <Suspense fallback={<Html center style={{ color: '#999', fontSize: 12 }}>Loading Earth…</Html>}>
          <ambientLight intensity={0.2} />
          <directionalLight position={[4, 2, 2]} intensity={1.4} castShadow />
          <Stars radius={50} depth={80} count={starCount} factor={4} fade />
          <EarthMesh active={active} />
          {!asBackground && <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.2} />}
        </Suspense>
      </Canvas>
    </div>
  );
}
