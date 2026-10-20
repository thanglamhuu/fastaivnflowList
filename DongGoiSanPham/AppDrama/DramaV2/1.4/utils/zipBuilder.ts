/**
 * Bảng tra cứu CRC32 tính trước
 */
const CRC_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  CRC_TABLE[i] = c;
}
export function crc32(buf: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
export interface ZipFileInput {
  name: string;
  data: Uint8Array;
}
/**
 * Tạo file ZIP chuẩn định dạng PKZip (Store Mode - uncompressed)
 * Chạy trực tiếp trên TypedArray, không cấp phát thừa RAM, tương thích 100% với Windows/Mac/Linux unzipper.
 */
export function buildStoreZip(files: ZipFileInput[]): Uint8Array {
  const encoder = new TextEncoder();
  const fileRecords: Array<{
    nameBytes: Uint8Array;
    data: Uint8Array;
    crc: number;
    offset: number;
  }> = [];
  let currentOffset = 0;
  const localHeaders: Uint8Array[] = [];
  for (const file of files) {
    const nameBytes = encoder.encode(file.name);
    const data = file.data;
    const fileCrc = crc32(data);
    // Local Header (30 bytes) + Name + Data
    const localHeader = new Uint8Array(30);
    const lv = new DataView(localHeader.buffer);
    lv.setUint32(0, 0x04034b50, true); // Local file header signature
    lv.setUint16(4, 20, true);         // Version needed to extract (2.0)
    lv.setUint16(6, 0x0800, true);     // General purpose bit flag (Bit 11: UTF-8)
    lv.setUint16(8, 0, true);          // Compression method: 0 (Stored)
    lv.setUint16(10, 0x4800, true);    // Last mod file time
    lv.setUint16(12, 0x5421, true);    // Last mod file date
    lv.setUint32(14, fileCrc, true);   // CRC-32
    lv.setUint32(18, data.length, true); // Compressed size
    lv.setUint32(22, data.length, true); // Uncompressed size
    lv.setUint16(26, nameBytes.length, true); // File name length
    lv.setUint16(28, 0, true);         // Extra field length
    fileRecords.push({
      nameBytes,
      data,
      crc: fileCrc,
      offset: currentOffset,
    });
    localHeaders.push(localHeader, nameBytes, data);
    currentOffset += 30 + nameBytes.length + data.length;
  }
  const centralDirectoryOffset = currentOffset;
  const cdHeaders: Uint8Array[] = [];
  let centralDirectorySize = 0;
  for (const record of fileRecords) {
    const cdHeader = new Uint8Array(46);
    const cv = new DataView(cdHeader.buffer);
    cv.setUint32(0, 0x02014b50, true); // Central directory file header signature
    cv.setUint16(4, 20, true);         // Version made by
    cv.setUint16(6, 20, true);         // Version needed
    cv.setUint16(8, 0x0800, true);     // UTF-8
    cv.setUint16(10, 0, true);         // Stored
    cv.setUint16(12, 0x4800, true);    // Time
    cv.setUint16(14, 0x5421, true);    // Date
    cv.setUint32(16, record.crc, true); // CRC-32
    cv.setUint32(20, record.data.length, true); // Compressed size
    cv.setUint32(24, record.data.length, true); // Uncompressed size
    cv.setUint16(28, record.nameBytes.length, true); // Name length
    cv.setUint16(30, 0, true);         // Extra field length
    cv.setUint16(32, 0, true);         // Comment length
    cv.setUint16(34, 0, true);         // Disk number
    cv.setUint16(36, 0, true);         // Internal attributes
    cv.setUint32(38, 0, true);         // External attributes
    cv.setUint32(42, record.offset, true); // Relative offset of local header
    cdHeaders.push(cdHeader, record.nameBytes);
    centralDirectorySize += 46 + record.nameBytes.length;
  }
  // End of Central Directory Record (22 bytes)
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true);  // EOCD signature
  ev.setUint16(4, 0, true);           // Disk number
  ev.setUint16(6, 0, true);           // Disk with CD
  ev.setUint16(8, files.length, true);// Total entries on disk
  ev.setUint16(10, files.length, true);// Total entries in CD
  ev.setUint32(12, centralDirectorySize, true); // Size of CD
  ev.setUint32(16, centralDirectoryOffset, true); // Offset of CD
  ev.setUint16(20, 0, true);          // Comment length
  // Tổng hợp tất cả các chunks thành một Uint8Array duy nhất
  const totalLength = centralDirectoryOffset + centralDirectorySize + 22;
  const result = new Uint8Array(totalLength);
  let pos = 0;
  for (const chunk of [...localHeaders, ...cdHeaders, eocd]) {
    result.set(chunk, pos);
    pos += chunk.length;
  }
  return result;
}