import Image from "next/image";
import ProjectList from "@/components/ProjectList";

export default function Home() {
  return (
    <main className="min-h-screen p-8 md:p-24 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">בחירת פרויקט גמר</h1>
          <p className="text-xl text-gray-600">אנא בחרו את הפרויקט אליו תרצו להצטרף. שימו לב: ניתן להצטרף לפרויקט אחד בלבד.</p>
        </header>
        <ProjectList />
      </div>
    </main>
  );
}
