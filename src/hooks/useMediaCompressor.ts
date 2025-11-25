import { useState } from "react";
// import { Video, Image } from "react-native-compressor";

type MediaType = "image" | "video";

interface CompressOptions {
  type: MediaType;
  uri: string;
  compressionRate?: number;
}

export function useMediaCompressor() {
  const [compressing, setCompressing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const compress = async ({
    type,
    uri,
  }: CompressOptions): Promise<string | null> => {
    setCompressing(true);
    setError(null);
    try {
      let result: string = "";
      if (type === "image") {
        // result = await Image.compress(uri, {
        //   compressionMethod: "auto",
        //   output: "png",
        //   returnableOutputType: "uri",
        // });
      } else {
        // result = await Video.compress(uri);
      }
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
    error,
  };
}
