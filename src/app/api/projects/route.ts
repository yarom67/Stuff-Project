import { NextResponse } from 'next/server';
import { getProjects, setProjects } from '../../../lib/store';

export async function GET() {
    const projects = getProjects();
    // console.log('GET /api/projects:', projects.map(p => p.currentCount));
    return NextResponse.json(projects);
}

export async function POST(request: Request) {
    const body = await request.json();
    const { projectId, userName, action } = body;

    // Get current state
    const currentProjects = getProjects();

    // Create a deep copy to avoid direct mutation issues
    let projects = JSON.parse(JSON.stringify(currentProjects));

    if (!projectId || !userName || !action) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const projectIndex = projects.findIndex((p: any) => p.id === projectId);
    if (projectIndex === -1) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (action === 'join') {
        const targetProject = projects[projectIndex];

        // Check capacity
        if (targetProject.currentCount >= targetProject.capacity) {
            return NextResponse.json({ error: 'Project is full' }, { status: 400 });
        }

        // Check if already in THIS project
        if (targetProject.users.includes(userName)) {
            return NextResponse.json({ error: 'User already in project' }, { status: 400 });
        }

        // Remove user from ALL projects first (enforce single project rule)
        projects = projects.map((p: any) => {
            if (p.users.includes(userName)) {
                const newUsers = p.users.filter((u: string) => u !== userName);
                return {
                    ...p,
                    users: newUsers,
                    currentCount: newUsers.length
                };
            }
            return p;
        });

        // Now add to the target project
        // We need to find the index again because the array might have been mapped
        const updatedTargetIndex = projects.findIndex((p: any) => p.id === projectId);
        if (updatedTargetIndex !== -1) {
            projects[updatedTargetIndex].users.push(userName);
            projects[updatedTargetIndex].currentCount = projects[updatedTargetIndex].users.length;
        }

    } else if (action === 'leave') {
        // Remove user from the specific project
        const targetProject = projects[projectIndex];
        const newUsers = targetProject.users.filter((u: string) => u !== userName);
        projects[projectIndex] = {
            ...targetProject,
            users: newUsers,
            currentCount: newUsers.length
        };
    }

    // Save the updated state
    setProjects(projects);

    return NextResponse.json(projects);
}
