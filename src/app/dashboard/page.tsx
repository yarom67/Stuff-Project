import ProjectList from '@/components/ProjectList';

export default function DashboardPage() {
    return (
        <main className="min-h-screen bg-gray-50 p-8" dir="rtl">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">לוח בקרה - בחירת פרויקטים</h1>
                    <p className="text-xl text-gray-600">מבט על על סטטוס הפרויקטים בזמן אמת</p>
                </header>
                <ProjectList readOnly={true} />
            </div>
        </main>
    );
}
