import { JSDOM } from "jsdom";
import fetch from "node-fetch";
import path from "path";
import { Chapter, Content, getContent, getTableOfContents } from "./dom";
import { saveFile } from "./file";

const url =
  "https://bartoszmilewski.com/2014/10/28/category-theory-for-programmers-the-preface/";

const fetchDoc = async (url: string) => {
  const response = await fetch(url);
  const html = await response.text();
  const dom = new JSDOM(html);
  return dom.window.document;
};

const fullHTML = (html: string) =>
  new JSDOM(`<!DOCTYPE html>${html}`).serialize();

const savePage = ({ chapterNo, title, content }: Chapter & Content) => {
  const dirPath = path.join("content", chapterNo);
  return saveFile(
    path.join(dirPath, `${title}.html`),
    fullHTML(content.innerHTML)
  );
};

(async () => {
  const document = await fetchDoc(url);

  const tableOfContents = getTableOfContents(document);
  console.log(tableOfContents);

  const preface = savePage({
    chapterNo: "0.0",
    title: "Preface",
    ...getContent(document)
  });
  const chapters = tableOfContents.map(async ({ url, chapterNo, title }) => {
    const document = await fetchDoc(url);
    await savePage({ chapterNo, title, ...getContent(document) });
  });

  await preface;
  await Promise.all(chapters);
})();
