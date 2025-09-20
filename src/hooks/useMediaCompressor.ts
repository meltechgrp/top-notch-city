import { useState } from "react";
// import { Video, Image } from "react-native-compressor";

type MediaType = "image" | "video";

interface CompressOptions {
  type: MediaType;
  uri: string;
  compressionRate?: number; // 0.1 to 1 (lower = higher compression)
  maxWidth?: number;
  maxHeight?: number;
}

export function useMediaCompressor() {
  const [compressing, setCompressing] = useState(false);
  const [compressedUri, setCompressedUri] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const compress = async ({
    type,
    uri,
    compressionRate = 0.3,
  }: CompressOptions): Promise<string | null> => {
    setCompressing(true);
    setError(null);
    try {
      let result: string;
      if (type === "image") {
        // result = await Image.compress(uri, {
        //   compressionMethod: "manual",
        //   quality: compressionRate,
        //   output: "jpg",
        //   returnableOutputType: "uri",
        // });
        return "";
      } else {
        // result = await Video.compress(uri);
        return "";
      }

      setCompressedUri(result);
      return result;
    } catch (err: any) {
      setError(err);
      return null;
    } finally {
      setCompressing(false);
    }
  };

  return {
    compress,
    compressing,
    compressedUri,
    error,
  };
}
