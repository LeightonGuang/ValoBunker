import Script from "next/script";

interface AdSenseProps {
  publisherId: string;
}

const AdSense = ({ publisherId }: AdSenseProps) => {
  return (
    <Script
      async
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-${publisherId}`}
      strategy="afterInteractive"
    />
  );
};

export default AdSense;
