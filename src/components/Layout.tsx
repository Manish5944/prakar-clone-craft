import Header from "@/components/Header";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  onSearch?: (query: string) => void;
}

const Layout = ({ children, onSearch }: LayoutProps) => {
  return (
    <div className="min-h-screen flex w-full bg-wallcraft-darker">
      <div className="flex-1 flex flex-col">
        <Header onSearch={onSearch} />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
