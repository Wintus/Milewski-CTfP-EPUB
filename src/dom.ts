const contentSelector = "#content .post-content";

type Chapter = { chapterNo: string; title: string };
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
