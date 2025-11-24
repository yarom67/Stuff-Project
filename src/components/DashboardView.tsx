"use client";

import React, { useEffect, useState } from 'react';
import { Project } from '../types';

export default function DashboardView() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

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
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
        const interval = setInterval(fetchProjects, 1000); // Poll every 1 second

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-64 text-xl text-gray-600">טוען נתונים...</div>;
    }

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-black">לוח בקרה - מצב פרויקטים בזמן אמת</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                    <div key={project.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-2 h-full bg-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-black">{project.name}</h3>
                            <div className={`flex items-center justify-center w-12 h-12 rounded-full ${project.currentCount >= project.capacity ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                <span className="text-lg font-bold">{project.currentCount}</span>
                            </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                            <div
                                className={`h-2.5 rounded-full ${project.currentCount >= project.capacity ? 'bg-red-500' : 'bg-blue-500'}`}
                                style={{ width: `${(project.currentCount / project.capacity) * 100}%` }}
                            ></div>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-wider">משתתפים רשומים:</h4>
                            {project.users && project.users.length > 0 ? (
                                <ul className="space-y-2">
                                    {project.users.map((user, index) => (
                                        <li key={index} className="flex items-center text-black font-medium bg-gray-100 px-3 py-1.5 rounded-md">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full ml-2"></div>
                                            {user}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-600 italic text-sm font-medium">אין נרשמים עדיין</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
