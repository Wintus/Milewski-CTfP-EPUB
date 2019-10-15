const contentSelector = "#content .post-content";

export type Chapter = { chapterNo: string; title: string };
export type Content = { content: Element; images: HTMLImageElement[] };
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

export const getContent = (document: Document): Content => {
  const content = document.querySelector(contentSelector);
  // guard
  if (content == null) {
    throw new Error(`Invalid document without content: ${document}`);
  }

  const images = Array.from(content.getElementsByTagName("img"));
  return { content, images };
};
