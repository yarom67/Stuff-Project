import React from 'react';
import { Project } from '../types';

interface ProjectCardProps {
    project: Project;
    onJoin: (projectId: string) => void;
    isJoined: boolean;
    isLocked: boolean;
}

export default function ProjectCard({ project, onJoin, isJoined, isLocked }: ProjectCardProps) {
    const isFull = project.currentCount >= project.capacity;
    const isDisabled = isFull || (isLocked && !isJoined);

    return (
        <div className={`border rounded-lg p-6 shadow-sm transition-all ${isJoined ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:shadow-md'}`}>
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">{project.name}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${isFull ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {project.currentCount} / {project.capacity}
                </span>
            </div>
            <p className="text-gray-600 mb-6">{project.description}</p>
            <button
                onClick={() => onJoin(project.id)}
                disabled={isDisabled}
                className={`w-full py-2 px-4 rounded-md font-medium transition-colors
          ${isJoined
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : isDisabled
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
            >
                {isJoined ? 'Joined' : isFull ? 'Full' : 'Join Project'}
            </button>
        </div>
    );
}
