'use client';

import { useEffect, useRef } from "react";

/**
 * Returns a ref to be attached to the gallery container.
 * Handles touch and mouse events for all .gallery-card children.
 */
export function useGalleryTouchEvents() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  // Track if a touch is active to prevent mouse event double-firing
  const touchActive = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Add visual effects
    const activateCard = (card: Element | null) => {
      if (!card) return;
      const overlay = card.querySelector('.absolute.bottom-4.right-4');
      const backgroundOverlay = card.querySelector('.absolute.inset-0.bg-gradient-to-b');
      const images = card.querySelectorAll('img');
      
      overlay?.classList.add('opacity-100', 'translate-y-0');
      backgroundOverlay?.classList.add('opacity-100');
      images.forEach(img => img.classList.add('scale-110'));
    };

    // Remove visual effects
    const deactivateCard = (card: Element | null) => {
      if (!card) return;
      const overlay = card.querySelector('.absolute.bottom-4.right-4');
      const backgroundOverlay = card.querySelector('.absolute.inset-0.bg-gradient-to-b');
      const images = card.querySelectorAll('img');
      
      overlay?.classList.remove('opacity-100', 'translate-y-0');
      backgroundOverlay?.classList.remove('opacity-100');
      images.forEach(img => img.classList.remove('scale-110'));
    };

    // Touch events
    const handleTouchStart = (e: Event) => {
      touchActive.current = true;
      const card = (e.target as Element).closest('.gallery-card');
      activateCard(card);
    };

    const handleTouchEnd = (e: Event) => {
      const card = (e.target as Element).closest('.gallery-card');
      deactivateCard(card);
      setTimeout(() => { touchActive.current = false; }, 100);
    };

    const handleTouchCancel = (e: Event) => {
      const card = (e.target as Element).closest('.gallery-card');
      deactivateCard(card);
      setTimeout(() => { touchActive.current = false; }, 100);
    };

    // Mouse events
    const handleMouseEnter = (e: Event) => {
      if (touchActive.current) return;
      const card = e.currentTarget as Element;
      activateCard(card);
    };

    const handleMouseLeave = (e: Event) => {
      if (touchActive.current) return;
      const card = e.currentTarget as Element;
      deactivateCard(card);
    };

    // Attach listeners to each card
    const cards = container.querySelectorAll('.gallery-card');
    cards.forEach((card) => {
      card.addEventListener("touchstart", handleTouchStart, { passive: true });
      card.addEventListener("touchend", handleTouchEnd, { passive: true });
      card.addEventListener("touchcancel", handleTouchCancel, { passive: true });
      card.addEventListener("mouseenter", handleMouseEnter);
      card.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      cards.forEach(card => {
        card.removeEventListener("touchstart", handleTouchStart);
        card.removeEventListener("touchend", handleTouchEnd);
        card.removeEventListener("touchcancel", handleTouchCancel);
        card.removeEventListener("mouseenter", handleMouseEnter);
        card.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  return containerRef;
}
