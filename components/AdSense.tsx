interface AdSenseProps {
  publisherId: string;
}

const AdSense = ({ publisherId }: AdSenseProps) => {
  return (
    <script
      async
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-${publisherId}`}
    />
  );
};

export default AdSense;
