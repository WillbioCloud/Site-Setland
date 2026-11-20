import { useEffect, useRef, type MutableRefObject, type RefObject } from 'react';
import {
  ACESFilmicToneMapping,
  AmbientLight,
  AnimationClip,
  AnimationMixer,
  Box3,
  BufferGeometry,
  DirectionalLight,
  DoubleSide,
  Group,
  Material,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  RepeatWrapping,
  Scene,
  ShadowMaterial,
  SRGBColorSpace,
  Texture,
  TextureLoader,
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
  mapOverlayRef?: MutableRefObject<HTMLDivElement | null> | RefObject<HTMLDivElement>;
  onFailure: () => void;
};

function disposeObject(root: Group | Scene) {
  const geometries = new Set<BufferGeometry>();
  const materials = new Set<Material>();
  const textures = new Set<Texture>();

  root.traverse((object) => {
    const mesh = object as Mesh;
    if (!mesh.isMesh) return;
    if (mesh.geometry) geometries.add(mesh.geometry);
    if (mesh.material) {
      const meshMaterials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      meshMaterials.forEach((material) => {
        materials.add(material);
        Object.values(material).forEach((value) => {
          if (value instanceof Texture) textures.add(value);
        });
      });
    }
  });

  geometries.forEach((geometry) => geometry.dispose());
  materials.forEach((material) => material.dispose());
  textures.forEach((texture) => texture.dispose());
}

