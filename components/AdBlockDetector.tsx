"use client";

import { useEffect, useState } from "react";
import { useDetectAdBlock } from "adblock-detect-react";

const AdBlockDetector = ({ children }: { children: React.ReactNode }) => {
  const adBlockDetected = useDetectAdBlock();
  const [hasAdBlock, setHasAdBlock] = useState(false);

  useEffect(() => {
    if (adBlockDetected) {
      setHasAdBlock(true);
    }
  }, [adBlockDetected]);

  return hasAdBlock ? (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="max-w-md text-center">
        <h1 className="mb-4 text-2xl font-bold">
          Please Disable Your Ad Blocker
        </h1>
        <p className="text-gray-700 mb-4 text-lg">
          This website is created and maintained by one person. Ads help support
          this project. Consider disabling your ad blocker to ensure the site
          continues to thrive.
        </p>
      </div>
    </div>
  ) : (
    <>{children}</>
  );
};

export default AdBlockDetector;
