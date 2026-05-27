'use client';

import {
  Brush,
  Camera,
  Dribbble,
  Facebook,
  Globe2,
  Instagram,
  Linkedin,
  Music2,
  Palette,
  Twitch,
  Twitter,
  Youtube,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';

import { ProtectedImage } from '@/components/protected-image';

import { useGalleryTouchEvents } from './touch-event';

type GalleryItem = {
  id: number;
  imageUrl: string;
  width: number;
  height: number;
};

type GalleryLayout = {
  wrapperClassName: string;
  frameClassName: string;
};

const galleryLayouts: GalleryLayout[] = [
  {
    wrapperClassName: 'col-span-2 row-span-2 md:col-span-1',
    frameClassName: 'aspect-[3/5]',
  },
  {
    wrapperClassName: 'col-span-1 row-span-1',
    frameClassName: 'aspect-square',
  },
  {
    wrapperClassName: 'col-span-2 row-span-1',
    frameClassName: 'aspect-[16/9]',
  },
  {
    wrapperClassName: 'col-span-1 row-span-1',
    frameClassName: 'aspect-[3/4]',
  },
  {
    wrapperClassName: 'col-span-1 row-span-1',
    frameClassName: 'aspect-square',
  },
  {
    wrapperClassName: 'col-span-2 row-span-2 md:col-span-1',
    frameClassName: 'aspect-[2/3]',
  },
  {
    wrapperClassName: 'col-span-1 row-span-1',
    frameClassName: 'aspect-square',
  },
  {
    wrapperClassName: 'col-span-2 row-span-1',
    frameClassName: 'aspect-[16/9]',
  },
  {
    wrapperClassName: 'col-span-1 row-span-1',
    frameClassName: 'aspect-[3/4]',
  },
  {
    wrapperClassName: 'col-span-2 row-span-2 md:col-span-1',
    frameClassName: 'aspect-[9/16]',
  },
  {
    wrapperClassName: 'col-span-1 row-span-1',
    frameClassName: 'aspect-square',
  },
  {
    wrapperClassName: 'col-span-2 row-span-2 md:col-span-1',
    frameClassName: 'aspect-[9/16]',
  },
];

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    imageUrl:
      'https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/8d74a98a-86a5-494c-67a0-c5476336c900/600x1000',
    width: 600,
    height: 1000,
  },
  {
    id: 2,
    imageUrl:
      'https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/5675a179-53f6-40dc-9615-0919bd435b00/800x800',
    width: 800,
    height: 800,
  },
  {
    id: 3,
    imageUrl:
      'https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/79dddf5d-07ae-42dc-f659-6442e45a0200/1024x576',
    width: 1024,
    height: 576,
  },
  {
    id: 4,
    imageUrl:
      'https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/1eca326f-f67f-4afd-a215-8aedc9a93900/768x1024',
    width: 768,
    height: 1024,
  },
  {
    id: 5,
    imageUrl:
      'https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/99650c27-d334-42c4-c205-78153ad49e00/800x800',
    width: 800,
    height: 800,
  },
  {
    id: 6,
    imageUrl:
      'https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/27d4882a-829a-4e9d-94e8-f002202f5e00/800x1200',
    width: 800,
    height: 1200,
  },
  {
    id: 7,
    imageUrl:
      'https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/e76bacbf-df83-4097-519e-04df05071f00/800x800',
    width: 800,
    height: 800,
  },
  {
    id: 8,
    imageUrl:
      'https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/42ef0a74-eb8c-444b-6654-dbb450a84f00/1024x576',
    width: 1024,
    height: 576,
  },
  {
    id: 9,
    imageUrl:
      'https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/7212c266-3198-464d-eae5-441e6f314000/768x1024',
    width: 768,
    height: 1024,
  },
  {
    id: 10,
    imageUrl:
      'https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/8f1badec-5746-4d43-a4d2-62a9fb4f5600/576x1024',
    width: 576,
    height: 1024,
  },
  {
    id: 11,
    imageUrl:
      'https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/ac995e42-03de-40ac-3476-6482d80bd600/800x800',
    width: 800,
    height: 800,
  },
  {
    id: 12,
    imageUrl:
      'https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/de9e325f-b971-45b1-6fd3-c2c1de475c00/576x1024',
    width: 576,
    height: 1024,
  },
  {
    id: 13,
    imageUrl:
      'https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/84374b79-f96e-49bc-a29b-c824645f0400/600x1000',
    width: 600,
    height: 1000,
  },
  {
    id: 14,
    imageUrl:
      'https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/7187918b-6d7a-43f7-c36d-dca2a9967b00/800x800',
    width: 800,
    height: 800,
  },
  {
    id: 15,
    imageUrl:
      'https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/67cc3373-139e-41aa-7518-13cd70269b00/1024x576',
    width: 1024,
    height: 576,
  },
  {
    id: 16,
    imageUrl:
      'https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/f7fae846-cb13-402a-0361-e2f1dcc88c00/768x1024',
    width: 768,
    height: 1024,
  },
  {
    id: 17,
    imageUrl:
      'https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/4c2dafe9-4a62-4570-333d-028acf446c00/800x800',
    width: 800,
    height: 800,
  },
  {
    id: 18,
    imageUrl:
      'https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/9b08b444-e1a4-427f-be10-cf75244a0300/800x1200',
    width: 800,
    height: 1200,
  },
  {
    id: 19,
    imageUrl:
      'https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/587dbaae-b23b-4d0f-212b-beb6ac7a6600/800x800',
    width: 800,
    height: 800,
  },
  {
    id: 20,
    imageUrl:
      'https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/a39539d0-7719-4585-218e-e217e3cb6900/1024x576',
    width: 1024,
    height: 576,
  },
  {
    id: 21,
    imageUrl:
      'https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/ffa2054c-f19d-4d70-7d4f-ab0bf5375200/768x1024',
    width: 768,
    height: 1024,
  },
  {
    id: 22,
    imageUrl:
      'https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/8d9da5f6-a109-4da7-2267-41fa028c6200/576x1024',
    width: 576,
    height: 1024,
  },
  {
    id: 23,
    imageUrl:
      'https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/bd48ece9-8cda-4f02-5715-e91bff9d2400/800x800',
    width: 800,
    height: 800,
  },
  {
    id: 24,
    imageUrl:
      'https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/5671495e-8da2-446b-7d36-08752d19e500/1280x720',
    width: 1280,
    height: 720,
  },
];

