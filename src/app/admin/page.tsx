"use client";

import React, { useState, useEffect } from 'react';
import { Project } from '../../types';

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);

    // Confirmation State
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [resetConfirm, setResetConfirm] = useState(false);

    // Form State
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: '', description: '', capacity: '4' });
    const [isAdding, setIsAdding] = useState(false);

    const fetchProjects = async () => {
        const res = await fetch('/api/projects');
        if (res.ok) {
            const data = await res.json();
            setProjects(data);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchProjects();
        }
    }, [isAuthenticated]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple client-side check to avoid unnecessary API calls, 
        // but real security is on the server
        if (password) setIsAuthenticated(true);
    };

    const handleAction = async (action: string, projectId?: string, data?: any) => {
        setLoading(true);
        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-password': password
                },
                body: JSON.stringify({
                    action,
                    projectId,
                    projectData: data
                }),
            });

            if (res.ok) {
                const updatedProjects = await res.json();
                setProjects(updatedProjects);
                setIsEditing(null);
                setIsAdding(false);
                setDeleteConfirmId(null);
                setResetConfirm(false);
                setFormData({ name: '', description: '', capacity: '4' });
            } else {
                alert('פעולה נכשלה. בדוק את הסיסמה.');
            }
        } catch (error) {
            console.error('Action failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const startEdit = (project: Project) => {
        setIsEditing(project.id);
        setFormData({
            name: project.name,
            description: project.description,
            capacity: project.capacity.toString()
        });
        setIsAdding(false);
        setDeleteConfirmId(null); // Clear other states
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100" dir="rtl">
                <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-96">
                    <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">כניסת מנהל</h1>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="סיסמת ניהול"
                        className="w-full px-4 py-2 border rounded mb-4 text-gray-800"
                        autoFocus
                    />
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                        הכנס
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8" dir="rtl">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">ניהול פרויקטים</h1>
                    <div className="space-x-4 space-x-reverse flex items-center">
                        <button
                            onClick={() => setIsAdding(true)}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            + הוסף פרויקט
                        </button>

                        {resetConfirm ? (
                            <div className="flex items-center gap-2 bg-red-50 p-1 rounded border border-red-200">
                                <span className="text-red-800 text-sm font-bold px-2">בטוח?</span>
                                <button
                                    onClick={() => handleAction('reset')}
                                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                                >
                                    כן, אפס הכל
                                </button>
                                <button
                                    onClick={() => setResetConfirm(false)}
                                    className="text-gray-600 hover:bg-gray-200 px-3 py-1 rounded text-sm"
                                >
                                    ביטול
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setResetConfirm(true)}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                אפס נרשמים
                            </button>
                        )}
                    </div>
                </div>

                {/* Add/Edit Form */}
                {(isAdding || isEditing) && (
                    <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-blue-200">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">{isAdding ? 'הוספת פרויקט חדש' : 'עריכת פרויקט'}</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <input
                                type="text"
                                placeholder="שם הפרויקט"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="border p-2 rounded text-gray-800"
                            />
                            <textarea
                                placeholder="תיאור"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="border p-2 rounded text-gray-800"
                                rows={3}
                            />
                            <input
                                type="number"
                                placeholder="קיבולת (מספר משתתפים)"
                                value={formData.capacity}
                                onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                                className="border p-2 rounded text-gray-800"
                            />
                            <div className="flex gap-2 justify-end">
                                <button
                                    onClick={() => { setIsAdding(false); setIsEditing(null); }}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    ביטול
                                </button>
                                <button
                                    onClick={() => handleAction(isAdding ? 'create' : 'update', isEditing || undefined, formData)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    disabled={loading}
                                >
                                    {loading ? 'שומר...' : 'שמור'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4">
                    {projects.map(project => (
                        <div key={project.id} className="bg-white p-6 rounded-lg shadow flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">{project.name}</h3>
                                <p className="text-gray-600">{project.description}</p>
                                <div className="mt-2 text-sm text-gray-500">
                                    רשומים: {project.currentCount} / {project.capacity}
                                    {project.users && project.users.length > 0 && (
                                        <span className="mr-2">({project.users.join(', ')})</span>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2 items-center">
                                <button
                                    onClick={() => startEdit(project)}
                                    className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded"
                                >
                                    ערוך
                                </button>

                                {deleteConfirmId === project.id ? (
                                    <div className="flex items-center gap-2 bg-red-50 p-1 rounded">
                                        <span className="text-red-800 text-xs">בטוח?</span>
                                        <button
                                            onClick={() => handleAction('delete', project.id)}
                                            className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-xs"
                                        >
                                            כן
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirmId(null)}
                                            className="text-gray-600 hover:bg-gray-200 px-2 py-1 rounded text-xs"
                                        >
                                            לא
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setDeleteConfirmId(project.id)}
                                        className="text-red-600 hover:bg-red-50 px-3 py-1 rounded"
                                    >
                                        מחק
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
