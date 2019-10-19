import { join } from "path";
import { getFilename } from "./url";

const contentSelector = "#content .post-content";

export type Chapter = { chapterNo: string; title: string };
export type Content = { content: Element; imageUrls: string[] };
type ChapterUrl = Chapter & { url: string };

export const getTableOfContents = (document: Document): ChapterUrl[] => {
  const chapterLists = document.querySelectorAll(`${contentSelector} > ol`);
  return Array.from(chapterLists).flatMap((list, index) => {
    const partNo = index + 1;
    const chapters = list.querySelectorAll<HTMLLinkElement>("li > a");
    return Array.from(chapters).map((a, index) => ({
      chapterNo: `${partNo}.${index + 1}`,
      title: a.textContent || "",
      url: a.href
    }));
  });
};

// JSDOM implements replaceWith
const replaceParent = (node: Node): void => {
  const p1 = node.parentNode;
  if (p1) {
    // @ts-ignore
    p1.replaceWith(node);
  }
};

export const getContent = (
  document: Document,
  imageDir = "images"
): Content => {
  const content = document.querySelector(contentSelector);
  // guard
  if (content == null) {
    throw new Error(`Invalid document without content: ${document}`);
  }

  // remove noises
  [
    ".cs-rating",
    ".pd-rating",
    ".twitter-follow-button",
    ".geo",
    ".geo-post",
    ".wpcnt",
    "#jp-post-flair",
    ".post-info",
    ".post-footer",
    "script"
  ]
    .map(selector => content.querySelector(selector))
    .forEach(node => {
      if (node) node.remove();
    });

  const images = content.getElementsByTagName("img");
  // with a side-effect to change the element
  const imageUrls = Array.from(images).map(img => {
    const url = img.src;
    img.src = join(imageDir, getFilename(url));
    replaceParent(img);
    return url;
  });
  return { content, imageUrls };
};
