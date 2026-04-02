import Navbar from "@/components/shared/navbar/Navbar";
import Sidebar from "@/components/shared/sidebar/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar user={null} />
      <div className="flex min-h-screen w-full">
        <Sidebar />
        <main className="w-full flex-1 px-4 pb-28 pt-20 md:px-6 md:pb-8 lg:px-8">
          {children}
        </main>
      </div>
    </>
  );
}
