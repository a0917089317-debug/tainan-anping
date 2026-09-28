// IG 圖片伺服器只准 instagram.com 自己嵌入（cross-origin-resource-policy: same-origin），
// 所以由這裡當下向 IG 取圖再轉給瀏覽器；圖片不存進專案，只讓瀏覽器／CDN 暫存一天。
// 用法：/api/instagram?code=<貼文代碼>
export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get("code") ?? "";

  // 只接受 IG 貼文代碼，避免被拿來當任意網址的代理
  if (!/^[A-Za-z0-9_-]{5,40}$/.test(code)) {
    return new Response("Invalid post code", { status: 400 });
  }

  const res = await fetch(`https://www.instagram.com/p/${code}/media/?size=l`, {
    redirect: "follow",
  }).catch(() => null);

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
