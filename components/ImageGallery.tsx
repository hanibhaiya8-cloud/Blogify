'use client'

import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, Move, ChevronLeft, ChevronRight } from 'lucide-react';

export function ImageGallery({ 
  images, 
  initialIndex = 0,
  onClose,
  isModal = false
}: { 
  images: string[], 
  initialIndex?: number,
  onClose?: () => void,
  isModal?: boolean
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsZoomed(false);
    setPosition({ x: 0, y: 0 });
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsZoomed(false);
    setPosition({ x: 0, y: 0 });
  };

  const toggleZoom = () => {
    if (isZoomed) {
      setIsZoomed(false);
      setPosition({ x: 0, y: 0 });
    } else {
      setIsZoomed(true);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isZoomed) return;
    setIsDragging(true);
    setStartPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isZoomed) return;
    
    const newX = e.clientX - startPos.x;
    const newY = e.clientY - startPos.y;
    
    if (imageRef.current) {
      const img = imageRef.current;
      const imgWidth = img.naturalWidth * (isZoomed ? 2 : 1);
      const imgHeight = img.naturalHeight * (isZoomed ? 2 : 1);
      const container = img.parentElement;
      
      if (container) {
        const maxX = Math.max(0, (imgWidth - container.clientWidth) / 2);
        const maxY = Math.max(0, (imgHeight - container.clientHeight) / 2);
        
        setPosition({
          x: Math.max(-maxX, Math.min(maxX, newX)),
          y: Math.max(-maxY, Math.min(maxY, newY)),
        });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!isZoomed) return;
    e.preventDefault();
    
    setPosition(prev => ({
      x: prev.x - e.deltaX,
      y: prev.y - e.deltaY,
    }));
  };

  // Close modal on Escape key
  useEffect(() => {
    if (!isModal) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose?.();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModal, onClose]);

  return (
    <div 
      className={`relative ${isModal ? 'fixed inset-0 bg-black/90 z-50 flex items-center justify-center' : 'w-full h-full'}`}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {isModal && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
          aria-label="Close gallery"
        >
          <X className="w-6 h-6" />
        </button>
      )}

      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <div 
          className="relative w-full h-full flex items-center justify-center"
          style={{
            cursor: isZoomed ? (isDragging ? 'grabbing' : 'grab') : 'default',
          }}
          onMouseDown={handleMouseDown}
        >
          <img
            ref={imageRef}
            src={images[currentIndex]}
            alt={`Gallery image ${currentIndex + 1}`}
            className={`max-w-full max-h-full ${isZoomed ? 'cursor-grab' : 'cursor-zoom-in'}`}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${isZoomed ? 2 : 1})`,
              transition: isDragging ? 'none' : 'transform 0.2s ease',
              transformOrigin: 'center center',
            }}
            onClick={(e) => {
              if (!isZoomed && !isDragging) {
                toggleZoom();
                e.stopPropagation();
              }
            }}
          />
        </div>
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Zoom Controls */}
      <div className="absolute top-4 left-20 -translate-x-1/2 flex gap-2 bg-black/50 rounded-full p-1.5 z-10">
        <button
          onClick={toggleZoom}
          className="p-2 rounded-full text-white hover:bg-white/20 transition-colors"
          aria-label={isZoomed ? 'Zoom out' : 'Zoom in'}
        >
          {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
        </button>
        {isZoomed && (
          <div className="flex items-center px-3 text-white text-sm">
            <Move className="w-4 h-4 mr-1" />
            <span>Drag to pan</span>
          </div>
        )}
      </div>

      {/* Image Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsZoomed(false);
                setPosition({ x: 0, y: 0 });
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-white w-6' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
