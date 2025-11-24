import { kv } from '@vercel/kv';
import { Project } from '../types';
import { getProjects as getLocalProjects, setProjects as setLocalProjects } from './store';

const IS_KV_CONFIGURED = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

export async function getProjectsDB(): Promise<Project[]> {
    if (IS_KV_CONFIGURED) {
        try {
            const projects = await kv.get<Project[]>('projects');
            if (projects) {
                return projects;
            }
            // If KV is empty, initialize it with local defaults (first run)
            const initial = getLocalProjects();
            await kv.set('projects', initial);
            return initial;
        } catch (error) {
            console.error('KV Error:', error);
            return getLocalProjects(); // Fallback on error
        }
    } else {
        // Local development fallback
        return getLocalProjects();
    }
}

export async function saveProjectsDB(projects: Project[]): Promise<void> {
    if (IS_KV_CONFIGURED) {
        try {
            await kv.set('projects', projects);
        } catch (error) {
            console.error('KV Error:', error);
        }
    } else {
        // Local development fallback
        setLocalProjects(projects);
    }
}
