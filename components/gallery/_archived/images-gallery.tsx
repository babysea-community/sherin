'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MousePointerClick, Package } from 'lucide-react';
import { useGalleryTouchEvents } from './touch-event';

export default function ImagesGallery() {
  const galleryRef = useGalleryTouchEvents();
  const galleryItems = [
    { id: 1, linkid: "creator/9fcbe23c-022a-4988-a754-ba9118f1e105/tmppl7wssyy.png", imageUrl: "https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/8d74a98a-86a5-494c-67a0-c5476336c900/600x1000" },
    { id: 2, linkid: "creator/c4308bf0-328b-4472-ae02-9f45282bd216/tmpclxpo2ru.png", imageUrl: "https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/5675a179-53f6-40dc-9615-0919bd435b00/800x800" },
    { id: 3, linkid: "persona/4ef38698-2c01-4520-a8cb-b2647401e02b/tmp_5q5t_cg.png", imageUrl: "https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/79dddf5d-07ae-42dc-f659-6442e45a0200/1024x576" },
    { id: 4, linkid: "creator/c6eab93d-3e56-446c-be39-068572fd9087/tmpsgdo9bx5.png", imageUrl: "https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/1eca326f-f67f-4afd-a215-8aedc9a93900/768x1024" },
    { id: 5, linkid: "canvas/ee015530-7507-4b91-b295-f580c4cac1bd/tmpmurn72g4.png", imageUrl: "https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/99650c27-d334-42c4-c205-78153ad49e00/800x800" },
    { id: 6, linkid: "creator/e909df55-5fe1-46ad-a6d3-7108e249090b/tmpby5c24gx.png", imageUrl: "https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/27d4882a-829a-4e9d-94e8-f002202f5e00/800x1200" },
    { id: 7, linkid: "creator/d41e0995-a6c1-4b50-9b2f-92d1633a766c/tmpp77e_272.png", imageUrl: "https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/e76bacbf-df83-4097-519e-04df05071f00/800x800" },
    { id: 8, linkid: "creator/34d0607a-9aa3-4a7b-a927-6051230e0bc9/tmpg4c5t5i0.png", imageUrl: "https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/42ef0a74-eb8c-444b-6654-dbb450a84f00/1024x576" },
    { id: 9, linkid: "creator/640c02ce-7905-42b5-87d7-5b1ab9dffc93/tmpqbesunyj.png", imageUrl: "https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/7212c266-3198-464d-eae5-441e6f314000/768x1024" },
    { id: 10, linkid: "creator/dd9199bc-93b9-4e17-b49d-3b1d4eeef5ea/tmpdml_tzgu.png", imageUrl: "https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/8f1badec-5746-4d43-a4d2-62a9fb4f5600/576x1024" },
    { id: 11, linkid: "creator/56dd5683-f4d5-4d02-b5f6-af0404d449e7/tmpw2q5sk02.png", imageUrl: "https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/ac995e42-03de-40ac-3476-6482d80bd600/800x800" },
    { id: 12, linkid: "creator/c6101d0b-135d-47db-aef7-e81d14dddceb/tmpws9bh9hj.png", imageUrl: "https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/de9e325f-b971-45b1-6fd3-c2c1de475c00/576x1024" }
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
          {galleryItems.map((item) => (
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
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
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
          <div className="col-span-2 md:col-span-1 row-span-2">
            <div className="group gallery-card h-full relative overflow-hidden rounded-xl shadow-lg transition-all duration-400 hover:shadow-2xl transform hover:-translate-y-1">
              <div className="aspect-[3/5] h-full w-full overflow-hidden">
                <Image
                  className="h-full w-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-110"
                  src={galleryItems[0]!.imageUrl}
                  alt="BabySea - Multimodal AI for Creative Generation Workflows"
                  width={600}
                  height={1000}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
              <div className="absolute bottom-4 right-4 opacity-0 transition-all duration-400 transform translate-y-1 group-hover:translate-y-0 group-hover:opacity-100">
                <Link href={`/card/${galleryItems[0]!.linkid}`} target="_blank" rel="noopener noreferrer">
                  <button className="rounded-full backdrop-blur-sm bg-black/40 border border-white/30 p-2.5 text-sm font-medium text-white hover:bg-black/60 transition-colors cursor-pointer shadow-sm">
                    <MousePointerClick className="h-4 w-4" />
                  </button>
                </Link>
              </div>
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
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
              <div className="absolute bottom-4 right-4 opacity-0 transition-all duration-400 transform translate-y-1 group-hover:translate-y-0 group-hover:opacity-100">
                <Link href={`/card/${galleryItems[1]!.linkid}`} target="_blank" rel="noopener noreferrer">
                  <button className="rounded-full backdrop-blur-sm bg-black/40 border border-white/30 p-2.5 text-sm font-medium text-white hover:bg-black/60 transition-colors cursor-pointer shadow-sm">
                    <MousePointerClick className="h-4 w-4" />
                  </button>
                </Link>
              </div>
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
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
              <div className="absolute bottom-4 right-4 opacity-0 transition-all duration-400 transform translate-y-1 group-hover:translate-y-0 group-hover:opacity-100">
                <Link href={`/card/${galleryItems[2]!.linkid}`} target="_blank" rel="noopener noreferrer">
                  <button className="rounded-full backdrop-blur-sm bg-black/40 border border-white/30 p-2.5 text-sm font-medium text-white hover:bg-black/60 transition-colors cursor-pointer shadow-sm">
                    <MousePointerClick className="h-4 w-4" />
                  </button>
                </Link>
              </div>
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
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
              <div className="absolute bottom-4 right-4 opacity-0 transition-all duration-400 transform translate-y-1 group-hover:translate-y-0 group-hover:opacity-100">
                <Link href={`/card/${galleryItems[3]!.linkid}`} target="_blank" rel="noopener noreferrer">
                  <button className="rounded-full backdrop-blur-sm bg-black/40 border border-white/30 p-2.5 text-sm font-medium text-white hover:bg-black/60 transition-colors cursor-pointer shadow-sm">
                    <MousePointerClick className="h-4 w-4" />
                  </button>
                </Link>
              </div>
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
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
              <div className="absolute bottom-4 right-4 opacity-0 transition-all duration-400 transform translate-y-1 group-hover:translate-y-0 group-hover:opacity-100">
                <Link href={`/card/${galleryItems[4]!.linkid}`} target="_blank" rel="noopener noreferrer">
                  <button className="rounded-full backdrop-blur-sm bg-black/40 border border-white/30 p-2.5 text-sm font-medium text-white hover:bg-black/60 transition-colors cursor-pointer shadow-sm">
                    <MousePointerClick className="h-4 w-4" />
                  </button>
                </Link>
              </div>
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
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
              <div className="absolute bottom-4 right-4 opacity-0 transition-all duration-400 transform translate-y-1 group-hover:translate-y-0 group-hover:opacity-100">
                <Link href={`/card/${galleryItems[5]!.linkid}`} target="_blank" rel="noopener noreferrer">
                  <button className="rounded-full backdrop-blur-sm bg-black/40 border border-white/30 p-2.5 text-sm font-medium text-white hover:bg-black/60 transition-colors cursor-pointer shadow-sm">
                    <MousePointerClick className="h-4 w-4" />
                  </button>
                </Link>
              </div>
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
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
              <div className="absolute bottom-4 right-4 opacity-0 transition-all duration-400 transform translate-y-1 group-hover:translate-y-0 group-hover:opacity-100">
                <Link href={`/card/${galleryItems[6]!.linkid}`} target="_blank" rel="noopener noreferrer">
                  <button className="rounded-full backdrop-blur-sm bg-black/40 border border-white/30 p-2.5 text-sm font-medium text-white hover:bg-black/60 transition-colors cursor-pointer shadow-sm">
                    <MousePointerClick className="h-4 w-4" />
                  </button>
                </Link>
              </div>
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
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
              <div className="absolute bottom-4 right-4 opacity-0 transition-all duration-400 transform translate-y-1 group-hover:translate-y-0 group-hover:opacity-100">
                <Link href={`/card/${galleryItems[7]!.linkid}`} target="_blank" rel="noopener noreferrer">
                  <button className="rounded-full backdrop-blur-sm bg-black/40 border border-white/30 p-2.5 text-sm font-medium text-white hover:bg-black/60 transition-colors cursor-pointer shadow-sm">
                    <MousePointerClick className="h-4 w-4" />
                  </button>
                </Link>
              </div>
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
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
              <div className="absolute bottom-4 right-4 opacity-0 transition-all duration-400 transform translate-y-1 group-hover:translate-y-0 group-hover:opacity-100">
                <Link href={`/card/${galleryItems[8]!.linkid}`} target="_blank" rel="noopener noreferrer">
                  <button className="rounded-full backdrop-blur-sm bg-black/40 border border-white/30 p-2.5 text-sm font-medium text-white hover:bg-black/60 transition-colors cursor-pointer shadow-sm">
                    <MousePointerClick className="h-4 w-4" />
                  </button>
                </Link>
              </div>
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
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
              <div className="absolute bottom-4 right-4 opacity-0 transition-all duration-400 transform translate-y-1 group-hover:translate-y-0 group-hover:opacity-100">
                <Link href={`/card/${galleryItems[9]!.linkid}`} target="_blank" rel="noopener noreferrer">
                  <button className="rounded-full backdrop-blur-sm bg-black/40 border border-white/30 p-2.5 text-sm font-medium text-white hover:bg-black/60 transition-colors cursor-pointer shadow-sm">
                    <MousePointerClick className="h-4 w-4" />
                  </button>
                </Link>
              </div>
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
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
              <div className="absolute bottom-4 right-4 opacity-0 transition-all duration-400 transform translate-y-1 group-hover:translate-y-0 group-hover:opacity-100">
                <Link href={`/card/${galleryItems[10]!.linkid}`} target="_blank" rel="noopener noreferrer">
                  <button className="rounded-full backdrop-blur-sm bg-black/40 border border-white/30 p-2.5 text-sm font-medium text-white hover:bg-black/60 transition-colors cursor-pointer shadow-sm">
                    <MousePointerClick className="h-4 w-4" />
                  </button>
                </Link>
              </div>
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
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
              <div className="absolute bottom-4 right-4 opacity-0 transition-all duration-400 transform translate-y-1 group-hover:translate-y-0 group-hover:opacity-100">
                <Link href={`/card/${galleryItems[11]!.linkid}`} target="_blank" rel="noopener noreferrer">
                  <button className="rounded-full backdrop-blur-sm bg-black/40 border border-white/30 p-2.5 text-sm font-medium text-white hover:bg-black/60 transition-colors cursor-pointer shadow-sm">
                    <MousePointerClick className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
