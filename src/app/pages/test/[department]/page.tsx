'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function ZoomImage() {
  const [zoomed, setZoomed] = useState(false);

  // Customize these values as needed
  const zoomLevel = 4; // Scale factor (e.g. 2 = 200%)
  const zoomOrigin = '50% 50%'; // X Y (e.g. left bottom = '0% 100%', center = '50% 50%')

  return (
    <div className="relative w-[500px] h-[500px] overflow-hidden border rounded">
      <div
        className="w-full h-full transition-transform duration-500 ease-in-out"
        style={{
          transform: zoomed ? `scale(${zoomLevel})` : 'scale(1)',
          transformOrigin: zoomed ? zoomOrigin : 'center center',
        }}
      >
        <Image
          src={`/IE.jpg`}
          alt="Zoomable"
          fill
          className="object-contain rounded pointer-events-none select-none"
          sizes="(max-width: 768px) 100vw, 83vw"
          quality={100}
          priority
        />
      </div>

      <button
        onClick={() => setZoomed(!zoomed)}
        className="absolute top-2 right-2 bg-white p-2 rounded shadow"
      >
        {zoomed ? 'Reset' : 'Zoom'}
      </button>
    </div>
  );
}

