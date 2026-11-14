'use client';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';

export interface DriftWallItem {
  image: string;
  title?: string;
  href?: string;
}

interface DriftWallProps<T extends DriftWallItem> {
  items?: T[];
  columns?: number;
  tileWidth?: number;
  tileHeight?: number;
  gap?: number;
  radius?: number;
  tilt?: number;
  turn?: number;
  roll?: number;
  perspective?: number;
  depth?: number;
  speed?: number;
  direction?: 'up' | 'down';
  variance?: number;
  parallax?: number;
  pauseOnHover?: boolean;
  lift?: number;
  fade?: number;
  dim?: number;
  grayscale?: boolean;
  overlayColor?: string;
  className?: string;
  style?: React.CSSProperties;
  onItemClick?: (item: T) => void;
}

const DEFAULT_ITEMS: DriftWallItem[] = Array.from({ length: 15 }, (_, i) => {
  const ids = [1015, 1025, 1039, 1043, 1044, 1050, 1062, 1069, 1074, 1080, 1084, 106, 110, 133, 164];
  return {
    image: `https://picsum.photos/id/${ids[i % ids.length]}/600/400`,
    title: `Tile ${i + 1}`,
    href: undefined,
  };
});

const cx = (...parts: Array<string | false | undefined>): string =>
  parts.filter(Boolean).join(' ');

const columnFactor = (index: number, variance: number): number => {
  const pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1;
  return 1 + variance * pseudo;
};

