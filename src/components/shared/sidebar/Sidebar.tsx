import DesktopSidebar from "./DesktopSidebar";
import MobileNav from "./MobileNav";

export default function Sidebar() {
  return (
    <>
      <MobileNav />
      <DesktopSidebar forceCollapsed className="md:flex lg:hidden" />
      <DesktopSidebar className="lg:flex" />
    </>
  );
}
