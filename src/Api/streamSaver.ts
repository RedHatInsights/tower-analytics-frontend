export const saveStream = (
  readableStream: ReadableStream,
  fileStream: WritableStream
): Promise<void> => {
  const writer = fileStream.getWriter();

  const reader = readableStream.getReader();
  const pump = (): Promise<void> =>
    reader.read().then((res) => {
      // This is not native download, so when user closes the window before
      // the download is complete, the file will seem stuck so we need to abort
      // it manually.
      window.onunload = () => {
        return writer.abort();
      };

      // As an addition we can ask the user if they want to really leave while
      // the download is in progress
      window.onbeforeunload = (evt) => {
        if (!res.done) {
          evt.returnValue = `Are you sure you want to leave?`;
        }
      };
      return res.done ? writer.close() : writer.write(res.value).then(pump);
    });

  return pump();
};
