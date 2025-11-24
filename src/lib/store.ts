import { Project } from '../types';

const INITIAL_PROJECTS: Project[] = [
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

// Use globalThis to persist data across hot reloads in development
const globalStore = globalThis as unknown as { projects: Project[] };

if (!globalStore.projects) {
    console.log('--- INITIALIZING GLOBAL STORE ---');
    globalStore.projects = INITIAL_PROJECTS;
} else {
    console.log('--- USING EXISTING GLOBAL STORE ---');
}

export const getProjects = () => globalStore.projects;

export const setProjects = (projects: Project[]) => {
    globalStore.projects = projects;
};
