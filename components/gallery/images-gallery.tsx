'use client';

import Image from 'next/image';
import { Package } from 'lucide-react';
import { useGalleryTouchEvents } from './touch-event';

export default function ImagesGallery() {
  const galleryRef = useGalleryTouchEvents();
  
  // All Gallery Items (1-24)
  const galleryItems = [
    { id: 1, imageUrl: "https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/8d74a98a-86a5-494c-67a0-c5476336c900/600x1000" },
    { id: 2, imageUrl: "https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/5675a179-53f6-40dc-9615-0919bd435b00/800x800" },
    { id: 3, imageUrl: "https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/79dddf5d-07ae-42dc-f659-6442e45a0200/1024x576" },
    { id: 4, imageUrl: "https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/1eca326f-f67f-4afd-a215-8aedc9a93900/768x1024" },
    { id: 5, imageUrl: "https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/99650c27-d334-42c4-c205-78153ad49e00/800x800" },
    { id: 6, imageUrl: "https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/27d4882a-829a-4e9d-94e8-f002202f5e00/800x1200" },
    { id: 7, imageUrl: "https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/e76bacbf-df83-4097-519e-04df05071f00/800x800" },
    { id: 8, imageUrl: "https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/42ef0a74-eb8c-444b-6654-dbb450a84f00/1024x576" },
    { id: 9, imageUrl: "https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/7212c266-3198-464d-eae5-441e6f314000/768x1024" },
    { id: 10, imageUrl: "https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/8f1badec-5746-4d43-a4d2-62a9fb4f5600/576x1024" },
    { id: 11, imageUrl: "https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/ac995e42-03de-40ac-3476-6482d80bd600/800x800" },
    { id: 12, imageUrl: "https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/de9e325f-b971-45b1-6fd3-c2c1de475c00/576x1024" },
    { id: 13, imageUrl: "https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/84374b79-f96e-49bc-a29b-c824645f0400/600x1000" },
    { id: 14, imageUrl: "https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/7187918b-6d7a-43f7-c36d-dca2a9967b00/800x800" },
    { id: 15, imageUrl: "https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/67cc3373-139e-41aa-7518-13cd70269b00/1024x576" },
    { id: 16, imageUrl: "https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/f7fae846-cb13-402a-0361-e2f1dcc88c00/768x1024" },
    { id: 17, imageUrl: "https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/4c2dafe9-4a62-4570-333d-028acf446c00/800x800" },
    { id: 18, imageUrl: "https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/9b08b444-e1a4-427f-be10-cf75244a0300/800x1200" },
    { id: 19, imageUrl: "https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/587dbaae-b23b-4d0f-212b-beb6ac7a6600/800x800" },
    { id: 20, imageUrl: "https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/a39539d0-7719-4585-218e-e217e3cb6900/1024x576" },
    { id: 21, imageUrl: "https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/ffa2054c-f19d-4d70-7d4f-ab0bf5375200/768x1024" },
    { id: 22, imageUrl: "https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/8d9da5f6-a109-4da7-2267-41fa028c6200/576x1024" },
    { id: 23, imageUrl: "https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/bd48ece9-8cda-4f02-5715-e91bff9d2400/800x800" },
    { id: 24, imageUrl: "https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/5671495e-8da2-446b-7d36-08752d19e500/1280x720" }
  ];

  return (
    <div ref={galleryRef} className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center space-y-8">
        <div className="relative text-center pt-6 pb-4">
          <div className="flex items-center justify-center mb-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
              <Package className="h-4 w-4" />
              <span>Collection</span>
            </div>
          </div>
          <h3 className="mb-3 text-3xl md:text-4xl font-bold tracking-tight">
            <span className="font-medium tracking-tighter dark:text-white">
              Images
            </span>
            <span className="mx-3 text-muted-foreground/40">×</span>
            <span className="text-muted-foreground font-normal tracking-tighter">
              Gallery
            </span>
          </h3>
        </div>

        {/* Grid - Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full md:hidden">
          {galleryItems.slice(0, 12).map((item) => (
            <div 
              key={item.id}
              className="group gallery-card relative overflow-hidden rounded-xl shadow-lg transition-all duration-400 hover:shadow-2xl transform hover:-translate-y-1"
            >
              <div className="aspect-square overflow-hidden">
                <Image
                  className="h-full w-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-110"
                  src={item.imageUrl}
                  alt="BabySea - Multimodal AI for Creative Generation Workflows"
                  width={1024}
                  height={1024}
                  unoptimized
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
            </div>
          ))}
        </div>
      
        {/* Grid - Desktop */}
        <div className="hidden md:grid w-full gap-3 md:gap-4 grid-cols-2 md:grid-cols-4 auto-rows-auto">
          <div className="col-span-2 md:col-span-1 row-span-2">
            <div className="group gallery-card h-full relative overflow-hidden rounded-xl shadow-lg transition-all duration-400 hover:shadow-2xl transform hover:-translate-y-1">
              <div className="aspect-[3/5] h-full w-full overflow-hidden">
                <Image
                  className="h-full w-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-110"
                  src={galleryItems[0]!.imageUrl}
                  alt="BabySea - Multimodal AI for Creative Generation Workflows"
                  width={600}
                  height={1000}
                  unoptimized
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
            </div>
          </div>
        
          <div className="col-span-1 row-span-1">
            <div className="group gallery-card h-full relative overflow-hidden rounded-xl shadow-lg transition-all duration-400 hover:shadow-2xl transform hover:-translate-y-1">
              <div className="aspect-square h-full w-full overflow-hidden">
                <Image
                  className="h-full w-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-110"
                  src={galleryItems[1]!.imageUrl}
                  alt="BabySea - Multimodal AI for Creative Generation Workflows"
                  width={800}
                  height={800}
                  unoptimized
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
            </div>
          </div>
        
          <div className="col-span-2 row-span-1">
            <div className="group gallery-card h-full relative overflow-hidden rounded-xl shadow-lg transition-all duration-400 hover:shadow-2xl transform hover:-translate-y-1">
              <div className="aspect-[16/9] h-full w-full overflow-hidden">
                <Image
                  className="h-full w-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-110"
                  src={galleryItems[2]!.imageUrl}
                  alt="BabySea - Multimodal AI for Creative Generation Workflows"
                  width={1024}
                  height={576}
                  unoptimized
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
            </div>
          </div>
        
          <div className="col-span-1 row-span-1">
            <div className="group gallery-card h-full relative overflow-hidden rounded-xl shadow-lg transition-all duration-400 hover:shadow-2xl transform hover:-translate-y-1">
              <div className="aspect-[3/4] h-full w-full overflow-hidden">
                <Image
                  className="h-full w-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-110"
                  src={galleryItems[3]!.imageUrl}
                  alt="BabySea - Multimodal AI for Creative Generation Workflows"
                  width={768}
                  height={1024}
                  unoptimized
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
            </div>
          </div>
        
          <div className="col-span-1 row-span-1">
            <div className="group gallery-card h-full relative overflow-hidden rounded-xl shadow-lg transition-all duration-400 hover:shadow-2xl transform hover:-translate-y-1">
              <div className="aspect-square h-full w-full overflow-hidden">
                <Image
                  className="h-full w-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-110"
                  src={galleryItems[4]!.imageUrl}
                  alt="BabySea - Multimodal AI for Creative Generation Workflows"
                  width={800}
                  height={800}
                  unoptimized
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
            </div>
          </div>
        
          <div className="col-span-2 md:col-span-1 row-span-2">
            <div className="group gallery-card h-full relative overflow-hidden rounded-xl shadow-lg transition-all duration-400 hover:shadow-2xl transform hover:-translate-y-1">
              <div className="aspect-[2/3] h-full w-full overflow-hidden">
                <Image
                  className="h-full w-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-110"
                  src={galleryItems[5]!.imageUrl}
                  alt="BabySea - Multimodal AI for Creative Generation Workflows"
                  width={800}
                  height={1200}
                  unoptimized
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
            </div>
          </div>
        
          <div className="col-span-1 row-span-1">
            <div className="group gallery-card h-full relative overflow-hidden rounded-xl shadow-lg transition-all duration-400 hover:shadow-2xl transform hover:-translate-y-1">
              <div className="aspect-square h-full w-full overflow-hidden">
                <Image
                  className="h-full w-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-110"
                  src={galleryItems[6]!.imageUrl}
                  alt="BabySea - Multimodal AI for Creative Generation Workflows"
                  width={800}
                  height={800}
                  unoptimized
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
            </div>
          </div>
        
          <div className="col-span-2 row-span-1">
            <div className="group gallery-card h-full relative overflow-hidden rounded-xl shadow-lg transition-all duration-400 hover:shadow-2xl transform hover:-translate-y-1">
              <div className="aspect-[16/9] h-full w-full overflow-hidden">
                <Image
                  className="h-full w-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-110"
                  src={galleryItems[7]!.imageUrl}
                  alt="BabySea - Multimodal AI for Creative Generation Workflows"
                  width={1024}
                  height={576}
                  unoptimized
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
            </div>
          </div>
        
          <div className="col-span-1 row-span-1">
            <div className="group gallery-card h-full relative overflow-hidden rounded-xl shadow-lg transition-all duration-400 hover:shadow-2xl transform hover:-translate-y-1">
              <div className="aspect-[3/4] h-full w-full overflow-hidden">
                <Image
                  className="h-full w-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-110"
                  src={galleryItems[8]!.imageUrl}
                  alt="BabySea - Multimodal AI for Creative Generation Workflows"
                  width={768}
                  height={1024}
                  unoptimized
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
            </div>
          </div>
        
          <div className="col-span-2 md:col-span-1 row-span-2">
            <div className="group gallery-card h-full relative overflow-hidden rounded-xl shadow-lg transition-all duration-400 hover:shadow-2xl transform hover:-translate-y-1">
              <div className="aspect-[9/16] h-full w-full overflow-hidden">
                <Image
                  className="h-full w-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-110"
                  src={galleryItems[9]!.imageUrl}
                  alt="BabySea - Multimodal AI for Creative Generation Workflows"
                  width={576}
                  height={1024}
                  unoptimized
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
            </div>
          </div>
        
          <div className="col-span-1 row-span-1">
            <div className="group gallery-card h-full relative overflow-hidden rounded-xl shadow-lg transition-all duration-400 hover:shadow-2xl transform hover:-translate-y-1">
              <div className="aspect-square h-full w-full overflow-hidden">
                <Image
                  className="h-full w-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-110"
                  src={galleryItems[10]!.imageUrl}
                  alt="BabySea - Multimodal AI for Creative Generation Workflows"
                  width={800}
                  height={800}
                  unoptimized
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
            </div>
          </div>
        
          <div className="col-span-2 md:col-span-1 row-span-2">
            <div className="group gallery-card h-full relative overflow-hidden rounded-xl shadow-lg transition-all duration-400 hover:shadow-2xl transform hover:-translate-y-1">
              <div className="aspect-[9/16] h-full w-full overflow-hidden">
                <Image
                  className="h-full w-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-110"
                  src={galleryItems[11]!.imageUrl}
                  alt="BabySea - Multimodal AI for Creative Generation Workflows"
                  width={576}
                  height={1024}
                  unoptimized
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
            </div>
          </div>
        </div>

        {/* Second Gallery - Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full md:hidden mt-8">
          {galleryItems.slice(12, 24).map((item) => (
            <div 
              key={`gallery2-${item.id}`}
              className="group gallery-card relative overflow-hidden rounded-xl shadow-lg transition-all duration-400 hover:shadow-2xl transform hover:-translate-y-1"
            >
              <div className="aspect-square overflow-hidden">
                <Image
                  className="h-full w-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-110"
                  src={item.imageUrl}
                  alt="BabySea - Multimodal AI for Creative Generation Workflows"
                  width={1024}
                  height={1024}
                  unoptimized
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
            </div>
          ))}
        </div>

        {/* Second Gallery - Desktop */}
        <div className="hidden md:grid w-full gap-3 md:gap-4 grid-cols-2 md:grid-cols-4 auto-rows-auto mt-8">
          <div className="col-span-2 md:col-span-1 row-span-2">
            <div className="group gallery-card h-full relative overflow-hidden rounded-xl shadow-lg transition-all duration-400 hover:shadow-2xl transform hover:-translate-y-1">
              <div className="aspect-[3/5] h-full w-full overflow-hidden">
                <Image
                  className="h-full w-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-110"
                  src={galleryItems[12]!.imageUrl}
                  alt="BabySea - Multimodal AI for Creative Generation Workflows"
                  width={600}
                  height={1000}
                  unoptimized
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
            </div>
          </div>
        
          <div className="col-span-1 row-span-1">
            <div className="group gallery-card h-full relative overflow-hidden rounded-xl shadow-lg transition-all duration-400 hover:shadow-2xl transform hover:-translate-y-1">
              <div className="aspect-square h-full w-full overflow-hidden">
                <Image
                  className="h-full w-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-110"
                  src={galleryItems[13]!.imageUrl}
                  alt="BabySea - Multimodal AI for Creative Generation Workflows"
                  width={800}
                  height={800}
                  unoptimized
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
            </div>
          </div>
        
          <div className="col-span-2 row-span-1">
            <div className="group gallery-card h-full relative overflow-hidden rounded-xl shadow-lg transition-all duration-400 hover:shadow-2xl transform hover:-translate-y-1">
              <div className="aspect-[16/9] h-full w-full overflow-hidden">
                <Image
                  className="h-full w-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-110"
                  src={galleryItems[14]!.imageUrl}
                  alt="BabySea - Multimodal AI for Creative Generation Workflows"
                  width={1024}
                  height={576}
                  unoptimized
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
            </div>
          </div>
        
          <div className="col-span-1 row-span-1">
            <div className="group gallery-card h-full relative overflow-hidden rounded-xl shadow-lg transition-all duration-400 hover:shadow-2xl transform hover:-translate-y-1">
              <div className="aspect-[3/4] h-full w-full overflow-hidden">
                <Image
                  className="h-full w-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-110"
                  src={galleryItems[15]!.imageUrl}
                  alt="BabySea - Multimodal AI for Creative Generation Workflows"
                  width={768}
                  height={1024}
                  unoptimized
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
            </div>
          </div>
        
          <div className="col-span-1 row-span-1">
            <div className="group gallery-card h-full relative overflow-hidden rounded-xl shadow-lg transition-all duration-400 hover:shadow-2xl transform hover:-translate-y-1">
              <div className="aspect-square h-full w-full overflow-hidden">
                <Image
                  className="h-full w-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-110"
                  src={galleryItems[16]!.imageUrl}
                  alt="BabySea - Multimodal AI for Creative Generation Workflows"
                  width={800}
                  height={800}
                  unoptimized
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
            </div>
          </div>
        
          <div className="col-span-2 md:col-span-1 row-span-2">
            <div className="group gallery-card h-full relative overflow-hidden rounded-xl shadow-lg transition-all duration-400 hover:shadow-2xl transform hover:-translate-y-1">
              <div className="aspect-[2/3] h-full w-full overflow-hidden">
                <Image
                  className="h-full w-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-110"
                  src={galleryItems[17]!.imageUrl}
                  alt="BabySea - Multimodal AI for Creative Generation Workflows"
                  width={800}
                  height={1200}
                  unoptimized
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
            </div>
          </div>
        
          <div className="col-span-1 row-span-1">
            <div className="group gallery-card h-full relative overflow-hidden rounded-xl shadow-lg transition-all duration-400 hover:shadow-2xl transform hover:-translate-y-1">
              <div className="aspect-square h-full w-full overflow-hidden">
                <Image
                  className="h-full w-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-110"
                  src={galleryItems[18]!.imageUrl}
                  alt="BabySea - Multimodal AI for Creative Generation Workflows"
                  width={800}
                  height={800}
                  unoptimized
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
            </div>
          </div>
        
          <div className="col-span-2 row-span-1">
            <div className="group gallery-card h-full relative overflow-hidden rounded-xl shadow-lg transition-all duration-400 hover:shadow-2xl transform hover:-translate-y-1">
              <div className="aspect-[16/9] h-full w-full overflow-hidden">
                <Image
                  className="h-full w-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-110"
                  src={galleryItems[19]!.imageUrl}
                  alt="BabySea - Multimodal AI for Creative Generation Workflows"
                  width={1024}
                  height={576}
                  unoptimized
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
            </div>
          </div>
        
          <div className="col-span-1 row-span-1">
            <div className="group gallery-card h-full relative overflow-hidden rounded-xl shadow-lg transition-all duration-400 hover:shadow-2xl transform hover:-translate-y-1">
              <div className="aspect-[3/4] h-full w-full overflow-hidden">
                <Image
                  className="h-full w-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-110"
                  src={galleryItems[20]!.imageUrl}
                  alt="BabySea - Multimodal AI for Creative Generation Workflows"
                  width={768}
                  height={1024}
                  unoptimized
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
            </div>
          </div>
        
          <div className="col-span-2 md:col-span-1 row-span-2">
            <div className="group gallery-card h-full relative overflow-hidden rounded-xl shadow-lg transition-all duration-400 hover:shadow-2xl transform hover:-translate-y-1">
              <div className="aspect-[9/16] h-full w-full overflow-hidden">
                <Image
                  className="h-full w-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-110"
                  src={galleryItems[21]!.imageUrl}
                  alt="BabySea - Multimodal AI for Creative Generation Workflows"
                  width={576}
                  height={1024}
                  unoptimized
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
            </div>
          </div>
        
          <div className="col-span-1 row-span-1">
            <div className="group gallery-card h-full relative overflow-hidden rounded-xl shadow-lg transition-all duration-400 hover:shadow-2xl transform hover:-translate-y-1">
              <div className="aspect-square h-full w-full overflow-hidden">
                <Image
                  className="h-full w-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-110"
                  src={galleryItems[22]!.imageUrl}
                  alt="BabySea - Multimodal AI for Creative Generation Workflows"
                  width={800}
                  height={800}
                  unoptimized
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
            </div>
          </div>
        
          <div className="col-span-2 md:col-span-1 row-span-2">
            <div className="group gallery-card h-full relative overflow-hidden rounded-xl shadow-lg transition-all duration-400 hover:shadow-2xl transform hover:-translate-y-1">
              <div className="aspect-[9/16] h-full w-full overflow-hidden">
                <Image
                  className="h-full w-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-110"
                  src={galleryItems[23]!.imageUrl}
                  alt="BabySea - Multimodal AI for Creative Generation Workflows"
                  width={576}
                  height={1024}
                  unoptimized
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
