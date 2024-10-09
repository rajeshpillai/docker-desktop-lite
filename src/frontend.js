// Function to fetch and list containers using Fetch API
async function fetchContainers() {
  try {
    const response = await fetch('http://localhost:3000/containers');
    if (!response.ok) throw new Error(`Error fetching containers: ${response.statusText}`);
    const data = await response.json();
    renderContainers(data.containers);
  } catch (error) {
    console.error('Error fetching containers:', error);
  }
}

// Function to render the containers as cards (mobile) and table (desktop)
function renderContainers(containers) {
  console.log("Rendering containers...");
  const output = document.getElementById('output');
  if (!containers || containers.length === 0) {
    output.innerHTML = '<p class="text-red-500">No containers found.</p>';
    return;
  }

  const mobileCards = containers.map(container => `
    <div class="block md:hidden bg-white shadow-md rounded-lg mb-4 p-4">
      <h2 class="text-xl font-bold mb-2">${container.Names[0]}</h2>
      <p class="text-sm mb-2"><strong>Container ID:</strong> ${container.Id.substring(0, 12)}</p>
      <p class="text-sm mb-2"><strong>Ports:</strong> ${getPortMappings(container.Pports)}</p>
      <p class="text-sm mb-2">
        <strong>Status:</strong> 
        <span class="${container.State === 'running' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} py-1 px-2 rounded-full text-xs font-semibold">
          ${container.State === 'running' ? 'Running' : 'Stopped'}
        </span>
      </p>
      <div class="mt-4 flex space-x-2">
        <button class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded" onclick="inspectContainer('${container.Id}')">Inspect</button>
        ${container.State !== 'running' ? 
          `<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded" onclick="startContainer('${container.Id}')">Start</button>` :
          `<button class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded" onclick="stopContainer('${container.Id}')">Stop</button>`
        }
        <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded" onclick="removeContainer('${container.Id}')">Remove</button>
      </div>
    </div>
  `).join('');

  const desktopTable = `
    <table class="hidden md:table min-w-full bg-white border-collapse">
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
              <button class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded" onclick="inspectContainer('${container.Id}')">Inspect</button>
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

  output.innerHTML = mobileCards + desktopTable;
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

// Function to inspect a container (Detailed view)
async function inspectContainer(id) {
  try {
    const response = await fetch(`http://localhost:3000/containers/${id}/inspect`);
    if (!response.ok) throw new Error(`Error inspecting container: ${response.statusText}`);
    const data = await response.json();
    displayInspectModal(data); // Show details in a modal
  } catch (error) {
    console.error('Error inspecting container:', error);
  }
}

// Function to display inspect modal
function displayInspectModal(containerInfo) {
  const modal = document.getElementById('inspect-modal');
  const modalContent = document.getElementById('inspect-modal-content');

  modalContent.innerHTML = `
    <h2 class="text-xl font-bold mb-2">Container: ${containerInfo.Name}</h2>
    <p><strong>ID:</strong> ${containerInfo.Id}</p>
    <p><strong>Image:</strong> ${containerInfo.Config.Image}</p>
    <p><strong>State:</strong> ${containerInfo.State.Status}</p>
    <p><strong>Created:</strong> ${new Date(containerInfo.Created).toLocaleString()}</p>
    <p><strong>Env Variables:</strong> ${containerInfo.Config.Env.join(', ')}</p>
    <p><strong>Volumes:</strong> ${JSON.stringify(containerInfo.Mounts)}</p>
    <button class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded mt-4" onclick="closeModal()">Close</button>
  `;

  // Show the modal
  modal.classList.remove('hidden');
}

// Function to close the modal
function closeModal() {
  const modal = document.getElementById('inspect-modal');
  modal.classList.add('hidden');
}

// Helper function to format port mappings
// Helper function to format port mappings
function getPortMappings(ports) {
  // Check if ports is defined and is an array
  if (!ports || ports.length === 0) {
    return 'No ports';
  }

  return ports
    .filter(port => port.PublicPort && port.IP)
    .map(port => `${port.IP}:${port.PublicPort} -> ${port.PrivatePort}`)
    .join(', ');
}


// Event listener for the List Containers button
document.getElementById('list-containers').addEventListener('click', fetchContainers);
