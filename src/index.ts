import { JSDOM } from "jsdom";
import fetch from "node-fetch";

const url = "https://example.com";

const fetchDoc = async (url: string) => {
  const response = await fetch(url);
  const html = await response.text();
  const dom = new JSDOM(html);
  return dom.window.document;
};

(async () => {
  const document = await fetchDoc(url);
  const nodes = [...document.getElementsByTagName("p")];
  const texts = nodes.map(p => p.textContent);
  console.log(texts);
})();
