import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Eye, EyeOff, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { Tool3D, ToolHotspot, ToolModelPreset } from '../types/academy';

interface ThreeToolViewportProps {
  tool: Tool3D;
  selectedHotspotId: string | null;
  onSelectHotspot: (hotspot: ToolHotspot | null) => void;
}

interface ProjectedHotspot {
  hotspot: ToolHotspot;
  x: number;
  y: number;
  visible: boolean;
}

const _projVec = new THREE.Vector3();

function detectSoftwareWebGL(): boolean {
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

function createBristleTexture(tipColor: string, baseColor: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, tipColor);
    grad.addColorStop(0.28, '#D7B5AD');
    grad.addColorStop(0.7, baseColor);
    grad.addColorStop(1, '#583A3B');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Procedural fine hair strands
    for (let i = 0; i < 420; i++) {
      const x = (i / 420) * 512 + (Math.sin(i * 19.3) * 1.2);
      const alpha = 0.08 + ((i * 7) % 10) * 0.018;
      ctx.strokeStyle = i % 2 === 0 ? `rgba(255, 240, 236, ${alpha})` : `rgba(54, 28, 35, ${alpha})`;
      ctx.lineWidth = i % 3 === 0 ? 1.4 : 0.8;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + Math.sin(i) * 2.5, 512);
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

function createSpongeTexture(): { colorTex: THREE.CanvasTexture; bumpTex: THREE.CanvasTexture } {
  const cCanvas = document.createElement('canvas');
  cCanvas.width = 256;
  cCanvas.height = 256;
  const cCtx = cCanvas.getContext('2d');

  const bCanvas = document.createElement('canvas');
  bCanvas.width = 256;
  bCanvas.height = 256;
  const bCtx = bCanvas.getContext('2d');

  if (cCtx && bCtx) {
    cCtx.fillStyle = '#F0A4B5';
    cCtx.fillRect(0, 0, 256, 256);
    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, 256, 256);

    for (let i = 0; i < 4200; i++) {
      const x = (Math.sin(i * 12.9898) * 43758.5453) % 1;
      const y = (Math.sin(i * 78.233) * 43758.5453) % 1;
      const px = Math.abs(x) * 256;
      const py = Math.abs(y) * 256;
      const r = 0.7 + (i % 3) * 0.4;
      cCtx.fillStyle = i % 2 === 0 ? 'rgba(255, 210, 220, 0.25)' : 'rgba(182, 95, 118, 0.16)';
      cCtx.beginPath();
      cCtx.arc(px, py, r, 0, Math.PI * 2);
      cCtx.fill();

      bCtx.fillStyle = i % 2 === 0 ? '#A5A5A5' : '#525252';
      bCtx.beginPath();
      bCtx.arc(px, py, r, 0, Math.PI * 2);
      bCtx.fill();
    }
  }

  const colorTex = new THREE.CanvasTexture(cCanvas);
  colorTex.colorSpace = THREE.SRGBColorSpace;
  colorTex.wrapS = THREE.RepeatWrapping;
  colorTex.wrapT = THREE.RepeatWrapping;
  colorTex.repeat.set(3, 3);

  const bumpTex = new THREE.CanvasTexture(bCanvas);
  bumpTex.wrapS = THREE.RepeatWrapping;
  bumpTex.wrapT = THREE.RepeatWrapping;
  bumpTex.repeat.set(3, 3);

  return { colorTex, bumpTex };
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 128, 12, 128, 128, 118);
    grad.addColorStop(0, 'rgba(65, 34, 48, 0.26)');
    grad.addColorStop(0.55, 'rgba(65, 34, 48, 0.09)');
    grad.addColorStop(1, 'rgba(65, 34, 48, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function buildToolModel(preset: ToolModelPreset, maxAnisotropy: number): THREE.Group {
  const root = new THREE.Group();

  const roseGoldMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#DDA28F'),
    metalness: 0.92,
    roughness: 0.2,
    clearcoat: 0.35,
    clearcoatRoughness: 0.2,
  });

  const satinPlumMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#4B2239'),
    metalness: 0.14,
    roughness: 0.38,
    clearcoat: 0.5,
    clearcoatRoughness: 0.28,
  });

  const siliconePinkMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#F2B1BE'),
    metalness: 0.02,
    roughness: 0.72,
  });

  if (preset === 'contour_brush' || preset === 'foundation_brush' || preset === 'eyeshadow_brush') {
    const bristleTex = createBristleTexture('#EAD5CF', '#8D6660');
    bristleTex.anisotropy = maxAnisotropy;
    const bristleMat = new THREE.MeshStandardMaterial({
      map: bristleTex,
      roughness: 0.86,
      metalness: 0.02,
    });

    const isEye = preset === 'eyeshadow_brush';
    const isFoundation = preset === 'foundation_brush';
    const isContour = preset === 'contour_brush';

    const rScale = isEye ? 0.62 : isFoundation ? 1.05 : 1.0;

    // 1. Ergonomic Tapered Satin Plum Handle (LatheGeometry)
    const handlePts = [
      new THREE.Vector2(0.0, -1.55),
      new THREE.Vector2(0.08 * rScale, -1.53),
      new THREE.Vector2(0.115 * rScale, -1.35),
      new THREE.Vector2(0.145 * rScale, -0.75),
      new THREE.Vector2(0.18 * rScale, -0.15),
      new THREE.Vector2(0.195 * rScale, 0.08),
      new THREE.Vector2(0.0, 0.08),
    ];
    const handleGeo = new THREE.LatheGeometry(handlePts, 40);
    const handleMesh = new THREE.Mesh(handleGeo, satinPlumMat);
    handleMesh.castShadow = true;
    root.add(handleMesh);

    // 2. Rose-Gold End Cap & Sculpted Handle Inlay (matching Screenshot 1)
    const capGeo = new THREE.SphereGeometry(0.095 * rScale, 28, 20);
    const capMesh = new THREE.Mesh(capGeo, roseGoldMat);
    capMesh.position.set(0, -1.48, 0);
    capMesh.scale.set(1, 1.35, 1);
    root.add(capMesh);

    if (isContour) {
      const inlayCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -0.62, 0.145),
        new THREE.Vector3(0.01, -1.04, 0.125),
        new THREE.Vector3(0, -1.44, 0.082),
      ]);
      const inlayGeo = new THREE.TubeGeometry(inlayCurve, 24, 0.022, 12, false);
      const inlayMesh = new THREE.Mesh(inlayGeo, roseGoldMat);
      root.add(inlayMesh);
    }

    // 3. Crimped Rose-Gold Metal Ferrule (LatheGeometry + twin rings)
    const ferrulePts = [
      new THREE.Vector2(0.195 * rScale, 0.06),
      new THREE.Vector2(0.205 * rScale, 0.12),
      new THREE.Vector2(0.215 * rScale, 0.22),
      new THREE.Vector2(0.245 * rScale, 0.65),
      new THREE.Vector2(0.275 * rScale, 0.96),
      new THREE.Vector2(0.255 * rScale, 0.99),
      new THREE.Vector2(0.0, 0.99),
    ];
    const ferruleGeo = new THREE.LatheGeometry(ferrulePts, 44);
    const ferruleMesh = new THREE.Mesh(ferruleGeo, roseGoldMat);
    ferruleMesh.castShadow = true;
    root.add(ferruleMesh);

    // Double embossed crimp rings on ferrule
    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(0.206 * rScale, 0.015 * rScale, 14, 40),
      roseGoldMat
    );
    ring1.rotation.x = Math.PI / 2;
    ring1.position.y = 0.14;
    root.add(ring1);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(0.214 * rScale, 0.013 * rScale, 14, 40),
      roseGoldMat
    );
    ring2.rotation.x = Math.PI / 2;
    ring2.position.y = 0.21;
    root.add(ring2);

    // 4. Sculpted Synthetic Bristles Crown
    let bristlePts: THREE.Vector2[];
    if (isFoundation) {
      bristlePts = [
        new THREE.Vector2(0.245 * rScale, 0.94),
        new THREE.Vector2(0.315 * rScale, 1.18),
        new THREE.Vector2(0.335 * rScale, 1.44),
        new THREE.Vector2(0.305 * rScale, 1.56),
        new THREE.Vector2(0.18 * rScale, 1.6),
        new THREE.Vector2(0.0, 1.61),
      ];
    } else if (isEye) {
      bristlePts = [
        new THREE.Vector2(0.24 * rScale, 0.95),
        new THREE.Vector2(0.35 * rScale, 1.24),
        new THREE.Vector2(0.32 * rScale, 1.52),
        new THREE.Vector2(0.2 * rScale, 1.72),
        new THREE.Vector2(0.0, 1.8),
      ];
    } else {
      // Contour brush flared bristles
      bristlePts = [
        new THREE.Vector2(0.248, 0.94),
        new THREE.Vector2(0.34, 1.16),
        new THREE.Vector2(0.41, 1.44),
        new THREE.Vector2(0.37, 1.62),
        new THREE.Vector2(0.21, 1.69),
        new THREE.Vector2(0.0, 1.71),
      ];
    }

    const bristleGeo = new THREE.LatheGeometry(bristlePts, 48);

    // Shape Contour Brush with signature angled bevel and slight oval pinch
    if (isContour) {
      const pos = bristleGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        let y = pos.getY(i);
        const z = pos.getZ(i) * 0.72; // oval pinch
        const t = Math.max(0, (y - 0.96) / 0.75);
        y += x * 0.44 * t; // sculpted diagonal bevel
        pos.setXYZ(i, x, y, z);
      }
      pos.needsUpdate = true;
      bristleGeo.computeVertexNormals();
    }

    const bristleMesh = new THREE.Mesh(bristleGeo, bristleMat);
    bristleMesh.castShadow = true;
    root.add(bristleMesh);

    // Subtle secondary outer halo fluff layer for tactile realism
    const fluffMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#E8CEC7'),
      roughness: 0.95,
      metalness: 0,
      transparent: true,
      opacity: 0.22,
    });
    const fluffMesh = new THREE.Mesh(bristleGeo, fluffMat);
    fluffMesh.scale.set(1.03, 1.015, 1.03);
    root.add(fluffMesh);

    // Angle the Contour Brush gracefully like Screenshot 1
    if (isContour) {
      root.rotation.z = 0.46;
      root.position.set(0.02, -0.08, 0);
    } else {
      root.rotation.z = 0.12;
      root.position.set(0, -0.08, 0);
    }
  } else if (preset === 'beauty_blender') {
    const { colorTex, bumpTex } = createSpongeTexture();
    colorTex.anisotropy = maxAnisotropy;

    const spongeMat = new THREE.MeshStandardMaterial({
      map: colorTex,
      bumpMap: bumpTex,
      bumpScale: 0.015,
      roughness: 0.92,
      metalness: 0.0,
    });

    // Classic teardrop profile
    const spongePts = [
      new THREE.Vector2(0.0, -1.05),
      new THREE.Vector2(0.32, -1.03),
      new THREE.Vector2(0.62, -0.88),
      new THREE.Vector2(0.84, -0.58),
      new THREE.Vector2(0.9, -0.22),
      new THREE.Vector2(0.82, 0.16),
      new THREE.Vector2(0.62, 0.56),
      new THREE.Vector2(0.36, 0.92),
      new THREE.Vector2(0.14, 1.15),
      new THREE.Vector2(0.0, 1.24),
    ];
    const spongeGeo = new THREE.LatheGeometry(spongePts, 56);
    const spongeMesh = new THREE.Mesh(spongeGeo, spongeMat);
    spongeMesh.castShadow = true;
    root.add(spongeMesh);

    // Rose-gold studio display stand ring beneath sponge
    const standRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.56, 0.032, 16, 48),
      roseGoldMat
    );
    standRing.rotation.x = Math.PI / 2;
    standRing.position.y = -1.04;
    root.add(standRing);

    const standLegs = [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3];
    standLegs.forEach((angle) => {
      const foot = new THREE.Mesh(new THREE.SphereGeometry(0.048, 16, 16), roseGoldMat);
      foot.position.set(Math.cos(angle) * 0.56, -1.09, Math.sin(angle) * 0.56);
      root.add(foot);
    });

    root.rotation.z = -0.1;
  } else if (preset === 'eyelash_curler') {
    // 1. Top Curved Eyelash Clamp Arch
    const topArchCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.62, 0.98, 0.14),
      new THREE.Vector3(-0.32, 1.12, 0.24),
      new THREE.Vector3(0.0, 1.16, 0.28),
      new THREE.Vector3(0.32, 1.12, 0.24),
      new THREE.Vector3(0.62, 0.98, 0.14),
    ]);
    const topArch = new THREE.Mesh(new THREE.TubeGeometry(topArchCurve, 36, 0.048, 16, false), roseGoldMat);
    topArch.castShadow = true;
    root.add(topArch);

    // 2. Lower Movable Clamp Bar + Blush Silicone Pad
    const lowerBarCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.58, 0.72, 0.12),
      new THREE.Vector3(-0.3, 0.85, 0.21),
      new THREE.Vector3(0.0, 0.88, 0.25),
      new THREE.Vector3(0.3, 0.85, 0.21),
      new THREE.Vector3(0.58, 0.72, 0.12),
    ]);
    const lowerBar = new THREE.Mesh(new THREE.TubeGeometry(lowerBarCurve, 32, 0.042, 14, false), roseGoldMat);
    root.add(lowerBar);

    const padCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.52, 0.77, 0.14),
      new THREE.Vector3(-0.26, 0.89, 0.22),
      new THREE.Vector3(0.0, 0.92, 0.26),
      new THREE.Vector3(0.26, 0.89, 0.22),
      new THREE.Vector3(0.52, 0.77, 0.14),
    ]);
    const siliconePad = new THREE.Mesh(new THREE.TubeGeometry(padCurve, 32, 0.036, 14, false), siliconePinkMat);
    root.add(siliconePad);

    // 3. Side Support Pillars
    [-1, 1].forEach((dir) => {
      const pillarCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(dir * 0.62, 0.98, 0.14),
        new THREE.Vector3(dir * 0.56, 0.52, 0.05),
        new THREE.Vector3(dir * 0.22, 0.22, 0.0),
      ]);
      const pillar = new THREE.Mesh(new THREE.TubeGeometry(pillarCurve, 24, 0.038, 12, false), roseGoldMat);
      root.add(pillar);
    });

    // 4. Crossed Scissor Arms
    const leftArmCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.22, 0.22, 0.02),
      new THREE.Vector3(0.0, 0.0, 0.04),
      new THREE.Vector3(0.32, -0.58, 0.02),
    ]);
    const rightArmCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.22, 0.22, -0.02),
      new THREE.Vector3(0.0, 0.0, -0.04),
      new THREE.Vector3(-0.32, -0.58, -0.02),
    ]);
    root.add(new THREE.Mesh(new THREE.TubeGeometry(leftArmCurve, 24, 0.042, 14, false), roseGoldMat));
    root.add(new THREE.Mesh(new THREE.TubeGeometry(rightArmCurve, 24, 0.042, 14, false), roseGoldMat));

    // 5. Center Pivot Screw
    const pivot = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.14, 24), satinPlumMat);
    pivot.rotation.x = Math.PI / 2;
    root.add(pivot);

    // 6. Dual Ergonomic Finger Loops
    [-1, 1].forEach((dir) => {
      const loop = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.042, 16, 42), roseGoldMat);
      loop.position.set(dir * 0.42, -0.84, 0);
      loop.scale.set(0.86, 1.18, 1);
      loop.rotation.z = dir * -0.18;
      root.add(loop);

      // Soft plum silicone inner grip accent
      const grip = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.022, 12, 36), satinPlumMat);
      grip.position.copy(loop.position);
      grip.scale.copy(loop.scale);
      grip.rotation.copy(loop.rotation);
      root.add(grip);
    });

    root.position.set(0, -0.04, 0);
  }

  return root;
}

