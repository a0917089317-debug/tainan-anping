// 各地點的 IG 貼文（依地點 id），圖片經 /api/instagram 向 IG 取得。
// 有貼文的地點在區域頁顯示 IG 照片格子、在命運輪盤顯示第一則貼文，取代專案內的照片。
export const instagramPosts: Record<string, string[]> = {
  // 安平區
  "anping-fort": [
    "https://www.instagram.com/p/C8RaPVqpDPJ/",
    "https://www.instagram.com/p/DJzEZZ1T5yM/",
    "https://www.instagram.com/p/C5R6qcgy1_4/",
  ],
  "eternal-castle": [
    "https://www.instagram.com/p/Cm3RuR9yI_h/",
    "https://www.instagram.com/p/CnyDPyUPWMF/",
  ],
  tait: [
    "https://www.instagram.com/p/BCoroBzBlc4/",
    "https://www.instagram.com/p/DWSa1ZNAKbU/",
    "https://www.instagram.com/p/fBGub/",
  ],
  "tree-house": [
    "https://www.instagram.com/p/B1WcALvnYd3/",
    "https://www.instagram.com/p/DXLvqLAmY19/",
    "https://www.instagram.com/p/DFfoE8avME5/",
  ],
  julius: [
    "https://www.instagram.com/p/DdbRz6-DlwQ/",
    "https://www.instagram.com/p/Dbaj3x8CGcR/",
    "https://www.instagram.com/p/DZuYu7iFAbX/",
  ],
  "small-fort": ["https://www.instagram.com/p/DQ-uaSQk-Ve/"],
  haishan: ["https://www.instagram.com/p/B5P34SAHBuJ/"],
  tianhou: [
    "https://www.instagram.com/p/C_m_Tv2Pgos/",
    "https://www.instagram.com/p/CtIpLDyvo5v/",
  ],
  zhu: [
    "https://www.instagram.com/p/OuwCz/",
    "https://www.instagram.com/p/fBlws/",
    "https://www.instagram.com/p/B3Cfqe7ghIh/",
  ],
  "oyster-kiln": ["https://www.instagram.com/p/DOlblemkRve/"],
  "fishermans-wharf": [
    "https://www.instagram.com/p/CgapC_ThGDc/",
    "https://www.instagram.com/p/DNdcQCAT5X_/?img_index=1",
    "https://www.instagram.com/p/DNdcQCAT5X_/?img_index=2",
  ],
  "big-fish": [
    "https://www.instagram.com/p/CDYxWv4j_eZ/",
    "https://www.instagram.com/p/C92b8EmSAYu/",
    "https://www.instagram.com/p/CXVEnXNFJBE/",
  ],
  sunset: [
    "https://www.instagram.com/p/CwCmhX9h4fB/",
    "https://www.instagram.com/p/CFjO7-6Bjd8/",
    "https://www.instagram.com/p/6ociSdFmJ1/",
  ],
  linmoniang: [
    "https://www.instagram.com/p/DRoWhP0E8Cd/?img_index=1",
    "https://www.instagram.com/p/CpH_4D9hscn/",
    "https://www.instagram.com/p/DRoWhP0E8Cd/?img_index=4",
  ],
  canal: [
    "https://www.instagram.com/p/DNdcQCAT5X_/?img_index=3",
    "https://www.instagram.com/p/DNdcQCAT5X_/?img_index=4",
    "https://www.instagram.com/p/DNdcQCAT5X_/?img_index=9",
  ],
  yuguang: [
    "https://www.instagram.com/p/C7mHuIDy3MH/",
    "https://www.instagram.com/p/DOoI08KkhPX/",
  ],
  "harbor-park": [
    "https://www.instagram.com/p/DMkTgO-Pg0j/?img_index=3",
    "https://www.instagram.com/p/DUf0N9XFPM6/?img_index=3",
    "https://www.instagram.com/p/BtewmvWHlx2/",
    "https://www.instagram.com/p/Bwv_37-pJ1z/",
  ],
  deyang: [
    "https://www.instagram.com/p/Dd25sCGk1F2/",
    "https://www.instagram.com/p/DcBCJioGqPG/",
    "https://www.instagram.com/p/Da494i-oFFs/",
  ],
  // 中西區
  shennong: [
    "https://www.instagram.com/p/B8OHLhvgf0o/",
    "https://www.instagram.com/p/CTD1ndBlAZX/",
    "https://www.instagram.com/p/BHRUNubjTHz/",
  ],
  hayashi: ["https://www.instagram.com/p/DR4mEjBkVUz/"],
  zhengxing: [
    "https://www.instagram.com/p/BhOzOsjFKPB/",
    "https://www.instagram.com/p/9QA-AlNdRL/",
    "https://www.instagram.com/p/DSpMRFdiVvS/",
    "https://www.instagram.com/p/DSjT3NYEwnQ/",
  ],
  confucius: [
    "https://www.instagram.com/p/CYgdfGMPdaT/",
    "https://www.instagram.com/p/CB9zr91DMjS/",
  ],
  chihkan: ["https://www.instagram.com/p/Clc3eOApNqr/"],
  guohua: [
    "https://www.instagram.com/p/CvACxKsBwhI/",
    "https://www.instagram.com/p/DNr6o965DxD/",
    "https://www.instagram.com/p/DH2QONRJc2D/",
  ],
};

/** 貼文網址帶 ?img_index=N 時取多圖貼文的第 N 張 */
export function instagramImageSrc(post: string) {
  const code = post.match(/\/p\/([^/?]+)/)?.[1];
  const index = new URL(post).searchParams.get("img_index");
  return `/api/instagram?code=${code}${index && index !== "1" ? `&index=${index}` : ""}`;
}

