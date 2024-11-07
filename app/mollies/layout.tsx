export default function MolliesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <div className="w-full">{children}</div>
    </div>
  );
}
