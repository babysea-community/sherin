'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MousePointerClick, WandSparkles, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGalleryTouchEvents } from './touch-event';

export default function AvatarGallery3() {
  const galleryRef = useGalleryTouchEvents();
  const galleryItems = [
    { id: 1, linkid: "3d0a6ea9-7e47-4fb9-bdde-7237138761b3/avatar-1.png?avatarName=Wonderland&creatorName=Akira%20Yuusha&style=disney" },
    { id: 2, linkid: "ad4f37da-43a9-4590-9028-60584fcb72be/avatar-2.png?avatarName=Chocolate&creatorName=Akira%20Yuusha&style=chibi" },
    { id: 3, linkid: "3d0a6ea9-7e47-4fb9-bdde-7237138761b3/avatar-3.png?avatarName=Wonderland&creatorName=Akira%20Yuusha&style=disney" },
    { id: 4, linkid: "3d0a6ea9-7e47-4fb9-bdde-7237138761b3/avatar-4.png?avatarName=Wonderland&creatorName=Akira%20Yuusha&style=disney" },
    { id: 5, linkid: "ad4f37da-43a9-4590-9028-60584fcb72be/avatar-5.png?avatarName=Chocolate&creatorName=Akira%20Yuusha&style=chibi" },
    { id: 6, linkid: "3d0a6ea9-7e47-4fb9-bdde-7237138761b3/avatar-6.png?avatarName=Wonderland&creatorName=Akira%20Yuusha&style=disney" },
    { id: 7, linkid: "ad4f37da-43a9-4590-9028-60584fcb72be/avatar-7.png?avatarName=Chocolate&creatorName=Akira%20Yuusha&style=chibi" },
    { id: 8, linkid: "3d0a6ea9-7e47-4fb9-bdde-7237138761b3/avatar-8.png?avatarName=Wonderland&creatorName=Akira%20Yuusha&style=disney" },
    { id: 9, linkid: "ad4f37da-43a9-4590-9028-60584fcb72be/avatar-9.png?avatarName=Chocolate&creatorName=Akira%20Yuusha&style=chibi" },
    { id: 10, linkid: "3d0a6ea9-7e47-4fb9-bdde-7237138761b3/avatar-10.png?avatarName=Wonderland&creatorName=Akira%20Yuusha&style=disney" },
    { id: 11, linkid: "ad4f37da-43a9-4590-9028-60584fcb72be/avatar-11.png?avatarName=Chocolate&creatorName=Akira%20Yuusha&style=chibi" },
    { id: 12, linkid: "3d0a6ea9-7e47-4fb9-bdde-7237138761b3/avatar-12.png?avatarName=Wonderland&creatorName=Akira%20Yuusha&style=disney" },
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
              Chibi
            </span>
            <span className="mx-3 text-muted-foreground/40">×</span>
            <span className="text-muted-foreground font-normal tracking-tighter">
              Disney
            </span>
          </h3>
        </div>

        {/* Grid - Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full md:hidden">
          {galleryItems.map((item) => (
            <div 
              key={item.id}
              className="group gallery-card relative overflow-hidden rounded-xl shadow-lg transition-all duration-400 hover:shadow-2xl transform hover:-translate-y-1"
            >
              <div className="aspect-square overflow-hidden">
                <Image
                  className="h-full w-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-110"
                  src={`/images/avatar/gallery-3/avatar-${item.id}.png`}
                  alt={`AI Avatar ${item.id}`}
                  width={1024}
                  height={1024}
                />
              </div>
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
              {/* Card Button */}
              <div className="absolute bottom-4 right-4 opacity-0 transition-all duration-400 transform translate-y-1 group-hover:translate-y-0 group-hover:opacity-100">
                <Link 
                  href={`/card/${item.linkid}`}
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
      
        {/* Grid - Desktop */}
        <div className="hidden md:grid w-full gap-3 md:gap-4 grid-cols-2 md:grid-cols-4 auto-rows-auto">
          {/* Tall portrait */}
          <div className="col-span-2 md:col-span-1 row-span-2">
            <div className="group gallery-card h-full relative overflow-hidden rounded-xl shadow-lg transition-all duration-400 hover:shadow-2xl transform hover:-translate-y-1">
              <div className="aspect-[3/5] h-full w-full overflow-hidden">
                <Image
                  className="h-full w-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-110"
                  src="/images/avatar/gallery-3/avatar-1.png"
                  alt="AI Avatar 1"
                  width={600}
                  height={1000}
                />
              </div>
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
              {/* Card Button */}
              <div className="absolute bottom-4 right-4 opacity-0 transition-all duration-400 transform translate-y-1 group-hover:translate-y-0 group-hover:opacity-100">
                <Link
                  href={`/card/${galleryItems[0]!.linkid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="rounded-full backdrop-blur-sm bg-black/40 border border-white/30 p-2.5 text-sm font-medium text-white hover:bg-black/60 transition-colors cursor-pointer shadow-sm">
                    <MousePointerClick className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        
          {/* Square - 1/4 width */}
          <div className="col-span-1 row-span-1">
            <div className="group gallery-card h-full relative overflow-hidden rounded-xl shadow-lg transition-all duration-400 hover:shadow-2xl transform hover:-translate-y-1">
              <div className="aspect-square h-full w-full overflow-hidden">
                <Image
                  className="h-full w-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-110"
                  src="/images/avatar/gallery-3/avatar-2.png"
                  alt="AI Avatar 2"
                  width={800}
                  height={800}
                />
              </div>
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
              {/* Card Button */}
              <div className="absolute bottom-4 right-4 opacity-0 transition-all duration-400 transform translate-y-1 group-hover:translate-y-0 group-hover:opacity-100">
                <Link
                  href={`/card/${galleryItems[1]!.linkid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="rounded-full backdrop-blur-sm bg-black/40 border border-white/30 p-2.5 text-sm font-medium text-white hover:bg-black/60 transition-colors cursor-pointer shadow-sm">
                    <MousePointerClick className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        
          {/* Wide rectangle */}
          <div className="col-span-2 row-span-1">
            <div className="group gallery-card h-full relative overflow-hidden rounded-xl shadow-lg transition-all duration-400 hover:shadow-2xl transform hover:-translate-y-1">
              <div className="aspect-[16/9] h-full w-full overflow-hidden">
                <Image
                  className="h-full w-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-110"
                  src="/images/avatar/gallery-3/avatar-3.png"
                  alt="AI Avatar 3"
                  width={1024}
                  height={576}
                />
              </div>
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
              {/* Card Button */}
              <div className="absolute bottom-4 right-4 opacity-0 transition-all duration-400 transform translate-y-1 group-hover:translate-y-0 group-hover:opacity-100">
                <Link
                  href={`/card/${galleryItems[2]!.linkid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="rounded-full backdrop-blur-sm bg-black/40 border border-white/30 p-2.5 text-sm font-medium text-white hover:bg-black/60 transition-colors cursor-pointer shadow-sm">
                    <MousePointerClick className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        
          {/* Portrait - 1/4 width */}
          <div className="col-span-1 row-span-1">
            <div className="group gallery-card h-full relative overflow-hidden rounded-xl shadow-lg transition-all duration-400 hover:shadow-2xl transform hover:-translate-y-1">
              <div className="aspect-[3/4] h-full w-full overflow-hidden">
                <Image
                  className="h-full w-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-110"
                  src="/images/avatar/gallery-3/avatar-4.png"
                  alt="AI Avatar 4"
                  width={768}
                  height={1024}
                />
              </div>
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
              {/* Card Button */}
              <div className="absolute bottom-4 right-4 opacity-0 transition-all duration-400 transform translate-y-1 group-hover:translate-y-0 group-hover:opacity-100">
                <Link
                  href={`/card/${galleryItems[3]!.linkid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="rounded-full backdrop-blur-sm bg-black/40 border border-white/30 p-2.5 text-sm font-medium text-white hover:bg-black/60 transition-colors cursor-pointer shadow-sm">
                    <MousePointerClick className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        
          {/* Square - 1/4 width */}
          <div className="col-span-1 row-span-1">
            <div className="group gallery-card h-full relative overflow-hidden rounded-xl shadow-lg transition-all duration-400 hover:shadow-2xl transform hover:-translate-y-1">
              <div className="aspect-square h-full w-full overflow-hidden">
                <Image
                  className="h-full w-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-110"
                  src="/images/avatar/gallery-3/avatar-5.png"
                  alt="AI Avatar 5"
                  width={800}
                  height={800}
                />
              </div>
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
              {/* Card Button */}
              <div className="absolute bottom-4 right-4 opacity-0 transition-all duration-400 transform translate-y-1 group-hover:translate-y-0 group-hover:opacity-100">
                <Link
                  href={`/card/${galleryItems[4]!.linkid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="rounded-full backdrop-blur-sm bg-black/40 border border-white/30 p-2.5 text-sm font-medium text-white hover:bg-black/60 transition-colors cursor-pointer shadow-sm">
                    <MousePointerClick className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        
          {/* Vertical Rectangle */}
          <div className="col-span-2 md:col-span-1 row-span-2">
            <div className="group gallery-card h-full relative overflow-hidden rounded-xl shadow-lg transition-all duration-400 hover:shadow-2xl transform hover:-translate-y-1">
              <div className="aspect-[2/3] h-full w-full overflow-hidden">
                <Image
                  className="h-full w-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-110"
                  src="/images/avatar/gallery-3/avatar-6.png"
                  alt="AI Avatar 6"
                  width={800}
                  height={1200}
                />
              </div>
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
              {/* Card Button */}
              <div className="absolute bottom-4 right-4 opacity-0 transition-all duration-400 transform translate-y-1 group-hover:translate-y-0 group-hover:opacity-100">
                <Link
                  href={`/card/${galleryItems[5]!.linkid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="rounded-full backdrop-blur-sm bg-black/40 border border-white/30 p-2.5 text-sm font-medium text-white hover:bg-black/60 transition-colors cursor-pointer shadow-sm">
                    <MousePointerClick className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        
          {/* Square - 1/4 width */}
          <div className="col-span-1 row-span-1">
            <div className="group gallery-card h-full relative overflow-hidden rounded-xl shadow-lg transition-all duration-400 hover:shadow-2xl transform hover:-translate-y-1">
              <div className="aspect-square h-full w-full overflow-hidden">
                <Image
                  className="h-full w-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-110"
                  src="/images/avatar/gallery-3/avatar-7.png"
                  alt="AI Avatar 7"
                  width={800}
                  height={800}
                />
              </div>
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
              {/* Card Button */}
              <div className="absolute bottom-4 right-4 opacity-0 transition-all duration-400 transform translate-y-1 group-hover:translate-y-0 group-hover:opacity-100">
                <Link
                  href={`/card/${galleryItems[6]!.linkid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="rounded-full backdrop-blur-sm bg-black/40 border border-white/30 p-2.5 text-sm font-medium text-white hover:bg-black/60 transition-colors cursor-pointer shadow-sm">
                    <MousePointerClick className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        
          {/* Landscape */}
          <div className="col-span-2 row-span-1">
            <div className="group gallery-card h-full relative overflow-hidden rounded-xl shadow-lg transition-all duration-400 hover:shadow-2xl transform hover:-translate-y-1">
              <div className="aspect-[16/9] h-full w-full overflow-hidden">
                <Image
                  className="h-full w-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-110"
                  src="/images/avatar/gallery-3/avatar-8.png"
                  alt="AI Avatar 8"
                  width={1024}
                  height={576}
                />
              </div>
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
              {/* Card Button */}
              <div className="absolute bottom-4 right-4 opacity-0 transition-all duration-400 transform translate-y-1 group-hover:translate-y-0 group-hover:opacity-100">
                <Link
                  href={`/card/${galleryItems[7]!.linkid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="rounded-full backdrop-blur-sm bg-black/40 border border-white/30 p-2.5 text-sm font-medium text-white hover:bg-black/60 transition-colors cursor-pointer shadow-sm">
                    <MousePointerClick className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        
          {/* Vertical Rectangle - 1/4 width */}
          <div className="col-span-1 row-span-1">
            <div className="group gallery-card h-full relative overflow-hidden rounded-xl shadow-lg transition-all duration-400 hover:shadow-2xl transform hover:-translate-y-1">
              <div className="aspect-[3/4] h-full w-full overflow-hidden">
                <Image
                  className="h-full w-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-110"
                  src="/images/avatar/gallery-3/avatar-9.png"
                  alt="AI Avatar 9"
                  width={768}
                  height={1024}
                />
              </div>
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
              {/* Card Button */}
              <div className="absolute bottom-4 right-4 opacity-0 transition-all duration-400 transform translate-y-1 group-hover:translate-y-0 group-hover:opacity-100">
                <Link
                  href={`/card/${galleryItems[8]!.linkid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="rounded-full backdrop-blur-sm bg-black/40 border border-white/30 p-2.5 text-sm font-medium text-white hover:bg-black/60 transition-colors cursor-pointer shadow-sm">
                    <MousePointerClick className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        
          {/* Extra Tall Portrait */}
          <div className="col-span-2 md:col-span-1 row-span-2">
            <div className="group gallery-card h-full relative overflow-hidden rounded-xl shadow-lg transition-all duration-400 hover:shadow-2xl transform hover:-translate-y-1">
              <div className="aspect-[9/16] h-full w-full overflow-hidden">
                <Image
                  className="h-full w-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-110"
                  src="/images/avatar/gallery-3/avatar-10.png"
                  alt="AI Avatar 10"
                  width={576}
                  height={1024}
                />
              </div>
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
              {/* Card Button */}
              <div className="absolute bottom-4 right-4 opacity-0 transition-all duration-400 transform translate-y-1 group-hover:translate-y-0 group-hover:opacity-100">
                <Link
                  href={`/card/${galleryItems[9]!.linkid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="rounded-full backdrop-blur-sm bg-black/40 border border-white/30 p-2.5 text-sm font-medium text-white hover:bg-black/60 transition-colors cursor-pointer shadow-sm">
                    <MousePointerClick className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        
          {/* Square - 1/4 width */}
          <div className="col-span-1 row-span-1">
            <div className="group gallery-card h-full relative overflow-hidden rounded-xl shadow-lg transition-all duration-400 hover:shadow-2xl transform hover:-translate-y-1">
              <div className="aspect-square h-full w-full overflow-hidden">
                <Image
                  className="h-full w-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-110"
                  src="/images/avatar/gallery-3/avatar-11.png"
                  alt="AI Avatar 11"
                  width={800}
                  height={800}
                />
              </div>
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
              {/* Card Button */}
              <div className="absolute bottom-4 right-4 opacity-0 transition-all duration-400 transform translate-y-1 group-hover:translate-y-0 group-hover:opacity-100">
                <Link
                  href={`/card/${galleryItems[10]!.linkid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="rounded-full backdrop-blur-sm bg-black/40 border border-white/30 p-2.5 text-sm font-medium text-white hover:bg-black/60 transition-colors cursor-pointer shadow-sm">
                    <MousePointerClick className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        
          {/* Extra Tall Portrait */}
          <div className="col-span-2 md:col-span-1 row-span-2">
            <div className="group gallery-card h-full relative overflow-hidden rounded-xl shadow-lg transition-all duration-400 hover:shadow-2xl transform hover:-translate-y-1">
              <div className="aspect-[9/16] h-full w-full overflow-hidden">
                <Image
                  className="h-full w-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-110"
                  src="/images/avatar/gallery-3/avatar-12.png"
                  alt="AI Avatar 12"
                  width={576}
                  height={1024}
                />
              </div>
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
              {/* Card Button */}
              <div className="absolute bottom-4 right-4 opacity-0 transition-all duration-400 transform translate-y-1 group-hover:translate-y-0 group-hover:opacity-100">
                <Link
                  href={`/card/${galleryItems[11]!.linkid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="rounded-full backdrop-blur-sm bg-black/40 border border-white/30 p-2.5 text-sm font-medium text-white hover:bg-black/60 transition-colors cursor-pointer shadow-sm">
                    <MousePointerClick className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      
        {/* Gallery Buttons - Side by Side on all devices */}
        <div className="mt-6 flex flex-row items-center justify-center space-x-4 w-full">
          {/* Sign Up Button */}
          <Link
            href="/"
            className="flex-1 sm:max-w-[180px] group"
            rel="noopener noreferrer"
          >
            <Button className="w-full">
              <span className="flex items-center justify-center">
                Create like this
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-400 group-hover:translate-x-1" />
              </span>
            </Button>
          </Link>
          
          {/* Explore Button */}
          <Link
            href="https://www.instagram.com/babysea.ai"
            className="flex-1 sm:max-w-[180px] group"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="w-full">
              <span className="flex items-center justify-center">
                Explore styles
                <WandSparkles className="ml-2 h-4 w-4 transition-transform duration-400 group-hover:translate-x-1" />
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
