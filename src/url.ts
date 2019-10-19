import { parse } from "path";

export const getFilename = (url: string) => {
  const { pathname } = new URL(url);
  const { base } = parse(pathname);
  return base;
};
