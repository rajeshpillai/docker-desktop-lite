// compose.js

export async function listComposeServices() {
  const projectDir = document.getElementById('project-dir').value;
  if (!projectDir) return alert('Please select a project directory.');

  try {
    const response = await fetch('http://localhost:3000/compose/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectDir })
    });
    if (!response.ok) throw new Error(`Error fetching services: ${response.statusText}`);
    const data = await response.json();
    renderComposeServices(data.services);
  } catch (error) {
    console.error('Error fetching Docker Compose services:', error);
  }
}

export async function startCompose() {
  const projectDir = document.getElementById('project-dir').value;
  if (!projectDir) return alert('Please select a project directory.');

  try {
    const response = await fetch('http://localhost:3000/compose/up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectDir })
    });
    if (!response.ok) throw new Error(`Error starting services: ${response.statusText}`);
    alert('Docker Compose services started.');
    listComposeServices();
  } catch (error) {
    console.error('Error starting Docker Compose services:', error);
  }
}

export async function stopCompose() {
  const projectDir = document.getElementById('project-dir').value;
  if (!projectDir) return alert('Please select a project directory.');

  try {
    const response = await fetch('http://localhost:3000/compose/down', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectDir })
    });
    if (!response.ok) throw new Error(`Error stopping services: ${response.statusText}`);
    alert('Docker Compose services stopped.');
    listComposeServices();
  } catch (error) {
    console.error('Error stopping Docker Compose services:', error);
  }
}

function renderComposeServices(services) {
  const output = document.getElementById('compose-output');
  output.innerHTML = `<pre>${services}</pre>`;
}
