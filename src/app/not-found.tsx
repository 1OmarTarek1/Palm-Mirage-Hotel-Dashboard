import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <h1 className="text-7xl font-extrabold text-gray-900 tracking-tight mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
      <p className="text-gray-500 mb-8 max-w-sm mx-auto">
        Oops! The page you are looking for doesn't exist or has been moved.
      </p>
      <Button asChild>
        <Link href="/">
          Return To Dashboard
        </Link>
      </Button>
    </div>
  );
}
