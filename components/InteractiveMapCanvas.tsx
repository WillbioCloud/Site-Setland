import { useEffect, useRef, type MutableRefObject } from 'react';
import {
  ACESFilmicToneMapping,
  AmbientLight,
  Box3,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Clock,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  Group,
  MathUtils,
  Material,
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
  Texture,
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

type ParchmentSurface = {
  geometry: BufferGeometry;
  openPositions: Float32Array;
  rolledPositions: Float32Array;
};

const MAP_WIDTH = 5.35;
const MAP_DEPTH = 2.9;
const MAP_SURFACE_Y = 0.145;
const ROLL_INNER_RADIUS = 0.14;
const ROLL_OUTER_RADIUS = 0.28;
const ROLL_TURNS = 4;

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
  const geometries = new Set<BufferGeometry>();
  const materials = new Set<Material>();
  const textures = new Set<Texture>();

  root.traverse((object) => {
    const mesh = object as Mesh;
    if (!mesh.isMesh) return;
    geometries.add(mesh.geometry);
    const meshMaterials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    meshMaterials.forEach((material) => {
      materials.add(material);
      Object.values(material).forEach((value) => {
        if (value instanceof Texture) textures.add(value);
      });
    });
  });

  geometries.forEach((geometry) => geometry.dispose());
  materials.forEach((material) => material.dispose());
  textures.forEach((texture) => texture.dispose());
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
    let lastProgress = -1;
    let hasFallbackSurface = false;
    const surfaces: ParchmentSurface[] = [];
    const scene = new Scene();
    const camera = new PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 5.3, 9.6);
    camera.lookAt(0, 0.5, 0);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;

    const world = new Group();
    scene.add(world);

    const ambient = new AmbientLight('#fff1d8', 1.14);
    scene.add(ambient);

    const keyLight = new DirectionalLight('#fff2da', 2.05);
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
      new PointLight('#cba96e', 22, 11, 1.8),
      new PointLight('#cba96e', 19, 10, 1.8),
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
    const parchmentBaseY = tabletopY + MAP_SURFACE_Y;

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

    // This textured roll is only a brief loading stand-in; once the GLB is ready,
    // its own vertices and texture drive both the sealed and revealed states.
    const placeholderMaterial = new MeshStandardMaterial({
      color: '#b68a55',
      roughness: 0.9,
      map: parchmentTexture,
    });
    const closedScroll = new Mesh(
      new CylinderGeometry(ROLL_OUTER_RADIUS, ROLL_OUTER_RADIUS, MAP_DEPTH + 0.06, 40, 2),
      placeholderMaterial,
    );
    closedScroll.rotation.x = Math.PI / 2;
    closedScroll.position.set(0, parchmentBaseY + ROLL_OUTER_RADIUS, 0);
    closedScroll.castShadow = true;
    closedScroll.receiveShadow = true;
    world.add(closedScroll);

    const rollCoreMaterial = new MeshStandardMaterial({
      color: '#4a2c19',
      roughness: 0.82,
      transparent: true,
      opacity: 1,
    });
    const rollCore = new Mesh(
      new CylinderGeometry(
        ROLL_INNER_RADIUS * 0.78,
        ROLL_INNER_RADIUS * 0.78,
        MAP_DEPTH + 0.16,
        24,
      ),
      rollCoreMaterial,
    );
    rollCore.rotation.x = Math.PI / 2;
    rollCore.position.set(0, parchmentBaseY + ROLL_INNER_RADIUS, 0);
    rollCore.castShadow = true;
    world.add(rollCore);

    const rollBandMaterial = new MeshStandardMaterial({
      color: '#b38b4d',
      metalness: 0.6,
      roughness: 0.42,
      transparent: true,
      opacity: 1,
    });
    const rollBands: Mesh[] = [];
    for (const z of [-MAP_DEPTH / 2 - 0.035, MAP_DEPTH / 2 + 0.035]) {
      const band = new Mesh(
        new TorusGeometry(ROLL_OUTER_RADIUS + 0.005, 0.023, 8, 28),
        rollBandMaterial,
      );
      band.position.set(0, parchmentBaseY + ROLL_OUTER_RADIUS, z);
      band.castShadow = true;
      world.add(band);
      rollBands.push(band);
    }

    const syncRollDetails = (progress: number) => {
      const opacity = 1 - MathUtils.smoothstep(progress, 0.015, 0.32);
      rollCoreMaterial.opacity = opacity;
      rollBandMaterial.opacity = opacity;
      rollCore.visible = opacity > 0.01;
      rollBands.forEach((band) => (band.visible = opacity > 0.01));
    };

    const registerSurface = (geometry: BufferGeometry, material: Material | Material[]) => {
      const positions = geometry.attributes.position as BufferAttribute;
      const openPositions = new Float32Array(positions.array);
      const rolledPositions = new Float32Array(openPositions.length);
      const vertexCount = positions.count;
      const initialOpening = MathUtils.smoothstep(
        MathUtils.clamp(motion.current.progress, 0, 1),
        0.015,
        0.98,
      );

      for (let vertex = 0; vertex < vertexCount; vertex += 1) {
        const index = vertex * 3;
        const x = openPositions[index];
        const y = openPositions[index + 1];
        const z = openPositions[index + 2];
        const u = MathUtils.clamp((x + MAP_WIDTH / 2) / MAP_WIDTH, 0, 1);
        const angle = u * Math.PI * 2 * ROLL_TURNS;
        const radius = MathUtils.lerp(ROLL_INNER_RADIUS, ROLL_OUTER_RADIUS, u);

        // A true spiral cross-section makes the same textured GLB read as a rolled
        // scroll at rest, then smoothly opens into its own naturally curled sheet.
        rolledPositions[index] = radius * Math.sin(angle);
        rolledPositions[index + 1] =
          parchmentBaseY + radius * (1 - Math.cos(angle)) + (y - parchmentBaseY) * 0.08;
        rolledPositions[index + 2] = z;

        positions.array[index] = MathUtils.lerp(
          rolledPositions[index],
          openPositions[index],
          initialOpening,
        );
        positions.array[index + 1] = MathUtils.lerp(
          rolledPositions[index + 1],
          openPositions[index + 1],
          initialOpening,
        );
        positions.array[index + 2] = MathUtils.lerp(
          rolledPositions[index + 2],
          openPositions[index + 2],
          initialOpening,
        );
      }
      positions.needsUpdate = true;
      geometry.computeVertexNormals();
      geometry.computeBoundingSphere();

      const surface = new Mesh(geometry, material);
      surface.castShadow = true;
      surface.receiveShadow = true;
      surface.renderOrder = 2;
      world.add(surface);
      surfaces.push({ geometry, openPositions, rolledPositions });
      closedScroll.visible = false;
      syncRollDetails(MathUtils.clamp(motion.current.progress, 0, 1));
    };

    const addFallbackSurface = () => {
      if (disposed || hasFallbackSurface) return;
      hasFallbackSurface = true;

      const geometry = new PlaneGeometry(MAP_WIDTH, MAP_DEPTH, 84, 38);
      geometry.rotateX(-Math.PI / 2);
      const positions = geometry.attributes.position as BufferAttribute;
      for (let vertex = 0; vertex < positions.count; vertex += 1) {
        const x = positions.getX(vertex);
        const z = positions.getZ(vertex);
        const edge = MathUtils.smoothstep(Math.abs(x) / (MAP_WIDTH / 2), 0.62, 0.98);
        const ripple = Math.sin((z / MAP_DEPTH + 0.5) * Math.PI * 4) * 0.025;
        positions.setY(vertex, parchmentBaseY + edge * (0.13 + ripple));
      }
      positions.needsUpdate = true;
      geometry.computeVertexNormals();

      const fallbackMaterial = new MeshStandardMaterial({
        map: parchmentTexture,
        color: '#f1dfbd',
        roughness: 0.98,
        side: DoubleSide,
      });
      registerSurface(geometry, fallbackMaterial);
    };

    new GLTFLoader().load(
      '/models/old-map.glb',
      (gltf) => {
        if (disposed) {
          disposeObject(gltf.scene);
          return;
        }

        gltf.scene.updateMatrixWorld(true);
        const bounds = new Box3().setFromObject(gltf.scene);
        const size = bounds.getSize(new Vector3());
        if (bounds.isEmpty() || Math.max(size.x, size.z) === 0) {
          disposeObject(gltf.scene);
          addFallbackSurface();
          return;
        }

        const center = bounds.getCenter(new Vector3());
        const turnLongSide = size.z > size.x;
        const modelScale = MAP_WIDTH / Math.max(size.x, size.z);
        const sourceGeometries = new Set<BufferGeometry>();
        const sourceMaterials = new Set<Material>();

        gltf.scene.traverse((object) => {
          const sourceMesh = object as Mesh;
          if (!sourceMesh.isMesh) return;

          sourceGeometries.add(sourceMesh.geometry);
          const geometry = sourceMesh.geometry.clone();
          geometry.applyMatrix4(sourceMesh.matrixWorld);
          const positions = geometry.attributes.position as BufferAttribute;

          for (let vertex = 0; vertex < positions.count; vertex += 1) {
            const sourceX = positions.getX(vertex) - center.x;
            const sourceY = positions.getY(vertex);
            const sourceZ = positions.getZ(vertex) - center.z;
            const x = (turnLongSide ? sourceZ : sourceX) * modelScale;
            const z = (turnLongSide ? -sourceX : sourceZ) * modelScale;
            const y = (sourceY - bounds.min.y) * modelScale + parchmentBaseY;
            positions.setXYZ(vertex, x, y, z);
          }
          positions.needsUpdate = true;
          geometry.computeVertexNormals();
          geometry.computeBoundingSphere();

          const sourceMeshMaterials = Array.isArray(sourceMesh.material)
            ? sourceMesh.material
            : [sourceMesh.material];
          const mapMaterials = sourceMeshMaterials.map((sourceMaterial) => {
            sourceMaterials.add(sourceMaterial);
            const material = sourceMaterial.clone();
            material.side = DoubleSide;
            material.transparent = false;
            material.depthWrite = true;
            if (material instanceof MeshStandardMaterial) {
              material.roughness = 0.96;
              material.metalness = 0;
              material.color.set('#fff6e2');
            }
            return material;
          });

          registerSurface(
            geometry,
            Array.isArray(sourceMesh.material) ? mapMaterials : mapMaterials[0],
          );
        });

        sourceGeometries.forEach((geometry) => geometry.dispose());
        sourceMaterials.forEach((material) => material.dispose());

        if (surfaces.length === 0) addFallbackSurface();
        closedScroll.visible = surfaces.length === 0;
      },
      undefined,
      () => addFallbackSurface(),
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
        const opening = MathUtils.smoothstep(progress, 0.015, 0.98);
        surfaces.forEach(({ geometry, openPositions, rolledPositions }) => {
          const positions = geometry.attributes.position as BufferAttribute;
          for (let index = 0; index < openPositions.length; index += 3) {
            positions.array[index] = MathUtils.lerp(
              rolledPositions[index],
              openPositions[index],
              opening,
            );
            positions.array[index + 1] = MathUtils.lerp(
              rolledPositions[index + 1],
              openPositions[index + 1],
              opening,
            );
            positions.array[index + 2] = MathUtils.lerp(
              rolledPositions[index + 2],
              openPositions[index + 2],
              opening,
            );
          }
          positions.needsUpdate = true;
          geometry.computeVertexNormals();
          geometry.computeBoundingSphere();
        });

        syncRollDetails(progress);
        closedScroll.visible = surfaces.length === 0 && progress < 0.12;
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
          (index === 0 ? 22 : 19) + Math.sin(elapsed * 7 + index) * 1.1;
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
      renderer.dispose();
    };
  }, [motion, onFailure]);

  return <canvas ref={canvasRef} className="interactive-map__canvas" aria-hidden="true" />;
}
