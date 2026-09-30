import Image from "next/image";
import { InstagramGrid } from "@/components/instagram-grid";
import { photoFor } from "@/lib/anping-roulette";
import { instagramPosts } from "@/lib/instagram";

/** 地點有沒有照片（IG 貼文或專案內的照片） */
export function hasPlacePhoto(id: string) {
  return Boolean(instagramPosts[id]?.length || photoFor(id));
}

/**
 * 地點照片框：有 IG 貼文用第一則貼文（點了開 IG，附著作權說明），
 * 否則用專案內的照片；都沒有時不顯示
 */
export function PlacePhoto({
  id,
  alt,
  sizes,
  className = "",
}: {
  id: string;
  alt: string;
  sizes: string;
  className?: string;
}) {
  const frame = `relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border ${className}`;
  const post = instagramPosts[id]?.[0];
  if (post) {
    return (
      <div>
        <div className={frame}>
          <InstagramGrid posts={[post]} name={alt} />
        </div>
        <p className="mt-2 text-xs leading-5 text-muted/70">
          本區內容由 Instagram 公開貼文嵌入顯示，照片著作權歸原著作權人所有，本站不主張相關照片之著作權。
        </p>
      </div>
    );
  }
  const photo = photoFor(id);
  if (!photo) return null;
  return (
    <div className={frame}>
      <Image src={photo} alt={alt} fill sizes={sizes} className="object-cover" />
    </div>
  );
}
