/** Instagram 貼文照片格子；圖片經 /api/instagram 向 IG 取得 */
export function InstagramGrid({ posts, name }: { posts: string[]; name: string }) {
  // 三格時第一格佔左半邊整欄，右邊上下兩格，避免留下空格
  const featureFirst = posts.length === 3;
  return (
    <div
      className={`grid aspect-[4/3] gap-1 ${posts.length > 1 ? "grid-cols-2" : ""} ${
        featureFirst ? "grid-rows-2" : ""
      }`}
    >
      {posts.map((post, i) => (
        <a
          key={post}
          href={post}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`在 Instagram 看${name}的照片`}
          className={`group/ig relative block overflow-hidden ${
            featureFirst && i === 0 ? "row-span-2" : ""
          }`}
        >
          {/* 經 /api/instagram 轉來的 IG 圖片，不經過 next/image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/instagram?code=${post.match(/\/p\/([^/]+)/)?.[1]}`}
            alt={`${name}（Instagram 貼文）`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover/ig:scale-105"
          />
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="absolute right-3 bottom-3 h-8 w-8 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
          </svg>
        </a>
      ))}
    </div>
  );
}
