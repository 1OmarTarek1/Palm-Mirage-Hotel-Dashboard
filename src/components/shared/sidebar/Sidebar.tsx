import DesktopSidebar from "./DesktopSidebar";
import MobileNav from "./MobileNav";
import TabletSidebar from "./TabletSidebar";

export default function Sidebar() {
  return (
    <>
      <MobileNav />
      <TabletSidebar />
      <DesktopSidebar />
    </>
  );
}
