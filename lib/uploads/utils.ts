export class Utils {
  static uuidV4() {
    // Create an array to hold random bytes
    const ByteArray = new Uint8Array(16);

    // Fill the array with random values
    crypto.getRandomValues(ByteArray);

    // Set the version (4) and variant (2) bits
    ByteArray[6] = (ByteArray[6] & 0x0f) | 0x40;
    ByteArray[8] = (ByteArray[8] & 0x3f) | 0x80;

    // Convert the byte array to a hexadecimal string
    const Hex = Array.from(ByteArray)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    // Format the UUID string
    return [
      Hex.substr(0, 8),
      Hex.substr(8, 4),
      Hex.substr(12, 4),
      Hex.substr(16, 4),
      Hex.substr(20, 12),
    ].join("-");
  }
}
