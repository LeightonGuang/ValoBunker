interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, className }) => {
  return (
    <main className={`h-[calc(100vh-4rem)] overflow-scroll ${className}`}>
      {children}
    </main>
  );
};

export default MainLayout;
