import { useEffect, useRef, type MutableRefObject } from 'react';
import {
  ACESFilmicToneMapping,
  AmbientLight,
  Box3,
  BoxGeometry,
  BufferAttribute,
  CanvasTexture,
  Clock,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  Group,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  RepeatWrapping,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  TextureLoader,
  TorusGeometry,
  Vector3,
  WebGLRenderer,
} from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import parchmentImage from '../assets/old-map-parchment.webp';

export type SceneMotion = {
  progress: number;
  tiltX: number;
  tiltY: number;
};

type MapCanvasProps = {
  motion: MutableRefObject<SceneMotion>;
  onFailure: () => void;
};

function makeWoodTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext('2d');
  if (!context) return null;

  context.fillStyle = '#38251a';
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let line = 0; line < 100; line += 1) {
    const y = (line / 100) * canvas.height;
    const wave = Math.sin(line * 1.73) * 3.4;
    context.beginPath();
    context.moveTo(0, y + wave);
    context.bezierCurveTo(
      canvas.width * 0.28,
      y + Math.sin(line * 0.44) * 8,
      canvas.width * 0.68,
      y + Math.cos(line * 0.31) * 6,
      canvas.width,
      y + wave,
    );
    context.strokeStyle = line % 7 === 0 ? 'rgba(202, 151, 97, .2)' : 'rgba(10, 7, 5, .16)';
    context.lineWidth = line % 7 === 0 ? 2 : 1;
    context.stroke();
  }

  for (let knot = 0; knot < 8; knot += 1) {
    const x = ((knot * 97 + 38) % canvas.width) + 0.5;
    const y = ((knot * 61 + 42) % canvas.height) + 0.5;
    context.beginPath();
    context.ellipse(x, y, 16, 5, 0, 0, Math.PI * 2);
    context.strokeStyle = 'rgba(13, 8, 5, .26)';
    context.lineWidth = 2;
    context.stroke();
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(2.4, 1.25);
  return texture;
}

function disposeObject(root: Group | Scene) {
  root.traverse((object) => {
    const mesh = object as Mesh;
    if (!mesh.isMesh) return;
    mesh.geometry.dispose();
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    materials.forEach((material) => {
      const standardMaterial = material as MeshStandardMaterial;
      standardMaterial.map?.dispose();
      standardMaterial.dispose();
    });
  });
}

