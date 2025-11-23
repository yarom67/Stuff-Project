import { NextResponse } from 'next/server';
import { getProjects, setProjects } from '../../../lib/store';

export async function GET() {
    return NextResponse.json(getProjects());
}

export async function POST(request: Request) {
    const body = await request.json();
    const { projectId, userName, action } = body;
    let projects = getProjects();

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

    setProjects(projects);
    return NextResponse.json(projects);
}
