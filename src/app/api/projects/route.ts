import { NextResponse } from 'next/server';
import { getProjectsDB, saveProjectsDB } from '../../../lib/db';
import { Project } from '../../../types';

// Helper to verify admin password
const verifyAdmin = (request: Request) => {
    const adminPassword = request.headers.get('x-admin-password');
    const envPassword = process.env.ADMIN_PASSWORD;

    // In development, if no password is set in .env, allow access (hassle-free local dev)
    if (!envPassword && process.env.NODE_ENV === 'development') {
        return true;
    }

    // If no password set in env (and not dev), deny access for safety
    if (!envPassword) return false;
    return adminPassword === envPassword;
};

export async function GET() {
    const projects = await getProjectsDB();
    return NextResponse.json(projects);
}

export async function POST(request: Request) {
    const body = await request.json();
    const { projectId, userName, action, projectData } = body;

    // Get current state
    const currentProjects = await getProjectsDB();

    // Create a deep copy to avoid direct mutation issues
    let projects = JSON.parse(JSON.stringify(currentProjects));

    // --- ADMIN ACTIONS ---
    if (action === 'create' || action === 'update' || action === 'delete' || action === 'reset') {

        if (!verifyAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (action === 'create') {
            const newProject: Project = {
                id: Date.now().toString(), // Simple ID generation
                name: projectData.name,
                description: projectData.description,
                capacity: parseInt(projectData.capacity),
                currentCount: 0,
                users: []
            };
            projects.push(newProject);
        } else if (action === 'update') {
            const index = projects.findIndex((p: any) => p.id === projectId);
            if (index !== -1) {
                projects[index] = {
                    ...projects[index],
                    name: projectData.name,
                    description: projectData.description,
                    capacity: parseInt(projectData.capacity)
                };
            }
        } else if (action === 'delete') {
            projects = projects.filter((p: any) => p.id !== projectId);
        } else if (action === 'reset') {
            projects = projects.map((p: any) => ({
                ...p,
                currentCount: 0,
                users: []
            }));
        }

        await saveProjectsDB(projects);
        return NextResponse.json(projects);
    }

    // --- USER ACTIONS ---

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
    await saveProjectsDB(projects);

    return NextResponse.json(projects);
}