export function InteractiveMapCanvas({ motion, onFailure }: MapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'low-power',
        failIfMajorPerformanceCaveat: false,
      });
    } catch {
      onFailure();
      return;
    }

    let disposed = false;
    let frame = 0;
    let loadedModel: Group | null = null;
    let lastProgress = -1;
    const scene = new Scene();
    const camera = new PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 5.3, 9.6);
    camera.lookAt(0, 0.5, 0);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;

    const world = new Group();
    scene.add(world);

    const ambient = new AmbientLight('#fff1d8', 1.18);
    scene.add(ambient);

    const keyLight = new DirectionalLight('#fff2da', 2.1);
    keyLight.position.set(-3.5, 8.5, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.left = -7;
    keyLight.shadow.camera.right = 7;
    keyLight.shadow.camera.top = 7;
    keyLight.shadow.camera.bottom = -7;
    keyLight.shadow.bias = -0.0004;
    scene.add(keyLight);

    const torchLights = [
      new PointLight('#cba96e', 24, 11, 1.8),
      new PointLight('#cba96e', 20, 10, 1.8),
    ];
    torchLights[0].position.set(-3.75, 2.25, 0.7);
    torchLights[1].position.set(3.75, 2.25, -0.65);
    scene.add(...torchLights);

    const floorMaterial = new MeshStandardMaterial({ color: '#17120e', roughness: 1 });
    const floor = new Mesh(new PlaneGeometry(120, 120), floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.78;
    floor.receiveShadow = true;
    world.add(floor);

    const woodTexture = makeWoodTexture();
    const woodMaterial = new MeshStandardMaterial({
      map: woodTexture ?? undefined,
      color: '#8d6343',
      roughness: 0.89,
    });
    const darkWoodMaterial = new MeshStandardMaterial({ color: '#362219', roughness: 0.92 });
    const stoneMaterial = new MeshStandardMaterial({ color: '#54483d', roughness: 0.96 });
    const brassMaterial = new MeshStandardMaterial({
      color: '#9b7441',
      metalness: 0.66,
      roughness: 0.42,
    });
    const tabletopY = 0.48;

    const stoneBase = new Mesh(new BoxGeometry(8.45, 0.24, 4.55), stoneMaterial);
    stoneBase.position.y = 0.29;
    stoneBase.castShadow = true;
    stoneBase.receiveShadow = true;
    world.add(stoneBase);

    for (const x of [-3.35, 3.35]) {
      for (const z of [-1.52, 1.52]) {
        const block = new Mesh(new BoxGeometry(0.82, 1.05, 0.82), stoneMaterial);
        block.position.set(x, -0.2, z);
        block.rotation.y = (x * z > 0 ? 1 : -1) * 0.035;
        block.castShadow = true;
        block.receiveShadow = true;
        world.add(block);
      }
    }

    const apron = new Mesh(new BoxGeometry(8.2, 0.45, 4.35), darkWoodMaterial);
    apron.position.y = 0.33;
    apron.castShadow = true;
    apron.receiveShadow = true;
    world.add(apron);

    const tableTop = new Mesh(new BoxGeometry(8.7, 0.2, 4.72), woodMaterial);
    tableTop.position.y = tabletopY;
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    world.add(tableTop);

    for (let plank = 0; plank < 5; plank += 1) {
      const board = new Mesh(new BoxGeometry(1.72, 0.035, 4.62), woodMaterial);
      board.position.set(-3.44 + plank * 1.72, tabletopY + 0.115, 0);
      board.castShadow = true;
      board.receiveShadow = true;
      world.add(board);
    }

    const trim = new Mesh(new BoxGeometry(8.68, 0.055, 0.065), brassMaterial);
    for (const z of [-2.34, 2.34]) {
      const rail = trim.clone();
      rail.position.set(0, tabletopY + 0.1, z);
      world.add(rail);
    }
    for (const x of [-4.32, 4.32]) {
      const rail = new Mesh(new BoxGeometry(0.065, 0.055, 4.62), brassMaterial);
      rail.position.set(x, tabletopY + 0.1, 0);
      world.add(rail);
    }

    const nailGeometry = new SphereGeometry(0.055, 12, 8);
    for (const x of [-4.08, 4.08]) {
      for (const z of [-2.08, 2.08]) {
        const nail = new Mesh(nailGeometry, brassMaterial);
        nail.position.set(x, tabletopY + 0.145, z);
        world.add(nail);
      }
    }

    const flameMaterial = new MeshStandardMaterial({
      color: '#ef9b3e',
      emissive: '#e8781e',
      emissiveIntensity: 2.2,
      roughness: 0.42,
    });
    const flameGeometry = new SphereGeometry(0.105, 16, 12);
    const flames: Mesh[] = [];
    for (const x of [-3.78, 3.78]) {
      const torchStem = new Mesh(new CylinderGeometry(0.055, 0.085, 0.52, 12), brassMaterial);
      torchStem.position.set(x, tabletopY + 0.37, 0);
      torchStem.castShadow = true;
      world.add(torchStem);

      const flame = new Mesh(flameGeometry, flameMaterial);
      flame.position.set(x, tabletopY + 0.69, 0);
      flame.scale.set(0.8, 1.25, 0.8);
      world.add(flame);
      flames.push(flame);
    }

    const parchmentTexture = new TextureLoader().load(parchmentImage);
    parchmentTexture.colorSpace = SRGBColorSpace;
    parchmentTexture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);

    const sheetWidth = 5.45;
    const sheetDepth = 2.75;
    const paperGeometry = new PlaneGeometry(sheetWidth, sheetDepth, 72, 28);
    const paperPositions = new Float32Array(paperGeometry.attributes.position.array);
    const paperMaterial = new MeshStandardMaterial({
      map: parchmentTexture,
      color: '#f6dfb4',
      roughness: 0.98,
      metalness: 0,
      side: DoubleSide,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const paper = new Mesh(paperGeometry, paperMaterial);
    paper.rotation.x = -Math.PI / 2;
    paper.position.set(0, tabletopY + 0.145, 0);
    paper.receiveShadow = true;
    paper.renderOrder = 2;
    world.add(paper);

    const rollGeometry = new CylinderGeometry(0.12, 0.12, sheetDepth + 0.06, 24, 1, true);
    const rollMaterial = new MeshStandardMaterial({
      color: '#b68a55',
      roughness: 0.84,
      map: parchmentTexture,
    });
    const rolls: Mesh[] = [];
    for (const direction of [-1, 1]) {
      const roll = new Mesh(rollGeometry, rollMaterial);
      roll.rotation.x = Math.PI / 2;
      roll.position.set(direction * 0.18, tabletopY + 0.19, 0);
      roll.castShadow = true;
      roll.visible = false;
      world.add(roll);
      rolls.push(roll);
    }

    const scrollRings: Mesh[] = [];
    for (const z of [-0.75, 0.75]) {
      const ring = new Mesh(new TorusGeometry(0.17, 0.025, 8, 24), brassMaterial);
      ring.position.set(0, tabletopY + 0.19, z);
      ring.visible = true;
      world.add(ring);
      scrollRings.push(ring);
    }

    const closedScroll = new Mesh(
      new CylinderGeometry(0.19, 0.19, sheetDepth + 0.04, 32, 1, true),
      rollMaterial,
    );
    closedScroll.rotation.x = Math.PI / 2;
    closedScroll.position.set(0, tabletopY + 0.19, 0);
    closedScroll.castShadow = true;
    closedScroll.visible = true;
    world.add(closedScroll);

    const modelHolder = new Group();
    modelHolder.scale.x = 0.14;
    world.add(modelHolder);
    const modelMaterials: MeshStandardMaterial[] = [];
    new GLTFLoader().load(
      '/models/old-map.glb',
      (gltf) => {
        if (disposed) {
          disposeObject(gltf.scene);
          return;
        }

        loadedModel = gltf.scene;
        loadedModel.updateMatrixWorld(true);
        const initialBounds = new Box3().setFromObject(loadedModel);
        const initialSize = initialBounds.getSize(new Vector3());
        const modelScale = 4.95 / Math.max(initialSize.x, initialSize.z);
        loadedModel.scale.setScalar(modelScale);
        loadedModel.updateMatrixWorld(true);

        const fittedBounds = new Box3().setFromObject(loadedModel);
        const fittedCenter = fittedBounds.getCenter(new Vector3());
        loadedModel.position.x -= fittedCenter.x;
        loadedModel.position.y += tabletopY + 0.15 - fittedBounds.min.y;
        loadedModel.position.z -= fittedCenter.z;

        loadedModel.traverse((object) => {
          const mesh = object as Mesh;
          if (!mesh.isMesh) return;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          const sourceMaterials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          const transparentMaterials = sourceMaterials.map((sourceMaterial) => {
            const material = sourceMaterial.clone() as MeshStandardMaterial;
            material.transparent = true;
            material.opacity = 1;
            modelMaterials.push(material);
            return material;
          });
          mesh.material = Array.isArray(mesh.material)
            ? transparentMaterials
            : transparentMaterials[0];
        });
        const currentProgress = MathUtils.clamp(motion.current.progress, 0, 1);
        const currentOpacity = 1 - MathUtils.smoothstep(currentProgress, 0.08, 0.48);
        modelHolder.visible = currentOpacity > 0.015;
        modelMaterials.forEach((material) => {
          material.opacity = currentOpacity;
          material.depthWrite = currentOpacity > 0.95;
        });
        modelHolder.scale.x = 0.14 + 0.86 * MathUtils.smoothstep(currentProgress, 0.02, 0.72);
        closedScroll.visible = false;
        scrollRings.forEach((ring) => (ring.visible = false));
        modelHolder.add(loadedModel);
      },
      undefined,
      () => {
        const currentProgress = MathUtils.clamp(motion.current.progress, 0, 1);
        closedScroll.visible = currentProgress < 0.12;
        scrollRings.forEach((ring) => (ring.visible = currentProgress < 0.12));
      },
    );

    const cameraTarget = new Vector3(0, tabletopY + 0.04, 0);
    const controls = new OrbitControls(camera, canvas);
    controls.target.copy(cameraTarget);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableRotate = true;
    controls.rotateSpeed = 0.17;
    controls.minPolarAngle = 0.91;
    controls.maxPolarAngle = 1.24;
    controls.minAzimuthAngle = -0.16;
    controls.maxAzimuthAngle = 0.16;
    controls.update();

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      const zoomOut = camera.aspect < 1.18 ? 1.25 : camera.aspect < 1.38 ? 1.1 : 1;
      camera.position.set(0, cameraTarget.y + (5.3 - cameraTarget.y) * zoomOut, 9.6 * zoomOut);
      camera.lookAt(cameraTarget);
      camera.updateProjectionMatrix();
      controls.update();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    const clock = new Clock();
    let isVisible = false;
    const animate = () => {
      if (disposed || !isVisible) return;
      frame = window.requestAnimationFrame(animate);

      const progress = MathUtils.clamp(motion.current.progress, 0, 1);
      if (Math.abs(progress - lastProgress) > 0.0004) {
        const widthScale = 0.035 + 0.965 * progress;
        const opening = MathUtils.smoothstep(progress, 0.04, 0.56);
        const positions = paperGeometry.attributes.position as BufferAttribute;
        const halfWidth = sheetWidth / 2;
        const halfDepth = sheetDepth / 2;
        for (let vertex = 0; vertex < positions.count; vertex += 1) {
          const index = vertex * 3;
          const originalX = paperPositions[index];
          const originalY = paperPositions[index + 1];
          const normalizedX = originalX / halfWidth;
          const normalizedY = originalY / halfDepth;
          const outerCurl =
            Math.pow(Math.max(0, (Math.abs(normalizedX) - 0.7) / 0.3), 1.7) * (1 - opening) * 0.27;
          const softRipple =
            Math.sin((normalizedY + 0.42) * 8.5 + progress * 5.2) * (1 - opening) * 0.025;
          positions.setXYZ(vertex, originalX * widthScale, originalY, outerCurl + softRipple);
        }
        positions.needsUpdate = true;
        paperGeometry.computeVertexNormals();
        paperMaterial.opacity = opening;

        const modelOpacity = 1 - MathUtils.smoothstep(progress, 0.08, 0.48);
        modelHolder.scale.x = 0.14 + 0.86 * MathUtils.smoothstep(progress, 0.02, 0.72);
        modelHolder.visible = modelOpacity > 0.015;
        modelMaterials.forEach((material) => {
          material.opacity = modelOpacity;
          material.depthWrite = modelOpacity > 0.95;
        });

        const rollSpread = (sheetWidth / 2 - 0.12) * progress;
        rolls.forEach((roll, index) => {
          const direction = index === 0 ? -1 : 1;
          roll.visible = progress > 0.015 && progress < 0.98;
          roll.position.x = direction * rollSpread;
          roll.position.y = tabletopY + 0.19 + (1 - progress) * 0.05;
          roll.scale.setScalar(0.35 + 0.65 * (1 - progress));
        });
        closedScroll.visible = progress < 0.12 && modelMaterials.length === 0;
        scrollRings.forEach((ring) => {
          ring.visible = progress < 0.12 && modelMaterials.length === 0;
        });
        lastProgress = progress;
      }

      world.rotation.y = motion.current.tiltX * 0.035;
      world.rotation.x = motion.current.tiltY * 0.026;
      world.rotation.z = -motion.current.tiltX * 0.012;

      const elapsed = clock.getElapsedTime();
      flames.forEach((flame, index) => {
        const flicker = Math.sin(elapsed * (6.7 + index) + index * 1.8) * 0.035;
        flame.scale.y = 1.25 + flicker;
        torchLights[index].intensity =
          (index === 0 ? 24 : 20) + Math.sin(elapsed * 7 + index) * 1.1;
      });

      controls.update();
      renderer.render(scene, camera);
    };

    let visibilityObserver: IntersectionObserver | undefined;
    if ('IntersectionObserver' in window) {
      visibilityObserver = new IntersectionObserver(
        ([entry]) => {
          const nextVisibility = entry.isIntersecting;
          if (nextVisibility === isVisible) return;
          isVisible = nextVisibility;
          if (isVisible) {
            frame = window.requestAnimationFrame(animate);
          } else {
            window.cancelAnimationFrame(frame);
            frame = 0;
          }
        },
        { rootMargin: '120px 0px' },
      );
      visibilityObserver.observe(canvas);
    } else {
      isVisible = true;
      animate();
    }

    return () => {
      disposed = true;
      visibilityObserver?.disconnect();
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      controls.dispose();
      disposeObject(world);
      parchmentTexture.dispose();
      woodTexture?.dispose();
      renderer.dispose();
    };
  }, [motion, onFailure]);

  return <canvas ref={canvasRef} className="interactive-map__canvas" aria-hidden="true" />;
}
