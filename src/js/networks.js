// networks.js

// Function to list Docker networks
export async function listNetworks() {
  try {
    const response = await fetch('http://localhost:3000/networks');
    if (!response.ok) throw new Error(`Error fetching networks: ${response.statusText}`);
    const data = await response.json();
    renderNetworks(data.networks);
  } catch (error) {
    console.error('Error fetching networks:', error);
  }
}

// Function to render Docker networks
export function renderNetworks(networks) {
  const output = document.getElementById('networks-output');
  if (!networks || networks.length === 0) {
    output.innerHTML = '<p class="text-red-500">No networks found.</p>';
    return;
  }

  const networkRows = networks.map(network => `
    <div class="bg-white shadow-md rounded-lg mb-4 p-4">
      <h2 class="text-lg font-bold">${network.Name}</h2>
      <p><strong>ID:</strong> ${network.Id}</p>
      <p><strong>Driver:</strong> ${network.Driver}</p>
      <p><strong>Scope:</strong> ${network.Scope}</p>
      <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded mt-2" data-network-id="${network.Id}">Remove</button>
    </div>
  `).join('');

  output.innerHTML = networkRows;

  // Add event listeners to all Remove buttons after rendering networks
  document.querySelectorAll('button[data-network-id]').forEach(button => {
    const networkId = button.getAttribute('data-network-id');
    button.addEventListener('click', () => removeNetwork(networkId));
  });
}

// Function to remove a Docker network
export async function removeNetwork(id) {
  if (!confirm('Are you sure you want to remove this network?')) return;

  try {
    const response = await fetch(`http://localhost:3000/networks/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`Error removing network: ${response.statusText}`);
    alert('Network removed successfully.');
    listNetworks();  // Refresh the network list
  } catch (error) {
    console.error('Error removing network:', error);
  }
}

// Function to create a new Docker network
export async function createNetwork() {
  const networkName = document.getElementById('network-name').value;
  const networkDriver = document.getElementById('network-driver').value;
  
  if (!networkName) return alert('Please enter a network name.');

  try {
    const response = await fetch('http://localhost:3000/networks/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: networkName, driver: networkDriver })
    });
    if (!response.ok) throw new Error(`Error creating network: ${response.statusText}`);
    const data = await response.json();
    alert(data.message);
    listNetworks();  // Refresh the network list
  } catch (error) {
    console.error('Error creating network:', error);
  }
}