export function InteractiveMapCanvas({ motion, mapOverlayRef, onFailure }: MapCanvasProps) {
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
    const scene = new Scene();
    const camera = new PerspectiveCamera(32, 1, 0.1, 100);
    const cameraTarget = new Vector3(0, 0.25, 0);
    camera.position.set(0, 4.6, 7.8);
    camera.lookAt(cameraTarget);

    const isMobileInitial = window.innerWidth < 768;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobileInitial ? 1.5 : 1.75));
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;

    const world = new Group();
    scene.add(world);

    // Clean, high-end studio lighting
    const ambient = new AmbientLight('#ffffff', 0.95);
    scene.add(ambient);

    const keyLight = new DirectionalLight('#fff8ea', 1.75);
    keyLight.position.set(3.5, 7.5, 4.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 20;
    keyLight.shadow.camera.left = -4.5;
    keyLight.shadow.camera.right = 4.5;
    keyLight.shadow.camera.top = 4.5;
    keyLight.shadow.camera.bottom = -4.5;
    keyLight.shadow.bias = -0.0004;
    keyLight.shadow.radius = 3;
    scene.add(keyLight);

    const fillLight = new DirectionalLight('#e0f2fe', 0.65);
    fillLight.position.set(-3.5, 4.5, -3);
    scene.add(fillLight);

    // Subtle invisible ground plane receiving soft shadow only
    const shadowPlaneGeo = new PlaneGeometry(24, 24);
    const shadowPlaneMat = new ShadowMaterial({ opacity: 0.32 });
    const shadowPlane = new Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.01;
    shadowPlane.receiveShadow = true;
    world.add(shadowPlane);

    let mixer: AnimationMixer | null = null;
    let mainClip: AnimationClip | null = null;
    let mapModel: Group | null = null;

    const registerModel = (group: Group, _hasNativeAnimation: boolean) => {
      mapModel = group;
      world.add(group);
    };

    const addFallbackPlane = () => {
      if (disposed || mapModel) return;
      const texture = new TextureLoader().load(parchmentImage);
      texture.colorSpace = SRGBColorSpace;
      const geometry = new PlaneGeometry(4.8, 2.9, 32, 20);
      geometry.rotateX(-Math.PI / 2);
      const material = new MeshStandardMaterial({
        map: texture,
        roughness: 0.92,
        side: DoubleSide,
      });
      const mesh = new Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      const group = new Group();
      group.add(mesh);
      registerModel(group, false);
    };

    const parchmentTexture = new TextureLoader().load(parchmentImage);
    parchmentTexture.colorSpace = SRGBColorSpace;
    parchmentTexture.wrapS = RepeatWrapping;
    parchmentTexture.wrapT = RepeatWrapping;
    parchmentTexture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);

    new GLTFLoader().load(
      '/models/old-map.glb',
      (gltf) => {
        if (disposed) {
          disposeObject(gltf.scene);
          return;
        }

        const model = gltf.scene;
        model.traverse((child) => {
          if ((child as Mesh).isMesh) {
            const mesh = child as Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.material = new MeshStandardMaterial({
              map: parchmentTexture,
              color: '#e8d2a6',
              roughness: 0.88,
              metalness: 0.04,
              bumpMap: parchmentTexture,
              bumpScale: 0.015,
              side: DoubleSide,
            });
          }
        });

        // Center and normalize scale
        model.updateMatrixWorld(true);
        const box = new Box3().setFromObject(model);
        const size = box.getSize(new Vector3());
        const center = box.getCenter(new Vector3());

        if (box.isEmpty() || Math.max(size.x, size.z, size.y) === 0) {
          disposeObject(model);
          addFallbackPlane();
          return;
        }

        const maxDim = Math.max(size.x, size.z);
        const targetScale = maxDim > 0 ? 5.1 / maxDim : 1;

        model.scale.setScalar(targetScale);
        model.position.x = -center.x * targetScale;
        model.position.y = -box.min.y * targetScale;
        model.position.z = -center.z * targetScale;

        const modelWrapper = new Group();
        modelWrapper.add(model);

        // Native animations support
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new AnimationMixer(model);
          mainClip = gltf.animations[0];
          const action = mixer.clipAction(mainClip);
          action.play();
          registerModel(modelWrapper, true);
        } else {
          registerModel(modelWrapper, false);
        }
      },
      undefined,
      () => addFallbackPlane(),
    );

    const controls = new OrbitControls(camera, canvas);
    controls.target.copy(cameraTarget);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableRotate = true;
    controls.rotateSpeed = 0.17;
    controls.minPolarAngle = 0.88;
    controls.maxPolarAngle = 1.30;
    controls.minAzimuthAngle = -0.20;
    controls.maxAzimuthAngle = 0.20;
    controls.update();

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      if (!width || !height) return;
      const isMobile = window.innerWidth < 768;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 1.75));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      const zoomOut = camera.aspect < 1.18 ? 1.25 : camera.aspect < 1.38 ? 1.1 : 1;
      camera.position.set(0, cameraTarget.y + (4.6 - cameraTarget.y) * zoomOut, 7.8 * zoomOut);
      camera.lookAt(cameraTarget);
      camera.updateProjectionMatrix();
      controls.update();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    let isVisible = false;
    const animate = () => {
      if (disposed || !isVisible) return;
      frame = window.requestAnimationFrame(animate);

      const progress = MathUtils.clamp(motion.current.progress, 0, 1);
      const opening = MathUtils.smoothstep(progress, 0.01, 0.99);

      if (mixer && mainClip) {
        mixer.setTime(Math.min(mainClip.duration * 0.999, mainClip.duration * opening));
      }
      if (mapModel) {
        // Quando fechado (0): fica pousado em ângulo na mesa.
        // Quando aberto (1): vem para frente (z/y) e inclina a folha (rotation.x) de frente para o visitante.
        mapModel.rotation.x = MathUtils.lerp(0.05, 0.48, opening);
        mapModel.position.y = MathUtils.lerp(-0.05, 0.52, opening);
        mapModel.position.z = MathUtils.lerp(-0.35, 1.35, opening);
        mapModel.scale.setScalar(MathUtils.lerp(0.88, 1.16, opening));
      }

      world.rotation.y = motion.current.tiltX * 0.04;
      world.rotation.x = motion.current.tiltY * 0.03;
      world.rotation.z = -motion.current.tiltX * 0.012;

      controls.update();

      if (mapOverlayRef?.current) {
        const azimuth = controls.getAzimuthalAngle();
        const polar = controls.getPolarAngle() - 1.07; // compensa o ângulo base da câmera
        const modelRotX = mapModel ? mapModel.rotation.x : 0;

        const rotXDeg = MathUtils.radToDeg(world.rotation.x + modelRotX - polar * 0.65) - 14 * (1 - opening);
        const rotYDeg = MathUtils.radToDeg(world.rotation.y - azimuth * 0.75);
        const rotZDeg = MathUtils.radToDeg(world.rotation.z);
        const scaleSync = MathUtils.lerp(0.86, 1, opening);

        mapOverlayRef.current.style.setProperty('--map-3d-rx', `${rotXDeg.toFixed(2)}deg`);
        mapOverlayRef.current.style.setProperty('--map-3d-ry', `${rotYDeg.toFixed(2)}deg`);
        mapOverlayRef.current.style.setProperty('--map-3d-rz', `${rotZDeg.toFixed(2)}deg`);
        mapOverlayRef.current.style.setProperty('--map-3d-scale', `${scaleSync.toFixed(3)}`);
      }

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
      disposeObject(scene);
      renderer.dispose();
    };
  }, [motion, mapOverlayRef, onFailure]);

  return <canvas ref={canvasRef} className="interactive-map__canvas" aria-hidden="true" />;
}
