// services.js

// Function to fetch services for a specific container
export async function listContainerServices(containerId) {
  try {
    const response = await fetch(`http://localhost:3000/containers/${containerId}/services`);
    if (!response.ok) {
      if (response.status === 409) {
        // Handle case when container is not running
        const data = await response.json();
        alert(data.error);  // Show an alert like "Container is not running"
        return;
      }
      throw new Error(`Error fetching services for container ${containerId}: ${response.statusText}`);
    }
    const data = await response.json();
    renderServices(data.services);
  } catch (error) {
    console.error('Error fetching container services:', error);
  }
}



// Function to render services in the UI
function renderServices(services) {
  const output = document.getElementById('services-output'); // Add a new section in HTML for services
  output.innerHTML = ''; // Clear previous services output

  if (!services || services.length === 0) {
    output.innerHTML = '<p class="text-red-500">No services found.</p>';
    return;
  }

  const serviceRows = services.map(service => `
    <div class="service-item bg-white shadow-md rounded-lg mb-4 p-4">
      <h2 class="text-lg font-bold">${service.Name}</h2>
      <p><strong>Service ID:</strong> ${service.Id}</p>
      <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4">Start</button>
      <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4">Stop</button>
    </div>
  `).join('');

  output.innerHTML = serviceRows;
}
