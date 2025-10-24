import Footer from "./Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <main>
        {children}
      </main>
      <footer className="fixed bottom-0 left-0 w-full bg-gray-100 p-4">
        {<Footer/>}
      </footer>
    </>
  );
}
