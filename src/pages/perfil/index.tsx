import { useEffect, useRef } from 'react';

function Perfil() {
  // -----------------------------------------------------------------------------
  // BLOBS DE FUNDO
  // -----------------------------------------------------------------------------
  interface BlobMotion {
    ampX: number;
    ampY: number;
    speed: number;
    phase: number;
  }

  const BLOB_MOTION: BlobMotion[] = [
    { ampX: 12, ampY: 9, speed: 0.21, phase: 0.0 },
    { ampX: 8, ampY: 12, speed: 0.26, phase: 1.3 },
    { ampX: 10, ampY: 7, speed: 0.19, phase: 2.4 },
    { ampX: 14, ampY: 10, speed: 0.17, phase: 0.6 },
    { ampX: 7, ampY: 11, speed: 0.29, phase: 3.1 },
    { ampX: 11, ampY: 8, speed: 0.2, phase: 1.8 },
    { ampX: 9, ampY: 13, speed: 0.24, phase: 2.9 },
    { ampX: 6, ampY: 9, speed: 0.21, phase: 0.9 },
    { ampX: 9, ampY: 10, speed: 0.23, phase: 1.6 },
    { ampX: 8, ampY: 8, speed: 0.27, phase: 3.6 },
    { ampX: 7, ampY: 9, speed: 0.25, phase: 2.1 },
    { ampX: 10, ampY: 7, speed: 0.22, phase: 0.3 },
  ];

  function Blobs({ tint }: { tint?: string | null }) {
    const refs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
      let frameId: number;
      function loop(now: number) {
        const t = now / 1000;
        BLOB_MOTION.forEach((m, i) => {
          const el = refs.current[i];
          if (!el) return;
          const dx = Math.sin(t * m.speed + m.phase) * m.ampX;
          const dy = Math.cos(t * m.speed * 0.85 + m.phase) * m.ampY;
          el.style.transform = `translate(${dx}px, ${dy}px)`;
        });
        frameId = requestAnimationFrame(loop);
      }
      frameId = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(frameId);
    }, []);

    const base =
      'absolute rounded-full pointer-events-none bg-[radial-gradient(circle_at_30%_30%,_#A6A0E8,_#7d76c9)]';

    return (
      <>
        <div
          ref={(el) => {
            refs.current[0] = el;
          }}
          className={`${base} opacity-50 w-[220px] h-[220px] -top-[70px] -left-[60px]`}
        />
        <div
          ref={(el) => {
            refs.current[1] = el;
          }}
          className={`${base} opacity-40 w-[70px] h-[70px] top-[8%] left-[12%]`}
        />
        <div
          ref={(el) => {
            refs.current[2] = el;
          }}
          className={`${base} opacity-45 w-[160px] h-[160px] -top-[40px] -right-[70px]`}
        />
        <div
          ref={(el) => {
            refs.current[3] = el;
          }}
          className={`${base} opacity-50 w-[200px] h-[200px] -bottom-[80px] -left-[50px]`}
        />
        <div
          ref={(el) => {
            refs.current[4] = el;
          }}
          className={`${base} opacity-35 w-[50px] h-[50px] bottom-[28%] left-[6%]`}
        />
        <div
          ref={(el) => {
            refs.current[5] = el;
          }}
          className={`${base} opacity-45 w-[140px] h-[140px] bottom-[6%] -right-[60px]`}
        />
        <div
          ref={(el) => {
            refs.current[6] = el;
          }}
          className={`${base} opacity-40 w-[95px] h-[95px] top-[38%] -right-[40px]`}
        />
        <div
          ref={(el) => {
            refs.current[7] = el;
          }}
          className={`${base} opacity-30 w-[55px] h-[55px] top-[16%] right-[18%]`}
        />
        <div
          ref={(el) => {
            refs.current[8] = el;
          }}
          className={`${base} opacity-30 w-[65px] h-[65px] top-[45%] left-[2%]`}
        />
        <div
          ref={(el) => {
            refs.current[9] = el;
          }}
          className={`${base} opacity-30 w-[60px] h-[60px] top-[52%] right-[4%]`}
        />
        <div
          ref={(el) => {
            refs.current[10] = el;
          }}
          className={`${base} opacity-25 w-[45px] h-[45px] top-[3%] left-[45%]`}
        />
        <div
          ref={(el) => {
            refs.current[11] = el;
          }}
          className={`${base} opacity-25 w-[50px] h-[50px] bottom-[4%] left-[42%]`}
        />

        <div
          className="absolute inset-0 transition-opacity duration-150 pointer-events-none"
          style={{ background: tint ?? undefined, opacity: tint ? 0.35 : 0 }}
        />
      </>
    );
  }

  return (
    <>
      <div className="relative w-full h-full min-h-[640px] bg-[#2E2A6B] overflow-hidden flex items-center justify-center px-4 py-8">
        <Blobs />
      </div>
    </>
  );
}

export default Perfil;
