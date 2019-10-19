import { JSDOM } from "jsdom";
import fetch from "node-fetch";
import path from "path";
import { Chapter, Content, getContent, getTableOfContents } from "./dom";
import { saveFile } from "./file";
import { getFilename } from "./url";

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

const savePage = ({
  chapterNo,
  title,
  content,
  imageUrls
}: Chapter & Content) => {
  const dirPath = path.join("content", chapterNo);
  const job = saveFile(
    path.join(dirPath, `${title}.html`),
    fullHTML(content.innerHTML)
  );
  const jobs = imageUrls.map(async url => {
    const filename = getFilename(url);
    const filepath = path.join(dirPath, "images", filename);
    const response = await fetch(url);
    await saveFile(filepath, await response.buffer());
  });
  return Promise.all([job, ...jobs]);
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
    return await savePage({ chapterNo, title, ...getContent(document) });
  });

  await preface;
  await Promise.all(chapters);
})();
