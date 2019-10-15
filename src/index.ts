import { JSDOM } from "jsdom";
import fetch from "node-fetch";
import { getTableOfContents } from "./dom";

const url =
  "https://bartoszmilewski.com/2014/10/28/category-theory-for-programmers-the-preface/";

const fetchDoc = async (url: string) => {
  const response = await fetch(url);
  const html = await response.text();
  const dom = new JSDOM(html);
  return dom.window.document;
};

(async () => {
  const document = await fetchDoc(url);
  const tableOfContents = getTableOfContents(document);
  console.log(tableOfContents);
})();
