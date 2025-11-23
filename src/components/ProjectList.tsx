"use client";

import React, { useState } from 'react';
import ProjectCard from './ProjectCard';
import { Project } from '../types';

const INITIAL_PROJECTS: Project[] = [
    {
        id: '1',
        name: 'פיתוח אתר תדמית',
        description: 'בניית אתר תדמית לעסק קטן הכולל דף בית, אודות, שירותים ויצירת קשר.',
        capacity: 4,
        currentCount: 2,
    },
    {
        id: '2',
        name: 'אפליקציית ניהול משימות',
        description: 'פיתוח אפליקציה לניהול משימות אישיות וצוותיות עם תמיכה בהתראות.',
        capacity: 4,
        currentCount: 0,
    },
    {
        id: '3',
        name: 'מערכת מסחר אלקטרוני',
        description: 'הקמת חנות וירטואלית עם קטלוג מוצרים, עגלת קניות וסליקה.',
        capacity: 4,
        currentCount: 3,
    },
    {
        id: '4',
        name: 'משחק דפדפן',
        description: 'פיתוח משחק דפדפן פשוט בטכנולוגיות Web (HTML5, Canvas).',
        capacity: 4,
        currentCount: 4,
    },
    {
        id: '5',
        name: 'בוט לטלגרם',
        description: 'יצירת בוט לטלגרם המספק מידע אוטומטי ושירות לקוחות בסיסי.',
        capacity: 4,
        currentCount: 1,
    },
    {
        id: '6',
        name: 'עיצוב ממשק משתמש',
        description: 'עיצוב UI/UX לאפליקציית מובייל חדשה בתחום הכושר והבריאות.',
        capacity: 4,
        currentCount: 2,
    },
];

export default function ProjectList() {
    const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
    const [joinedProjectId, setJoinedProjectId] = useState<string | null>(null);

    const handleJoin = (projectId: string) => {
        if (joinedProjectId === projectId) {
            // Leave project
            setProjects(prev => prev.map(p =>
                p.id === projectId ? { ...p, currentCount: p.currentCount - 1 } : p
            ));
            setJoinedProjectId(null);
        } else {
            // Join project
            if (joinedProjectId) return; // Already joined another project

            setProjects(prev => prev.map(p =>
                p.id === projectId ? { ...p, currentCount: p.currentCount + 1 } : p
            ));
            setJoinedProjectId(projectId);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
                <ProjectCard
                    key={project.id}
                    project={project}
                    onJoin={handleJoin}
                    isJoined={joinedProjectId === project.id}
                    isLocked={joinedProjectId !== null}
                />
            ))}
        </div>
    );
}
