import Image from "next/image";
import ProjectList from "@/components/ProjectList";
import DashboardView from "@/components/DashboardView";

export default function Home() {
  return (
    <main className="min-h-screen p-8 md:p-24 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center md:hidden flex flex-col items-center">
          <div className="relative w-[350px] max-w-full h-[150px] mb-[50px]">
            <Image
              src="/logo.png"
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <p className="text-xl text-gray-600">אנא בחרו את הפרויקט אליו תרצו להצטרף. שימו לב: ניתן להצטרף לפרויקט אחד בלבד.</p>
        </header>

        {/* Desktop View - Dashboard */}
        <div className="hidden md:block">
          <DashboardView />
        </div>

        {/* Mobile View - Action */}
        <div className="block md:hidden">
          <ProjectList />
        </div>
      </div>
    </main>
  );
}
