import React, { useEffect, useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { Sparkles, X } from 'lucide-react';

export interface MedievalMascotPeekProps {
  /** Booleano indicando se o modo medieval foi ligado */
  isActive: boolean;
}

// 1. O Modelo 3D com rig, iluminação PBR e pose espiando (~85° inclinado da direita)
function MascotModel() {
  const gltf = useGLTF('/models/mascote.glb');
  const { scene, animations } = gltf;
  const modelRef = useRef<THREE.Group>(null);
  const { actions, names } = useAnimations(animations, modelRef);

  // Mapeamento dos ossos do braço direito e cabeça caso o rig seja procedural
  const rightForeArmRef = useRef<THREE.Bone | null>(null);
  const rightArmRef = useRef<THREE.Bone | null>(null);
  const headRef = useRef<THREE.Bone | null>(null);

  // 1. Refinamento Matemático das Malhas, Normais e Shaders PBR
  React.useLayoutEffect(() => {
    scene.traverse((child) => {
      // Identifica e captura ossos do rig para animação manual de tchauzinho
      if ((child as THREE.Bone).isBone) {
        const bone = child as THREE.Bone;
        const name = bone.name.toLowerCase();
        if (name.includes('forearm') && (name.includes('r') || name.includes('right'))) {
          rightForeArmRef.current = bone;
        } else if (name.includes('arm') && (name.includes('r') || name.includes('right'))) {
          rightArmRef.current = bone;
        } else if (name.includes('head')) {
          headRef.current = bone;
        }
      }

      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;

        // Recalcula normais para suavizar o sombreamento e remover facetas poligonais
        mesh.geometry.computeVertexNormals();

        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;

          // Acentua o relevo da pelagem no mapa normal
          if (mat.normalScale) {
            mat.normalScale.set(1.6, 1.6);
          }

          // Elimina o aspecto de plástico: pelo denso e feltro rústico com alta rugosidade
          mat.roughness = Math.max(mat.roughness, 0.82);
          mat.metalness = Math.min(mat.metalness, 0.15);
          mat.needsUpdate = true;
        }
      }
    });

    // Se o GLB já vier com clipe de animação gravado (Mixamo), toca imediatamente
    if (names.length > 0 && actions[names[0]]) {
      actions[names[0]]?.reset().fadeIn(0.3).play();
    }
  }, [scene, actions, names]);

  // 2. Animação em tempo real e pose espiando pela lateral (~85° inclinado da direita)
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (modelRef.current) {
      // Pose inclinada: ~85 graus (1.48 radianos), tombado espiando da fresta direita
      modelRef.current.rotation.z = -1.48 + Math.sin(t * 5) * 0.04;
      // Frente voltada para a câmera com leve giro em direção ao centro da tela
      modelRef.current.rotation.y = Math.PI - 0.35 + Math.cos(t * 3) * 0.03;
      // Respiração / oscilação suave no eixo X e Y
      modelRef.current.position.y = -0.45 + Math.sin(t * 3.5) * 0.015;
      modelRef.current.position.x = 0.52 + Math.cos(t * 3.5) * 0.015;
    }

    // Tchauzinho procedural pelo osso do antebraço direito se não houver clipe embutido
    if (rightForeArmRef.current && names.length === 0) {
      rightForeArmRef.current.rotation.z = Math.sin(t * 9) * 0.45 + 0.3;
      rightForeArmRef.current.rotation.x = Math.cos(t * 7) * 0.15;
    }
    if (rightArmRef.current && names.length === 0) {
      rightArmRef.current.rotation.z = -0.85 + Math.sin(t * 4) * 0.08;
    }
    if (headRef.current && names.length === 0) {
      // Cabeça compensa a inclinação do corpo para olhar diretamente para o visitante
      headRef.current.rotation.z = 0.55 + Math.sin(t * 4) * 0.04;
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
      // Escala focada no torso superior e cabeça
      scale={2.1}
      // X = 0.52 empurra o braço esquerdo e a cintura para fora do canvas (lado direito escondido)
      position={[0.52, -0.45, 0]}
    />
  );
}

// Pré-carrega o modelo na memória para aparecer instantaneamente sem delay
useGLTF.preload('/models/mascote.glb');

// 2. Componente de Casca (Controla a entrada da direita, permanência e saída)
export function MedievalMascotPeek({ isActive }: MedievalMascotPeekProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const isHoveredRef = useRef(false);
  const exitTimerRef = useRef<number | undefined>(undefined);
  const unmountTimerRef = useRef<number | undefined>(undefined);

  const startDismissTimers = (durationMs = 8000) => {
    window.clearTimeout(exitTimerRef.current);
    window.clearTimeout(unmountTimerRef.current);

    exitTimerRef.current = window.setTimeout(() => {
      if (!isHoveredRef.current) {
        setIsVisible(false);
      }
    }, durationMs);

    unmountTimerRef.current = window.setTimeout(() => {
      if (!isHoveredRef.current) {
        setShouldRender(false);
      }
    }, durationMs + 800);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    window.setTimeout(() => setShouldRender(false), 700);
  };

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    window.clearTimeout(exitTimerRef.current);
    window.clearTimeout(unmountTimerRef.current);
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    startDismissTimers(3500);
  };

  useEffect(() => {
    if (isActive) {
      setShouldRender(true);
      const entryTimer = window.setTimeout(() => setIsVisible(true), 50);
      startDismissTimers(8000);

      return () => {
        window.clearTimeout(entryTimer);
        window.clearTimeout(exitTimerRef.current);
        window.clearTimeout(unmountTimerRef.current);
      };
    } else {
      setIsVisible(false);
      const unmountTimer = window.setTimeout(() => setShouldRender(false), 700);
      return () => window.clearTimeout(unmountTimer);
    }
  }, [isActive]);

  if (!shouldRender) return null;

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`fixed bottom-0 right-0 z-50 pointer-events-auto flex flex-col items-end transition-all duration-700 ease-out transform select-none ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
      aria-label="Mascote Guardião Medieval"
    >
      {/* Balão de Fala Temático Medieval com botão de fechar */}
      <div className="mr-8 mb-[-12px] bg-[#350A18]/95 border-2 border-[#D9A45C] text-[#FDF9F3] pl-4 pr-2 py-2 rounded-2xl rounded-br-none shadow-2xl backdrop-blur-md flex items-center gap-2 animate-bounce">
        <Sparkles className="w-4 h-4 text-[#D9A45C] shrink-0" />
        <span className="text-xs font-serif font-bold tracking-wide">
          Saudações, Nobre Visitante!
        </span>
        <button
          onClick={handleDismiss}
          className="ml-1 p-0.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
          title="Fechar"
          aria-label="Fechar mascote"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Janela de Renderização 3D (Cortada perfeitamente na base) */}
      <div className="w-64 h-72 sm:w-80 sm:h-88">
        <Canvas
          camera={{ position: [0, 0.25, 1.45], fov: 40 }}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.25,
          }}
        >
          {/* Luz de ambiente e luz quente dourada frontal de tocha/castelo */}
          <ambientLight intensity={1.4} />
          <directionalLight position={[1.5, 2.5, 3]} intensity={2.2} color="#fff6e5" />
          <directionalLight position={[-2.5, 1.8, 2]} intensity={1.5} color="#D9A45C" />
          {/* Rim light azulada traseira para destacar a silhueta da pelagem */}
          <pointLight position={[0, 2, -2]} intensity={2.0} color="#60a5fa" />

          <Suspense fallback={null}>
            <MascotModel />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}

export default MedievalMascotPeek;
