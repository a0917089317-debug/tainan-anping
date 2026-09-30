// IG 圖片伺服器只准 instagram.com 自己嵌入（cross-origin-resource-policy: same-origin），
// 所以由這裡當下向 IG 取圖再轉給瀏覽器；圖片不存進專案，只讓瀏覽器／CDN 暫存一天。
// 用法：/api/instagram?code=<貼文代碼>[&index=<多圖貼文的第幾張，從 1 起算>]
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const code = params.get("code") ?? "";
  const index = Number(params.get("index") ?? "1");

  // 只接受 IG 貼文代碼，避免被拿來當任意網址的代理
  if (!/^[A-Za-z0-9_-]{5,40}$/.test(code) || !Number.isInteger(index) || index < 1 || index > 20) {
    return new Response("Invalid post code", { status: 400 });
  }

  const imageUrl =
    index === 1 ? `https://www.instagram.com/p/${code}/media/?size=l` : await carouselImage(code, index);

  const res = imageUrl ? await fetch(imageUrl, { redirect: "follow" }).catch(() => null) : null;

  const type = res?.headers.get("content-type") ?? "";
  if (!res?.ok || !type.startsWith("image/")) {
    return new Response("Image unavailable", { status: 502 });
  }

  return new Response(res.body, {
    headers: {
      "Content-Type": type,
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}

// /media/ 只給得出第一張，多圖貼文的其他張從嵌入頁裡的 display_url 依序取出
async function carouselImage(code: string, index: number) {
  const res = await fetch(`https://www.instagram.com/p/${code}/embed/captioned/`).catch(() => null);
  if (!res?.ok) return null;
  const html = await res.text();
  // 網址在嵌入頁裡被跳脫了好幾層（\\\/、\\u0025），去掉反斜線還原
  const urls = [...html.matchAll(/display_url[\\"]+:[\\"]+(https:[^"]+?)\\*"/g)].map((m) =>
    m[1].replace(/\\+u0025/gi, "%").replace(/\\+/g, ""),
  );
  // 貼文本身的 display_url 與第一張相同，依檔名去重後即為各張順序
  const unique = [...new Map(urls.map((u) => [u.split("?")[0], u])).values()];
  const url = unique[index - 1];
  return url?.startsWith("https://") && new URL(url).hostname.endsWith(".cdninstagram.com") ? url : null;
}
