export default function ModeratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Add role check for authorized users, redirect to homepage if user lacks required role

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <div className="w-full">{children}</div>
    </div>
  );
}
