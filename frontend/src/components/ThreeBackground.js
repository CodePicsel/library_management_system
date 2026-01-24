// components/ThreeBackground.js
import React, { useRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';

export default function ThreeBackground() {
  const rafRef = useRef(null);
  const disposedRef = useRef(false);

  const onContextCreate = async (gl) => {
    try {
      console.log('[ThreeBackground] onContextCreate start');

      const width = gl.drawingBufferWidth;
      const height = gl.drawingBufferHeight;

      const renderer = new Renderer({ gl });
      renderer.setSize(width, height);
      // Make renderer transparent
      if (renderer.setClearColor) {
        // setClearColor(hex, alpha)
        renderer.setClearColor(0x000000, 0); // fully transparent
      }
      if (gl.clearColor) {
        // ensure GL clear color alpha is 0
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
      }

      const scene = new THREE.Scene();
      scene.background = null; // no opaque background

      const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
      camera.position.set(0, 0, 4);

      // Lighting
      const ambient = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambient);
      const dir = new THREE.DirectionalLight(0xffffff, 0.8);
      dir.position.set(3, 3, 5);
      scene.add(dir);

      // Geometry: slightly larger and higher contrast
      const geometry = new THREE.TorusKnotGeometry(1.0, 0.3, 128, 32);
      const material = new THREE.MeshStandardMaterial({
        color: 0x4ade80,
        metalness: 0.3,
        roughness: 0.2,
        transparent: true,
        opacity: 0.95,
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Simple animation loop
      let last = Date.now();
      const render = () => {
        if (disposedRef.current) return;

        const now = Date.now();
        const dt = now - last;
        last = now;

        mesh.rotation.x += 0.0009 * dt;
        mesh.rotation.y += 0.0014 * dt;

        renderer.render(scene, camera);
        gl.endFrameEXP();
        rafRef.current = requestAnimationFrame(render);
      };

      render();
      console.log('[ThreeBackground] renderer started');
    } catch (err) {
      console.error('[ThreeBackground] onContextCreate error:', err);
    }
  };

  useEffect(() => {
    return () => {
      disposedRef.current = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      console.log('[ThreeBackground] unmounted and RAF cancelled');
    };
  }, []);

  // pointerEvents="none" so touches pass through to the UI
  return (
    <View style={styles.wrapper} pointerEvents="none">
      <GLView style={StyleSheet.absoluteFill} onContextCreate={onContextCreate} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    // keep wrapper transparent
  },
});
