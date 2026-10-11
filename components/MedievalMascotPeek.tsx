import React, {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useAnimations, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { clone as cloneSkinnedScene } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { Sparkles, X } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';

export interface MedievalMascotPeekProps {
  /** Booleano indicando se o modo medieval foi ligado. */
  isActive: boolean;
}

const MASCOT_URL = '/models/mascote-com-rig-animado.glb';
const GREETING_CLIP_NAME = 'ArmaçãoAction';
const AUTO_DISMISS_MS = 8_500;
const AFTER_HOVER_MS = 4_500;
const EXIT_MS = 760;
const ACTION_FADE_MS = 260;

// The exported mesh is about 10 units tall. These offsets frame the upper body,
// move the face into the page, and let the hip/outer arm fall beyond the right edge.
const MODEL_POSITION: [number, number, number] = [1.55, -4.65, 0];
const MODEL_ROTATION: [number, number, number] = [0, -0.5, 0.1];
const MODEL_SCALE = 0.62;

interface MascotModelProps {
  isVisible: boolean;
  reducedMotion: boolean;
  onReady: () => void;
}

function MascotModel({ isVisible, reducedMotion, onReady }: MascotModelProps) {
  const gltf = useGLTF(MASCOT_URL);
  // SkeletonUtils.clone preserves the skinned mesh/bone relationship while allowing
  // per-instance material tweaks without mutating drei's cached GLTF scene.
  const scene = useMemo(() => cloneSkinnedScene(gltf.scene), [gltf.scene]);
  const stageRef = useRef<THREE.Group>(null);
  const invalidate = useThree((state) => state.invalidate);
  const { actions } = useAnimations(gltf.animations, stageRef);

  const greetingClip = useMemo(() => {
    return (
      gltf.animations.find((clip) => clip.name === GREETING_CLIP_NAME) ??
      gltf.animations.find((clip) => /wave|waving|aceno|sauda/i.test(clip.name)) ??
      (gltf.animations.length === 1 ? gltf.animations[0] : undefined)
    );
  }, [gltf.animations]);
  const greetingAction = greetingClip ? actions[greetingClip.name] : undefined;

  // Keep authored vertex normals when present. This GLB has them, plus a normal map;
  // recomputing them on a skinned mesh would overwrite its authored smooth shading.
  // Only generate normals for a mesh that genuinely has no normal attribute.
  useLayoutEffect(() => {
    const clonedMaterials: THREE.Material[] = [];
    const originalMaterials: Array<{ mesh: THREE.Mesh; material: THREE.Mesh['material'] }> = [];

    scene.traverse((object) => {
      if (!(object as THREE.Mesh).isMesh) return;
      const mesh = object as THREE.Mesh;
      originalMaterials.push({ mesh, material: mesh.material });

      if (!mesh.geometry.getAttribute('normal')) {
        mesh.geometry.computeVertexNormals();
      }

      const refineMaterial = (source: THREE.Material) => {
        const material = source.clone();
        clonedMaterials.push(material);

        if (material instanceof THREE.MeshStandardMaterial) {
          material.roughness = Math.max(material.roughness, 0.82);
          material.metalness = Math.min(material.metalness, 0.15);
          if (material.normalMap) material.normalScale.set(1.6, 1.6);
          material.needsUpdate = true;
        }

        return material;
      };

      mesh.material = Array.isArray(mesh.material)
        ? mesh.material.map(refineMaterial)
        : refineMaterial(mesh.material);
    });

    return () => {
      originalMaterials.forEach(({ mesh, material }) => {
        mesh.material = material;
      });
      clonedMaterials.forEach((material) => material.dispose());
    };
  }, [scene]);

  useEffect(() => {
    onReady();
  }, [onReady]);

  useEffect(() => {
    if (!greetingAction || !greetingClip) return;

    if (!isVisible) {
      greetingAction.fadeOut(ACTION_FADE_MS / 1000);
      if (reducedMotion) {
        greetingAction.stop();
        invalidate();
        return;
      }
      const stopTimer = window.setTimeout(() => greetingAction.stop(), ACTION_FADE_MS + 30);
      return () => window.clearTimeout(stopTimer);
    }

    greetingAction.stop();
    greetingAction.reset();
    greetingAction.enabled = true;
    greetingAction.clampWhenFinished = true;
    greetingAction.setLoop(THREE.LoopOnce, 1);
    greetingAction.setEffectiveTimeScale(1);
    greetingAction.setEffectiveWeight(1);

    if (reducedMotion) {
      // Respect reduced motion but preserve the raised, friendly end pose from Blender.
      greetingAction.play();
      greetingAction.time = greetingClip.duration;
      greetingAction.paused = true;
      invalidate();
    } else {
      greetingAction.fadeIn(0.32).play();
    }

    return () => greetingAction.fadeOut(0.16);
  }, [greetingAction, greetingClip, invalidate, isVisible, reducedMotion]);

  useFrame(({ clock }) => {
    const stage = stageRef.current;
    if (!stage) return;

    if (!isVisible || reducedMotion) {
      stage.position.set(...MODEL_POSITION);
      stage.rotation.set(...MODEL_ROTATION);
      return;
    }

    const time = clock.getElapsedTime();
    // A tiny whole-body breath; the arm motion itself comes from the authored GLB clip.
    stage.position.set(MODEL_POSITION[0], MODEL_POSITION[1] + Math.sin(time * 1.8) * 0.012, 0);
    stage.rotation.set(
      MODEL_ROTATION[0],
      MODEL_ROTATION[1],
      MODEL_ROTATION[2] + Math.sin(time * 1.25) * 0.008,
    );
  });

  return (
    <group ref={stageRef} position={MODEL_POSITION} rotation={MODEL_ROTATION} scale={MODEL_SCALE}>
      <primitive object={scene} />
    </group>
  );
}

export function MedievalMascotPeek({ isActive }: MedievalMascotPeekProps) {
  const reducedMotion = useReducedMotion();
  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const isActiveRef = useRef(isActive);
  const isModelReadyRef = useRef(false);
  const dismissedRef = useRef(false);
  const dismissedByUserRef = useRef(false);
  const pointerInsideRef = useRef(false);
  const focusInsideRef = useRef(false);
  const dismissTimerRef = useRef<number | undefined>(undefined);
  const unmountTimerRef = useRef<number | undefined>(undefined);

  const clearDismissTimer = useCallback(() => {
    if (dismissTimerRef.current !== undefined) window.clearTimeout(dismissTimerRef.current);
    dismissTimerRef.current = undefined;
  }, []);

  const clearUnmountTimer = useCallback(() => {
    if (unmountTimerRef.current !== undefined) window.clearTimeout(unmountTimerRef.current);
    unmountTimerRef.current = undefined;
  }, []);

  const dismissPeek = useCallback(
    (byUser = false) => {
      dismissedRef.current = true;
      dismissedByUserRef.current = byUser;
      pointerInsideRef.current = false;
      focusInsideRef.current = false;
      clearDismissTimer();
      clearUnmountTimer();
      setIsVisible(false);
      unmountTimerRef.current = window.setTimeout(() => {
        unmountTimerRef.current = undefined;
        setShouldRender(false);
        isModelReadyRef.current = false;
      }, EXIT_MS);
    },
    [clearDismissTimer, clearUnmountTimer],
  );

  const startDismissTimer = useCallback(
    (delay = AUTO_DISMISS_MS) => {
      clearDismissTimer();
      if (dismissedRef.current || dismissedByUserRef.current) return;

      dismissTimerRef.current = window.setTimeout(() => {
        dismissTimerRef.current = undefined;
        if (
          !isActiveRef.current ||
          pointerInsideRef.current ||
          focusInsideRef.current ||
          dismissedByUserRef.current
        ) {
          return;
        }
        dismissPeek();
      }, delay);
    },
    [clearDismissTimer, dismissPeek],
  );

  const handleModelReady = useCallback(() => {
    isModelReadyRef.current = true;
    if (!isActiveRef.current || dismissedRef.current || dismissedByUserRef.current) return;

    setIsVisible(true);
    startDismissTimer();
  }, [startDismissTimer]);

  useEffect(() => {
    isActiveRef.current = isActive;
    clearDismissTimer();
    clearUnmountTimer();

    if (!isActive) {
      dismissPeek();
      return () => {
        clearDismissTimer();
        clearUnmountTimer();
      };
    }

    dismissedRef.current = false;
    dismissedByUserRef.current = false;
    pointerInsideRef.current = false;
    focusInsideRef.current = false;
    setShouldRender(true);

    if (isModelReadyRef.current) {
      setIsVisible(true);
      startDismissTimer();
    } else {
      setIsVisible(false);
    }

    return () => {
      clearDismissTimer();
      clearUnmountTimer();
    };
  }, [isActive, clearDismissTimer, clearUnmountTimer, dismissPeek, startDismissTimer]);

  const handlePointerEnter = () => {
    pointerInsideRef.current = true;
    clearDismissTimer();
    if (!isActiveRef.current || dismissedByUserRef.current) return;
    clearUnmountTimer();

    if (dismissedRef.current && isModelReadyRef.current) {
      dismissedRef.current = false;
      setIsVisible(true);
    }
  };

  const handlePointerLeave = () => {
    pointerInsideRef.current = false;
    if (!focusInsideRef.current) startDismissTimer(AFTER_HOVER_MS);
  };

  const handleFocusCapture = () => {
    focusInsideRef.current = true;
    clearDismissTimer();
    if (!isActiveRef.current || dismissedByUserRef.current) return;
    clearUnmountTimer();

    if (dismissedRef.current && isModelReadyRef.current) {
      dismissedRef.current = false;
      setIsVisible(true);
    }
  };

  const handleBlurCapture = (event: React.FocusEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget;
    focusInsideRef.current = nextTarget instanceof Node && event.currentTarget.contains(nextTarget);
    if (!pointerInsideRef.current && !focusInsideRef.current) {
      startDismissTimer(AFTER_HOVER_MS);
    }
  };

  if (!shouldRender) return null;

  return (
    <div className="medieval-mascot-peek" aria-hidden={!isVisible}>
      <div
        className={`medieval-mascot-peek__panel${isVisible ? ' is-visible' : ''}`}
        onMouseEnter={handlePointerEnter}
        onMouseLeave={handlePointerLeave}
        onFocusCapture={handleFocusCapture}
        onBlurCapture={handleBlurCapture}
        role="group"
        aria-label="Mascote Guardião Medieval"
      >
        <div className="medieval-mascot-peek__frame" aria-hidden="true">
          <Canvas
            dpr={[1, 1.25]}
            frameloop={reducedMotion ? 'demand' : 'always'}
            camera={{ position: [0, 0, 7.2], fov: 38, near: 0.1, far: 60 }}
            gl={{
              alpha: true,
              antialias: true,
              powerPreference: 'high-performance',
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.2,
            }}
          >
            <ambientLight intensity={0.85} />
            <directionalLight position={[-1.8, 3.2, 4]} intensity={2.1} color="#FFF5E0" />
            <pointLight position={[2.5, 1.1, 3.5]} intensity={0.75} color="#D9A45C" />
            <pointLight position={[1.5, 2.2, -3]} intensity={1.7} color="#60A5FA" />
            <Suspense fallback={null}>
              <MascotModel
                isVisible={isVisible}
                reducedMotion={reducedMotion}
                onReady={handleModelReady}
              />
            </Suspense>
          </Canvas>
        </div>

        <div className="medieval-mascot-peek__bubble" role="status" aria-live="polite">
          <Sparkles className="medieval-mascot-peek__sparkle" size={17} aria-hidden="true" />
          <span>Saudações, nobre viajante!</span>
          <button
            type="button"
            className="medieval-mascot-peek__close"
            tabIndex={isVisible ? 0 : -1}
            onClick={() => dismissPeek(true)}
            title="Fechar mascote"
            aria-label="Fechar mascote medieval"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MedievalMascotPeek;
