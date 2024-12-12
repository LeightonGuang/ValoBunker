"use client";

import { useEffect } from "react";

interface AdSenseBannerProps {
  dataAdSlot: string;
  dataAdFormat: string;
  dataFullWidthResponsive: boolean;
}

const AdSenseBanner = ({
  dataAdSlot,
  dataAdFormat,
  dataFullWidthResponsive,
}: AdSenseBannerProps) => {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
        {},
      );
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      data-ad-client={`ca-${process.env.NextUI_ADSENSE_CLIENT_ID}`}
      data-ad-format={dataAdFormat}
      data-ad-slot={dataAdSlot}
      data-full-width-responsive={dataFullWidthResponsive.toString()}
      style={{ display: "block" }}
    />
  );
};

export default AdSenseBanner;
