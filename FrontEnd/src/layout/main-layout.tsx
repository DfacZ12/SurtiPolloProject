
interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
      <main>
        {children}
      </main>
    </>
  );
}

export default MainLayout;