"use client";

import React, { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';
import NameModal from './NameModal';
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

export default function ProjectList() {
    const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
    const [joinedProjectId, setJoinedProjectId] = useState<string | null>(null);
    const [userName, setUserName] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(true);

    const handleNameSubmit = (name: string) => {
        setUserName(name);
        setIsModalOpen(false);
    };

    const handleJoin = (projectId: string) => {
        if (!userName) return;

        if (joinedProjectId === projectId) {
            // Leave project
            setProjects(prev => prev.map(p =>
                p.id === projectId ? {
                    ...p,
                    currentCount: p.currentCount - 1,
                    users: p.users.filter(u => u !== userName)
                } : p
            ));
            setJoinedProjectId(null);
        } else {
            // Join project
            if (joinedProjectId) return; // Already joined another project

            setProjects(prev => prev.map(p =>
                p.id === projectId ? {
                    ...p,
                    currentCount: p.currentCount + 1,
                    users: [...p.users, userName]
                } : p
            ));
            setJoinedProjectId(projectId);
        }
    };

    return (
        <>
            <NameModal isOpen={isModalOpen} onSubmit={handleNameSubmit} />
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
        </>
    );
}
