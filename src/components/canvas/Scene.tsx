"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, TorusKnot, Environment, Float, ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import { useRef } from "react";
import { DitherEffect } from "./DitherEffect";
import * as THREE from "three";

function RotatingShape() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.2;
            meshRef.current.rotation.y += delta * 0.3;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <TorusKnot ref={meshRef} args={[1, 0.3, 128, 16]} position={[0, 0, 0]}>
                <meshStandardMaterial
                    color="#5a6b4a"
                    roughness={0.3}
                    metalness={0.6}
                    emissive="#5a6b4a"
                    emissiveIntensity={0.1}
                />
            </TorusKnot>
        </Float>
    );
}

export default function Scene() {
    return (
        <div className="fixed inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <color attach="background" args={["#0f0f0f"]} />

                <ambientLight intensity={0.4} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={8} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={3} color="#5a6b4a" />

                <RotatingShape />

                <ContactShadows resolution={1024} scale={10} blur={2} opacity={0.5} far={10} color="#000000" />

                <Environment preset="city" />

                <EffectComposer enableNormalPass={false}>
                    <Bloom luminanceThreshold={0.5} mipmapBlur intensity={0.8} radius={0.5} />
                    <Noise opacity={0.03} />
                    <Vignette eskil={false} offset={0.1} darkness={1.1} />
                    <DitherEffect pixelSize={3.0} />
                </EffectComposer>

                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
            </Canvas>
        </div>
    );
}
