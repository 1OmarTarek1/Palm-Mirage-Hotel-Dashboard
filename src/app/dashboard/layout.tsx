import Navbar from "@/components/shared/navbar/Navbar";
import Sidebar from "@/components/shared/sidebar/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Navbar user={null} />
        <main className="w-full flex-1 px-4 pb-28 pt-4 md:px-6 md:pb-8 md:pt-5 lg:px-8 lg:pt-6">
          {children}
        </main>
      </div>
    </div>
  );
}