const galleryGroups = [galleryItems.slice(0, 12), galleryItems.slice(12, 24)];

const creatorSocialLinks: Array<{
  label: string;
  href: string;
  Icon: LucideIcon;
}> = [
  { label: 'Instagram', href: '/', Icon: Instagram },
  { label: 'X', href: '/', Icon: Twitter },
  { label: 'TikTok', href: '/', Icon: Music2 },
  { label: 'YouTube', href: '/', Icon: Youtube },
  { label: 'Twitch', href: '/', Icon: Twitch },
  { label: 'Behance', href: '/', Icon: Palette },
  { label: 'Dribbble', href: '/', Icon: Dribbble },
  { label: 'ArtStation', href: '/', Icon: Brush },
  { label: 'Pinterest', href: '/', Icon: Camera },
  { label: 'LinkedIn', href: '/', Icon: Linkedin },
  { label: 'Facebook', href: '/', Icon: Facebook },
  { label: 'Website', href: '/', Icon: Globe2 },
];

export default function ImagesGallery() {
  const galleryRef = useGalleryTouchEvents();

  return (
    <section
      ref={galleryRef}
      className="border-y border-white/10 bg-slate-950 py-16"
    >
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="relative pb-14 pt-4 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
            <span>Explore my</span>
            <span className="mx-4 text-slate-500">×</span>
            <span className="font-normal text-slate-400">creative works</span>
          </h2>

          <div className="mx-auto mt-12 flex max-w-4xl flex-wrap items-center justify-center gap-3">
            {creatorSocialLinks.map((item) => {
              const Icon = item.Icon;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  title={item.label}
                  className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-200 transition hover:-translate-y-0.5 hover:border-fuchsia-200/40 hover:bg-fuchsia-300/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-200/70"
                >
                  <Icon className="size-5" aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[90rem] px-4 sm:px-6 lg:px-8">
        <div className="space-y-8 md:hidden">
          {galleryGroups.map((items, groupIndex) => (
            <div
              key={`mobile-gallery-${groupIndex}`}
              className="grid grid-cols-1 gap-7 sm:grid-cols-2 sm:gap-8"
            >
              {items.map((item) => (
                <GalleryCard
                  key={item.id}
                  item={item}
                  frameClassName="aspect-square"
                />
              ))}
            </div>
          ))}
        </div>

        <div className="hidden space-y-8 md:block">
          {galleryGroups.map((items, groupIndex) => (
            <div
              key={`desktop-gallery-${groupIndex}`}
              className="grid w-full auto-rows-auto grid-cols-4 gap-5 lg:gap-6"
            >
              {items.map((item, itemIndex) => {
                const layout = galleryLayouts[itemIndex]!;

                return (
                  <div key={item.id} className={layout.wrapperClassName}>
                    <GalleryCard
                      item={item}
                      frameClassName={layout.frameClassName}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryCard({
  item,
  frameClassName,
}: {
  item: GalleryItem;
  frameClassName: string;
}) {
  return (
    <div className="gallery-card group relative h-full overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] shadow-lg shadow-black/30 transition duration-300 hover:-translate-y-1 hover:border-fuchsia-200/30 hover:shadow-fuchsia-950/30">
      <div className={`${frameClassName} h-full w-full overflow-hidden`}>
        <ProtectedImage
          className="block h-full w-full object-cover transition duration-500 ease-out group-hover:scale-110 group-[.touch-active]:scale-110"
          src={item.imageUrl}
          alt={`Sherin private generative media gallery output ${item.id}`}
          width={item.width}
          height={item.height}
          decoding="async"
          loading="lazy"
          sizes="(min-width: 768px) 50vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-[.touch-active]:opacity-100" />
    </div>
  );
}