export function ThreeToolViewport({ tool, selectedHotspotId, onSelectHotspot }: ThreeToolViewportProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showHotspots, setShowHotspots] = useState(true);
  const [projected, setProjected] = useState<ProjectedHotspot[]>([]);
  const [hasInteracted, setHasInteracted] = useState(false);

  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const requestRenderRef = useRef<(() => void) | null>(null);
  const hotspotsRef = useRef<ToolHotspot[]>(tool.hotspots);
  const maxAnisotropyRef = useRef<number>(4);

  hotspotsRef.current = tool.hotspots;

  useEffect(() => {
    const mount = containerRef.current;
    if (!mount) return;

    const isSoftwareGl = detectSoftwareWebGL();
    const width = mount.clientWidth || 360;
    const height = mount.clientHeight || 380;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 50);
    camera.position.set(0, 0.18, 5.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    maxAnisotropyRef.current = renderer.capabilities.getMaxAnisotropy();

    mount.innerHTML = '';
    mount.appendChild(renderer.domElement);

    // Studio Environment Reflections via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    // 3-Point Warm/Cool Studio Rig
    const hemiLight = new THREE.HemisphereLight(0xfff5f0, 0xd8c3ce, 0.95);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff2e8, 1.9);
    keyLight.position.set(3.4, 4.6, 4.2);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf6dde6, 0.9);
    fillLight.position.set(-4.0, 1.6, 2.5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffdfcf, 1.15);
    rimLight.position.set(0.5, 2.5, -4.2);
    scene.add(rimLight);

    // Soft contact shadow plane for studio grounding
    const shadowTex = createContactShadowTexture();
    const shadowGeo = new THREE.PlaneGeometry(3.0, 3.0);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.72,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.68;
    scene.add(shadowPlane);

    // OrbitControls for 360° drag & zoom
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = 2.9;
    controls.maxDistance = 7.6;
    controls.target.set(0, 0.05, 0);
    controlsRef.current = controls;

    // Coalesced on-demand rendering + software WebGL fenceSync pacing
    let frameId = 0;
    let renderBusy = false;
    let renderDirty = false;
    let disposed = false;

    const projectHotspots = () => {
      const w = mount.clientWidth || 360;
      const h = mount.clientHeight || 380;
      const next: ProjectedHotspot[] = hotspotsRef.current.map((hs) => {
        _projVec.set(hs.anchor[0], hs.anchor[1], hs.anchor[2]);
        if (modelGroupRef.current) {
          _projVec.applyMatrix4(modelGroupRef.current.matrixWorld);
        }
        _projVec.project(camera);
        return {
          hotspot: hs,
          x: (_projVec.x * 0.5 + 0.5) * w,
          y: (-_projVec.y * 0.5 + 0.5) * h,
          visible: _projVec.z < 1,
        };
      });
      setProjected(next);
    };

    const afterDraw = (cb: () => void) => {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    };

    const requestRender = () => {
      if (disposed) return;
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame(() => {
        if (disposed) return;
        renderDirty = false;
        const damped = controls.update();
        scene.updateMatrixWorld(true);
        renderer.render(scene, camera);
        projectHotspots();

        const done = () => {
          renderBusy = false;
          if (renderDirty || (damped && !isSoftwareGl)) {
            requestRender();
          }
        };
        if (isSoftwareGl) afterDraw(done);
        else done();
      });
    };

    requestRenderRef.current = requestRender;

    const onControlStart = () => setHasInteracted(true);
    const onControlChange = () => requestRender();
    controls.addEventListener('start', onControlStart);
    controls.addEventListener('change', onControlChange);

    // Mount initial tool model
    const initialModel = buildToolModel(tool.modelPreset, maxAnisotropyRef.current);
    modelGroupRef.current = initialModel;
    scene.add(initialModel);
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }
    requestRender();

    const resizeObserver = new ResizeObserver(() => {
      if (!mount || disposed) return;
      const nw = mount.clientWidth;
      const nh = mount.clientHeight;
      if (nw === 0 || nh === 0) return;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
      requestRender();
    });
    resizeObserver.observe(mount);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      window.clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', onControlStart);
      controls.removeEventListener('change', onControlChange);
      controls.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      shadowTex.dispose();
      envTex.dispose();
      renderer.dispose();
      mount.innerHTML = '';
    };
    // Mount WebGL context once per component lifetime; model switching happens in the effect below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Swap 3D model cleanly whenever selected tool changes
  useEffect(() => {
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!scene || !camera || !controls) return;

    if (modelGroupRef.current) {
      modelGroupRef.current.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material.dispose();
          }
        }
      });
      scene.remove(modelGroupRef.current);
    }

    const nextModel = buildToolModel(tool.modelPreset, maxAnisotropyRef.current);
    modelGroupRef.current = nextModel;
    scene.add(nextModel);

    // Reset framing gently for each new tool
    camera.position.set(0, 0.18, 5.2);
    controls.target.set(0, 0.05, 0);
    controls.update();
    requestRenderRef.current?.();
  }, [tool.id, tool.modelPreset, tool.hotspots]);

  const handleResetView = () => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;
    camera.position.set(0, 0.18, 5.2);
    controls.target.set(0, 0.05, 0);
    controls.update();
    requestRenderRef.current?.();
  };

  const handleZoom = (factor: number) => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;
    const dir = camera.position.clone().sub(controls.target);
    const nextLen = THREE.MathUtils.clamp(dir.length() * factor, 2.9, 7.6);
    dir.setLength(nextLen);
    camera.position.copy(controls.target).add(dir);
    controls.update();
    requestRenderRef.current?.();
  };

  const width = containerRef.current?.clientWidth || 360;

  return (
    <div className="relative overflow-hidden rounded-[26px] border border-[#D8B4A7] viewport-rose-surface shadow-[0_14px_34px_rgba(61,31,52,0.08)]">
      {/* Dedicated WebGL Mount Container */}
      <div
        ref={containerRef}
        className="h-[370px] sm:h-[430px] w-full cursor-grab active:cursor-grabbing touch-none"
        aria-label={`Interactive 3D model of ${tool.name}. Drag to rotate 360 degrees or scroll to zoom.`}
      />

      {/* Dynamic Projected Anatomical Hotspot Callout Overlay */}
      {showHotspots && projected.length > 0 && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <svg className="h-full w-full" aria-hidden="true">
            {projected.map(({ hotspot, x, y, visible }) => {
              if (!visible) return null;
              const isSelected = selectedHotspotId === hotspot.id;
              const anchorRight = hotspot.side === 'right' || x < width * 0.52;
              const endX = anchorRight
                ? Math.min(width - 122, x + 52)
                : Math.max(122, x - 52);

              return (
                <g key={hotspot.id}>
                  <line
                    x1={x}
                    y1={y}
                    x2={endX}
                    y2={y}
                    stroke={isSelected ? '#B97664' : '#C79687'}
                    strokeWidth={isSelected ? 1.8 : 1.25}
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 5 : 4}
                    fill={isSelected ? '#B97664' : '#DFB2A4'}
                    stroke="#FFF9F6"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx={endX}
                    cy={y}
                    r={3.2}
                    fill={isSelected ? '#2D1B2E' : '#D49A89'}
                  />
                </g>
              );
            })}
          </svg>

          {projected.map(({ hotspot, x, y, visible }) => {
            if (!visible) return null;
            const isSelected = selectedHotspotId === hotspot.id;
            const anchorRight = hotspot.side === 'right' || x < width * 0.52;
            const labelLeft = anchorRight
              ? Math.min(width - 118, x + 58)
              : Math.max(8, x - 166);

            return (
              <button
                key={hotspot.id}
                type="button"
                onClick={() => onSelectHotspot(isSelected ? null : hotspot)}
                style={{
                  left: `${labelLeft}px`,
                  top: `${Math.max(18, Math.min(340, y - 14))}px`,
                }}
                className={`pointer-events-auto absolute max-w-[138px] rounded-lg px-2 py-1 text-left text-[12px] leading-tight transition-colors ${
                  isSelected
                    ? 'bg-[#3E1F34] text-white font-semibold shadow-md'
                    : 'bg-[#F8EFECE6] text-[#2D1B2E] font-medium hover:bg-white'
                }`}
              >
                {hotspot.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Subtle 360° Drag Hint before first interaction */}
      {!hasInteracted && (
        <div className="pointer-events-none absolute left-1/2 bottom-14 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-[#FFF9F6]/90 px-3 py-1 text-[11px] font-medium text-[#6C4D5C] border border-[#E5CFC7]">
          <span>Drag to rotate 360°</span>
        </div>
      )}

      {/* Bottom Viewport Toolbar (Solid surfaces, no backdrop-filter over WebGL) */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
        <div className="inline-flex items-center gap-1.5 rounded-xl border border-[#E7D4CD] bg-[#FFFDFB] px-3 py-1.5 text-xs font-semibold text-[#2D1B2E] shadow-sm">
          <RotateCcw className="h-3.5 w-3.5 text-[#B97664]" />
          <span>360° View</span>
        </div>

        <div className="flex items-center gap-1.5 rounded-xl border border-[#E7D4CD] bg-[#FFFDFB] p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setShowHotspots((v) => !v)}
            title={showHotspots ? 'Hide callout pins' : 'Show callout pins'}
            className={`inline-flex h-8 items-center gap-1 rounded-lg px-2.5 text-xs font-medium transition-colors ${
              showHotspots
                ? 'bg-[#F5E6E1] text-[#2D1B2E]'
                : 'text-[#7A6572] hover:bg-[#FAF2EE]'
            }`}
          >
            {showHotspots ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">Pins</span>
          </button>
          <button
            type="button"
            onClick={() => handleZoom(0.84)}
            aria-label="Zoom in"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#2D1B2E] hover:bg-[#FAF2EE] transition-colors"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => handleZoom(1.18)}
            aria-label="Zoom out"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#2D1B2E] hover:bg-[#FAF2EE] transition-colors"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleResetView}
            aria-label="Reset 3D camera"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#2D1B2E] hover:bg-[#FAF2EE] transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
