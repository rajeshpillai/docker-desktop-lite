// Function to list containers using Fetch API
async function fetchContainers() {
  try {
    const response = await fetch('http://localhost:3000/containers');
    
    if (!response.ok) {
      throw new Error(`Error fetching containers: ${response.statusText}`);
    }

    const data = await response.json();
    const containers = data.containers;

    // Render the table with container data
    renderTable(containers);
  } catch (error) {
    console.error('Error fetching containers:', error);
  }
}

// Function to start a container
async function startContainer(id) {
  try {
    const response = await fetch(`http://localhost:3000/containers/${id}/start`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Error starting container: ${response.statusText}`);
    }

    alert('Container started');
    fetchContainers(); // Refresh the container list
  } catch (error) {
    console.error('Error starting container:', error);
  }
}

// Function to stop a container
async function stopContainer(id) {
  try {
    const response = await fetch(`http://localhost:3000/containers/${id}/stop`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Error stopping container: ${response.statusText}`);
    }

    alert('Container stopped');
    fetchContainers(); // Refresh the container list
  } catch (error) {
    console.error('Error stopping container:', error);
  }
}

// Function to render the containers in a styled table
function renderTable(containers) {
  const output = document.getElementById('output');
  
  if (!containers || containers.length === 0) {
    output.innerHTML = '<p>No containers found.</p>';
    return;
  }

  const table = `
    <table class="min-w-full bg-white border-collapse">
      <thead class="bg-purple-600 text-white">
        <tr>
          <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Container Name</th>
          <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Container ID</th>
          <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Status</th>
          <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Action</th>
        </tr>
      </thead>
      <tbody>
        ${containers.map(container => `
          <tr class="border-b">
            <td class="py-3 px-4">${container.Names[0]}</td>
            <td class="py-3 px-4">${container.Id.substring(0, 12)}</td> <!-- Shorten the ID for better readability -->
            <td class="py-3 px-4">
              <span class="${container.State === 'running' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} py-1 px-2 rounded-full text-xs font-semibold">
                ${container.State === 'running' ? 'Active' : 'Inactive'}
              </span>
            </td>
            <td class="py-3 px-4">
              ${container.State !== 'running' ? 
                `<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mr-2" onclick="startContainer('${container.Id}')">Start</button>` :
                `<button class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded mr-2" onclick="stopContainer('${container.Id}')">Stop</button>`
              }
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  output.innerHTML = table;
}

// Event listeners for buttons
document.getElementById('list-containers').addEventListener('click', fetchContainers);

