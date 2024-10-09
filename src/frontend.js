// Function to fetch and list containers using Fetch API
async function fetchContainers() {
  try {
    const response = await fetch('http://localhost:3000/containers');
    if (!response.ok) throw new Error(`Error fetching containers: ${response.statusText}`);
    const data = await response.json();
    renderTable(data.containers);
  } catch (error) {
    console.error('Error fetching containers:', error);
  }
}

// Function to start a container
async function startContainer(id) {
  try {
    const response = await fetch(`http://localhost:3000/containers/${id}/start`, { method: 'POST' });
    if (!response.ok) throw new Error(`Error starting container: ${response.statusText}`);
    alert('Container started');
    fetchContainers(); // Refresh the container list
  } catch (error) {
    console.error('Error starting container:', error);
  }
}

// Function to stop a container
async function stopContainer(id) {
  try {
    const response = await fetch(`http://localhost:3000/containers/${id}/stop`, { method: 'POST' });
    if (!response.ok) throw new Error(`Error stopping container: ${response.statusText}`);
    alert('Container stopped');
    fetchContainers(); // Refresh the container list
  } catch (error) {
    console.error('Error stopping container:', error);
  }
}

// Function to remove a container
async function removeContainer(id) {
  if (confirm("Are you sure you want to remove this container?")) {
    try {
      const response = await fetch(`http://localhost:3000/containers/${id}/remove`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`Error removing container: ${response.statusText}`);
      alert('Container removed');
      fetchContainers(); // Refresh the container list
    } catch (error) {
      console.error('Error removing container:', error);
    }
  }
}

// Function to render the containers in a table using Tailwind CSS
function renderTable(containers) {
  const output = document.getElementById('output');
  if (!containers || containers.length === 0) {
    output.innerHTML = '<p class="text-red-500">No containers found.</p>';
    return;
  }

  const table = `
    <table class="min-w-full bg-white border-collapse">
      <thead class="bg-purple-600 text-white">
        <tr>
          <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Container Name</th>
          <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Container ID</th>
          <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Ports</th>
          <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Status</th>
          <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th>
        </tr>
      </thead>
      <tbody>
        ${containers.map(container => `
          <tr class="border-b">
            <td class="py-3 px-4">${container.Names[0]}</td>
            <td class="py-3 px-4">${container.Id.substring(0, 12)}</td>
            <td class="py-3 px-4">${getPortMappings(container.Ports)}</td>
            <td class="py-3 px-4">
              <span class="${container.State === 'running' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} py-1 px-2 rounded-full text-xs font-semibold">
                ${container.State === 'running' ? 'Running' : 'Stopped'}
              </span>
            </td>
            <td class="py-3 px-4">
              ${container.State !== 'running' ? 
                `<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mr-2" onclick="startContainer('${container.Id}')">Start</button>` :
                `<button class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded mr-2" onclick="stopContainer('${container.Id}')">Stop</button>`
              }
              <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded ml-2" onclick="removeContainer('${container.Id}')">Remove</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  output.innerHTML = table;
}

// Helper function to format port mappings
function getPortMappings(ports) {
  if (ports.length === 0) {
    return 'No ports';
  }
  return ports
    .filter(port => port.PublicPort && port.IP)
    .map(port => `${port.IP}:${port.PublicPort} -> ${port.PrivatePort}`)
    .join(', ');
}

// Event listener for the List Containers button
document.getElementById('list-containers').addEventListener('click', fetchContainers);

