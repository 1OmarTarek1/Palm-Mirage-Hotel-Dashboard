import Navbar from "@/components/shared/navbar/Navbar";
import Sidebar from "@/components/shared/sidebar/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar user={null} />
      <div className="flex min-h-screen w-full">
        <Sidebar />
        <main className="pt-16 w-full">{children}</main>
      </div>
    </>
  );
}