export default function DriftWall<T extends DriftWallItem = DriftWallItem>({
  items = DEFAULT_ITEMS as T[],
  columns = 5,
  tileWidth = 200,
  tileHeight = 132,
  gap = 18,
  radius = 14,
  tilt = 16,
  turn = -14,
  roll = 0,
  perspective = 1200,
  depth = 120,
  speed = 42,
  direction = 'up',
  variance = 0.45,
  parallax = 0.6,
  pauseOnHover = false,
  lift = 64,
  fade = 0.6,
  dim = 0.55,
  grayscale = false,
  overlayColor = '#060010',
  className = '',
  style,
  onItemClick
}: DriftWallProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const trackRefs = useRef<Array<HTMLDivElement | null>>([]);

  const [containerHeight, setContainerHeight] = useState(600);
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeIdRef = useRef<string | null>(null);

  // GSAP animated properties
  const pointerPos = useRef({ x: 0, y: 0 });
  const columnOffsets = useRef<number[]>([]);

  const columnItems = useMemo(() => {
    const cols: T[][] = Array.from({ length: columns }, () => []);
    items.forEach((item, i) => cols[i % columns].push(item));
    return cols.map((col) => (col.length ? col : (items.slice(0, 1) as T[])));
  }, [items, columns]);

  const columnMeta = useMemo(() => {
    const unit = tileHeight + gap;
    return columnItems.map((col) => {
      const copyHeight = Math.max(unit, col.length * unit);
      const copies = Math.max(2, Math.ceil((containerHeight * 1.6) / copyHeight) + 1);
      return { copyHeight, copies };
    });
  }, [columnItems, tileHeight, gap, containerHeight]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerHeight(entry.contentRect.height || 600);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const baseVelocities = useMemo(() => {
    const dirSign = direction === 'up' ? 1 : -1;
    return columnItems.map((_, c) => {
      const altSign = c % 2 === 0 ? 1 : -1;
      return speed * columnFactor(c, variance) * dirSign * altSign;
    });
  }, [columnItems, speed, direction, variance]);

  const hoveredColRef = useRef(-1);

  // GSAP Ticker driven smooth animation loop
  useEffect(() => {
    columnOffsets.current = columnMeta.map((meta, c) => meta.copyHeight * ((c * 0.37) % 1));

    const updateWall = () => {
      // 1. Smooth Drifting Columns (Pauses column when hovered)
      const deltaSeconds = gsap.ticker.deltaRatio(60) / 60;
      trackRefs.current.forEach((el, c) => {
        const meta = columnMeta[c];
        if (!el || !meta) return;

        // Pause drifting for the column currently hovered
        const isColumnHovered = hoveredColRef.current === c;
        const vel = isColumnHovered ? 0 : (baseVelocities[c] || 0);

        let next = columnOffsets.current[c] + vel * deltaSeconds;
        next = ((next % meta.copyHeight) + meta.copyHeight) % meta.copyHeight;
        columnOffsets.current[c] = next;

        gsap.set(el, { y: -next });
      });
    };

    gsap.ticker.add(updateWall);
    return () => {
      gsap.ticker.remove(updateWall);
    };
  }, [columnMeta, baseVelocities]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      if (parallax > 0) {
        pointerPos.current = {
          x: (e.clientX - rect.left) / rect.width - 0.5,
          y: (e.clientY - rect.top) / rect.height - 0.5
        };
      }
    },
    [parallax]
  );

  const handlePointerLeaveWall = useCallback(() => {
    pointerPos.current = { x: 0, y: 0 };
    hoveredColRef.current = -1;
    activeIdRef.current = null;
    setActiveId(null);
  }, []);

  const maskStyle =
    'radial-gradient(ellipse 78% 82% at 50% 46%, #000 var(--dw-edge), transparent 100%), ' +
    'linear-gradient(to top, #000 var(--dw-edge), transparent 100%)';

  const cssVars = useMemo<React.CSSProperties>(
    () =>
      ({
        '--dw-tile-w': `${tileWidth}px`,
        '--dw-tile-h': `${tileHeight}px`,
        '--dw-gap': `${gap}px`,
        '--dw-radius': `${radius}px`,
        '--dw-lift': `${lift}px`,
        '--dw-dim': dim,
        '--dw-gray': grayscale ? 1 : 0,
        '--dw-overlay': overlayColor,
        '--dw-edge': `${Math.max(0, (1 - fade) * 100)}%`,
        perspective: `${perspective}px`,
        perspectiveOrigin: '50% 50%',
        WebkitMaskImage: maskStyle,
        maskImage: maskStyle,
        WebkitMaskComposite: 'source-in',
        maskComposite: 'intersect',
        ...style
      }) as React.CSSProperties,
    [tileWidth, tileHeight, gap, radius, lift, dim, grayscale, overlayColor, fade, perspective, style]
  );

  const tileClass = cx(
    'group/tile relative block flex-none cursor-pointer outline-none',
    'w-full h-[calc(var(--dw-tile-h)+var(--dw-gap))]'
  );
  const innerClass = cx(
    'pointer-events-none absolute inset-[calc(var(--dw-gap)/2)] block overflow-hidden bg-[#0b0b12]',
    'rounded-[var(--dw-radius)] opacity-[var(--dw-dim)] [backface-visibility:hidden] [will-change:transform,opacity]',
    'transition-all duration-200 ease-out',
    'group-hover/tile:opacity-100 group-hover/tile:[transform:scale(1.06)_translateZ(1px)] group-hover/tile:shadow-[0_24px_60px_-10px_rgba(0,0,0,0.95)]',
    'group-[.is-active]/tile:opacity-100 group-[.is-active]/tile:[transform:scale(1.06)_translateZ(1px)]',
    'group-[.is-active]/tile:shadow-[0_24px_60px_-10px_rgba(0,0,0,0.95)]',
    'group-focus-visible/tile:opacity-100 group-focus-visible/tile:[transform:scale(1.06)_translateZ(1px)]',
    'group-focus-visible/tile:shadow-[0_24px_60px_-10px_rgba(0,0,0,0.95),0_0_0_2px_rgba(255,255,255,0.9)]'
  );
  const imgClass = cx(
    'block h-full w-full select-none object-cover',
    '[filter:grayscale(var(--dw-gray))_saturate(0.92)]',
    'transition-[filter] duration-200 ease-out',
    'group-hover/tile:[filter:grayscale(0)_saturate(1.08)] group-[.is-active]/tile:[filter:grayscale(0)_saturate(1.08)] group-focus-visible/tile:[filter:grayscale(0)_saturate(1.08)]'
  );
  const overlayClass = cx(
    'pointer-events-none absolute inset-0 bg-[var(--dw-overlay)] opacity-[0.42]',
    'transition-opacity duration-200 ease-out',
    'group-hover/tile:opacity-0 group-[.is-active]/tile:opacity-0 group-focus-visible/tile:opacity-0'
  );

  const pointerStartPos = useRef({ x: 0, y: 0 });

  const renderTile = (item: T, id: string, colIndex: number) => {
    const inner = (
      <span className={innerClass}>
        <img
          src={item.image}
          alt={item.title ?? ''}
          loading="lazy"
          decoding="async"
          draggable={false}
          className={imgClass}
        />
        <span className={overlayClass} aria-hidden="true" />
      </span>
    );

    const fireItemClick = () => {
      if (onItemClick) {
        onItemClick(item);
      }
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      pointerStartPos.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
      const dx = Math.abs(e.clientX - pointerStartPos.current.x);
      const dy = Math.abs(e.clientY - pointerStartPos.current.y);
      if (dx < 12 && dy < 12) {
        fireItemClick();
      }
    };

    const handleTileClick = (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      fireItemClick();
    };

    const isTileActive = activeId === id;

    return (
      <div
        key={id}
        tabIndex={0}
        role="button"
        aria-label={item.title ?? 'tile'}
        className={cx(tileClass, isTileActive && 'is-active')}
        style={{ zIndex: isTileActive ? 50 : 1 }}
        data-tile-id={id}
        data-col={colIndex}
        onPointerEnter={() => {
          activeIdRef.current = id;
          hoveredColRef.current = colIndex;
          setActiveId(id);
        }}
        onPointerLeave={() => {
          if (activeIdRef.current === id) {
            activeIdRef.current = null;
            hoveredColRef.current = -1;
            setActiveId(null);
          }
        }}
        onFocus={() => {
          activeIdRef.current = id;
          hoveredColRef.current = colIndex;
          setActiveId(id);
        }}
        onBlur={() => {
          activeIdRef.current = null;
          hoveredColRef.current = -1;
          setActiveId(null);
        }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onClick={handleTileClick}
      >
        {inner}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={cx('relative h-full w-full overflow-hidden', className)}
      style={cssVars}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeaveWall}
      role="group"
      aria-label="Drifting wall of tiles"
    >
      <div
        ref={planeRef}
        className="absolute left-[44%] top-1/2 flex cursor-pointer flex-row [transform-style:preserve-3d] [transform-origin:50%_50%] will-change-transform"
        style={{
          transform: `translate(-50%, -50%) scale(1.18) rotateX(${tilt}deg) rotateY(${turn}deg) rotateZ(${roll}deg) translateZ(${-depth}px)`
        }}
      >
        {columnItems.map((col, c) => {
          const meta = columnMeta[c];
          const copies = Array.from({ length: meta.copies });
          const isColHovered = hoveredColRef.current === c;

          return (
            <div
              className="relative w-[calc(var(--dw-tile-w)+var(--dw-gap))]"
              style={{ zIndex: isColHovered ? 40 : c }}
              key={`col-${c}`}
            >
              <div
                className="flex flex-col will-change-transform"
                ref={(el) => {
                  trackRefs.current[c] = el;
                }}
              >
                {copies.map((_, copyIndex) =>
                  col.map((item, itemIndex) => renderTile(item, `${c}-${copyIndex}-${itemIndex}`, c))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
