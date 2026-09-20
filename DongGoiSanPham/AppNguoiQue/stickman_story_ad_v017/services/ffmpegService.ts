import { toBlobURL } from '@ffmpeg/util';
class FFmpegService {
  private worker: Worker | null = null;
  async load() { /* Implementation as shown in app state */ }
  async exec(args: string[]) { /* ... */ }
  async writeFile(path: string, data: any) { /* ... */ }
  async readFile(path: string) { /* ... */ }
  async deleteFile(path: string) { /* ... */ }
}
export const ffmpegService = new FFmpegService();