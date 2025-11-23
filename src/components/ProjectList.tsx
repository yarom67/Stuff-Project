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

    // Poll for updates
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('/api/projects');
                if (res.ok) {
                    const data = await res.json();
                    setProjects(data);
                }
            } catch (error) {
                console.error('Failed to fetch projects:', error);
            }
        };

        fetchProjects();
        const interval = setInterval(fetchProjects, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleNameSubmit = (name: string) => {
        setUserName(name);
        setIsModalOpen(false);
    };

    const handleJoin = async (projectId: string) => {
        if (!userName) return;

        const action = joinedProjectId === projectId ? 'leave' : 'join';

        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId, userName, action }),
            });

            if (res.ok) {
                const updatedProjects = await res.json();
                setProjects(updatedProjects);
                if (action === 'join') {
                    setJoinedProjectId(projectId);
                } else {
                    setJoinedProjectId(null);
                }
            } else {
                const errorData = await res.json();
                alert(errorData.error); // Simple error handling
            }
        } catch (error) {
            console.error('Failed to update project:', error);
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
