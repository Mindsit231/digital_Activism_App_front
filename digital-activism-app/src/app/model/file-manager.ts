export class FileManager {
  public convertBytesToUrl(file: string, type: string) {
    const byteArray = new Uint8Array(
      atob(file).split('').map(char => char.charCodeAt(0))
    )
    const blob = new Blob([byteArray], {type: type});
    return URL.createObjectURL(blob);
  }
}
