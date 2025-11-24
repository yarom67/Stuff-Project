
// const fetch = require('node-fetch'); // Native fetch is available in Node 18+

async function runTest() {
    const baseUrl = 'http://localhost:3000/api/projects';

    // 1. Reset (cannot easily reset without restarting server, but we can pick a project)
    const projectId = '1';

    console.log('--- Joining User A ---');
    await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, userName: 'User A', action: 'join' })
    });

    let res = await fetch(baseUrl);
    let projects = await res.json();
    let project = projects.find(p => p.id === projectId);
    console.log('Users after User A:', project.users);

    console.log('--- Joining User B ---');
    await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, userName: 'User B', action: 'join' })
    });

    res = await fetch(baseUrl);
    projects = await res.json();
    project = projects.find(p => p.id === projectId);
    console.log('Users after User B:', project.users);

    if (project.users.length === 2) {
        console.log('SUCCESS: Both users are present.');
    } else {
        console.log('FAILURE: Only ' + project.users.length + ' user(s) present.');
    }
}

runTest();
