'use client';

import { useEffect, useRef } from "react";

export function useGalleryTouchEvents() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeCard = useRef<Element | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const getCard = (target: EventTarget | null) =>
      (target instanceof HTMLElement) ? target.closest('.gallery-card') : null;

    // Add active state by simulating hover
    const activateCard = (card: Element | null) => {
      if (!card || card === activeCard.current) return;
      
      // Remove previous active state
      if (activeCard.current) {
        activeCard.current.classList.remove('touch-active');
      }
      
      // Add active state to current card
      card.classList.add('touch-active');
      activeCard.current = card;
    };

    const deactivateCard = () => {
      if (activeCard.current) {
        activeCard.current.classList.remove('touch-active');
        activeCard.current = null;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      const card = getCard(e.target);
      if (card) {
        activateCard(card);
      }
    };

    const handleTouchEnd = () => {
      deactivateCard();
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        const card = getCard(element);
        
        if (card !== activeCard.current) {
          activateCard(card);
        }
      }
    };

    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });
    container.addEventListener("touchcancel", handleTouchEnd, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("touchcancel", handleTouchEnd);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return containerRef;
}
