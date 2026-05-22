'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MousePointerClick, Package } from 'lucide-react';
import { useGalleryTouchEvents } from './touch-event';

export default function AvatarGallery6() {
  const galleryRef = useGalleryTouchEvents();
  const galleryItems = [
    { id: 1, linkid: "anime-cinema", name: "Anime Cinema" },
    { id: 2, linkid: "cyber", name: "Cyber" },
    { id: 3, linkid: "linkedin", name: "LinkedIn" },
    { id: 4, linkid: "manga", name: "Manga" },
    { id: 5, linkid: "marvel", name: "Marvel" },
    { id: 6, linkid: "noir", name: "Noir" },
    { id: 7, linkid: "pencil-sketch", name: "Pencil Sketch" },
    { id: 8, linkid: "portrait", name: "Portrait" },
    { id: 9, linkid: "scifi", name: "SciFi" },
    { id: 10, linkid: "vintage", name: "Vintage" },
    { id: 11, linkid: "watercolor", name: "Watercolor" },
    { id: 12, linkid: "custom-prompt", name: "Custom Prompt" },
  ];

  return (
    <div ref={galleryRef} className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center space-y-8">
        <div className="relative text-center pt-6 pb-4">
          {/* Icon Container */}
          <div className="flex items-center justify-center mb-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
              <Package className="h-4 w-4" />
              <span>Style Collection</span>
            </div>
          </div>
          {/* Title */}
          <h3 className="mb-3 text-3xl md:text-4xl font-bold tracking-tight">
            <span className="font-medium tracking-tighter dark:text-white">
              Explore
            </span>
            <span className="ml-2 text-muted-foreground font-normal tracking-tighter">
              more styles
            </span>
          </h3>
          {/* Description */}
          <p className="mb-8 max-w-2xl text-md text-gray-700 dark:text-gray-300">
            Discover even more ways to express yourself with our styles collection.
          </p>
        </div>

        {/* Grid - Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
          {galleryItems.map((item) => (
            <div 
              key={item.id}
              className="group gallery-card relative overflow-hidden rounded-xl shadow-lg transition-all duration-400 hover:shadow-2xl transform hover:-translate-y-1"
            >
              <div className="aspect-square overflow-hidden">
                <Image
                  className="h-full w-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-110"
                  src={`/images/avatar/gallery-6/avatar-${item.id}.png`}
                  alt={`AI Avatar ${item.id}`}
                  width={1024}
                  height={1024}
                />
              </div>
              {/* Style Name - Positioned 2/3 from top (1/3 from bottom) */}
              <div className="absolute inset-0 flex items-end pb-16 justify-center opacity-0 transition-opacity duration-400 group-hover:opacity-80">
                <span className="text-white text-2xl font-bold drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)]">
                  {item.name}
                </span>
              </div>
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/30 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
              {/* Card Button */}
              <div className="absolute bottom-4 right-4 opacity-0 transition-all duration-400 transform translate-y-1 group-hover:translate-y-0 group-hover:opacity-100">
                <Link 
                  href={`https://www.instagram.com/babysea.ai`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="rounded-full backdrop-blur-sm bg-black/40 border border-white/30 p-2.5 text-sm font-medium text-white hover:bg-black/60 transition-colors cursor-pointer shadow-sm">
                    <MousePointerClick className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
