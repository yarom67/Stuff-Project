import { NextResponse } from 'next/server';
import { Project } from '../../../types';

// In-memory storage
let projects: Project[] = [
    {
        id: '1',
        name: 'פיתוח אתר תדמית',
        description: 'בניית אתר תדמית לעסק קטן הכולל דף בית, אודות, שירותים ויצירת קשר.',
        capacity: 4,
        currentCount: 0,
        users: [],
    },
    {
        id: '2',
        name: 'אפליקציית ניהול משימות',
        description: 'פיתוח אפליקציה לניהול משימות אישיות וצוותיות עם תמיכה בהתראות.',
        capacity: 4,
        currentCount: 0,
        users: [],
    },
    {
        id: '3',
        name: 'מערכת מסחר אלקטרוני',
        description: 'הקמת חנות וירטואלית עם קטלוג מוצרים, עגלת קניות וסליקה.',
        capacity: 4,
        currentCount: 0,
        users: [],
    },
    {
        id: '4',
        name: 'משחק דפדפן',
        description: 'פיתוח משחק דפדפן פשוט בטכנולוגיות Web (HTML5, Canvas).',
        capacity: 4,
        currentCount: 0,
        users: [],
    },
    {
        id: '5',
        name: 'בוט לטלגרם',
        description: 'יצירת בוט לטלגרם המספק מידע אוטומטי ושירות לקוחות בסיסי.',
        capacity: 4,
        currentCount: 0,
        users: [],
    },
    {
        id: '6',
        name: 'עיצוב ממשק משתמש',
        description: 'עיצוב UI/UX לאפליקציית מובייל חדשה בתחום הכושר והבריאות.',
        capacity: 4,
        currentCount: 0,
        users: [],
    },
];

export async function GET() {
    return NextResponse.json(projects);
}

export async function POST(request: Request) {
    const body = await request.json();
    const { projectId, userName, action } = body;

    if (!projectId || !userName || !action) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const project = projects[projectIndex];

    if (action === 'join') {
        if (project.currentCount >= project.capacity) {
            return NextResponse.json({ error: 'Project is full' }, { status: 400 });
        }
        if (project.users.includes(userName)) {
            return NextResponse.json({ error: 'User already in project' }, { status: 400 });
        }

        // Remove user from other projects first (enforce single project rule)
        projects = projects.map(p => {
            if (p.users.includes(userName)) {
                return {
                    ...p,
                    users: p.users.filter(u => u !== userName),
                    currentCount: p.users.filter(u => u !== userName).length
                };
            }
            return p;
        });

        // Re-fetch project after potential modification above
        const updatedProjectIndex = projects.findIndex(p => p.id === projectId);
        projects[updatedProjectIndex].users.push(userName);
        projects[updatedProjectIndex].currentCount = projects[updatedProjectIndex].users.length;

    } else if (action === 'leave') {
        projects[projectIndex].users = project.users.filter(u => u !== userName);
        projects[projectIndex].currentCount = projects[projectIndex].users.length;
    }

    return NextResponse.json(projects);
}
