// compose.js

// Variable to store the selected project directory
let selectedProjectDir = '';

// Function to update the selected directory
export function selectProjectDirectory() {
  selectedProjectDir = document.getElementById('project-dir').value;
  console.log(`Project directory selected: ${selectedProjectDir}`); // Debugging
}

// Fetch Docker Compose services
export async function listComposeServices() {
  if (!selectedProjectDir) return alert('Please select a project directory.');

  try {
    const response = await fetch('http://localhost:3000/compose/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectDir: selectedProjectDir })
    });
    if (!response.ok) throw new Error(`Error fetching services: ${response.statusText}`);
    const data = await response.json();
    renderComposeServices(data.services);
  } catch (error) {
    console.error('Error fetching Docker Compose services:', error);
  }
}

// Render Docker Compose services
function renderComposeServices(services) {
  const output = document.getElementById('compose-output');
  if (!services || services.length === 0) {
    output.innerHTML = '<p class="text-red-500">No services found.</p>';
    return;
  }

  const serviceRows = services.map(service => `
    <div class="bg-white shadow-md rounded-lg mb-4 p-4">
      <h2 class="text-lg font-bold">${service}</h2>
    </div>
  `).join('');

  output.innerHTML = serviceRows;
}

// Start Docker Compose services
export async function startCompose() {
  if (!selectedProjectDir) return alert('Please select a project directory.');

  try {
    const response = await fetch('http://localhost:3000/compose/up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectDir: selectedProjectDir })
    });
    if (!response.ok) throw new Error(`Error starting services: ${response.statusText}`);
    const data = await response.json();
    alert(data.message);
    listComposeServices();  // Refresh services list
  } catch (error) {
    console.error('Error starting Docker Compose services:', error);
  }
}

// Stop Docker Compose services
export async function stopCompose() {
  if (!selectedProjectDir) return alert('Please select a project directory.');

  try {
    const response = await fetch('http://localhost:3000/compose/down', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectDir: selectedProjectDir })
    });
    if (!response.ok) throw new Error(`Error stopping services: ${response.statusText}`);
    const data = await response.json();
    alert(data.message);
    listComposeServices();  // Refresh services list
  } catch (error) {
    console.error('Error stopping Docker Compose services:', error);
  }
}
