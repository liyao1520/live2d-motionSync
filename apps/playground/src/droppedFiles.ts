type ModelFile = { path: string; file: File };

async function readEntry(entry: FileSystemEntry): Promise<ModelFile[]> {
  if (entry.isFile) {
    const file = await new Promise<File>((resolve, reject) =>
      (entry as FileSystemFileEntry).file(resolve, reject),
    );
    return [{ path: entry.fullPath.replace(/^\//, ''), file }];
  }
  if (!entry.isDirectory) return [];
  const reader = (entry as FileSystemDirectoryEntry).createReader();
  const files: ModelFile[] = [];
  // Browsers return directory entries in batches; read until exhausted.
  while (true) {
    const batch = await new Promise<FileSystemEntry[]>((resolve, reject) =>
      reader.readEntries(resolve, reject),
    );
    if (!batch.length) return files;
    for (const child of batch) files.push(...(await readEntry(child)));
  }
}

export function readDroppedFiles(data: DataTransfer): Promise<ModelFile[]> {
  // Capture entries and files synchronously: the drag data store closes after drop.
  const items = Array.from(data.items).filter((item) => item.kind === 'file');
  const reads = items.map((item) => {
    const entry = item.webkitGetAsEntry?.();
    if (entry) return readEntry(entry);
    const file = item.getAsFile();
    return Promise.resolve(file ? [{ path: file.webkitRelativePath || file.name, file }] : []);
  });
  if (!items.length) {
    return Promise.resolve(
      Array.from(data.files, (file) => ({ path: file.webkitRelativePath || file.name, file })),
    );
  }
  return Promise.all(reads).then((groups) => groups.flat());
}
