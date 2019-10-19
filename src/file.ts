import { mkdir, writeFile } from "fs";
import { parse } from "path";
import { promisify } from "util";

const makeDirAsync = promisify(mkdir);
const writeFileAsync = promisify(writeFile);

export const saveFile = async (
  path: string,
  data: string | Buffer
): Promise<void> => {
  const { dir } = parse(path);
  await makeDirAsync(dir, { recursive: true, mode: 0o775 });
  await writeFileAsync(path, data);
};
