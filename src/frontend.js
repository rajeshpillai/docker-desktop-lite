// Function to list containers using Fetch API
async function fetchContainers() {
  try {
    const response = await fetch('http://localhost:3000/containers');
    
    // Check if the response is OK (status code in the range 200-299)
    if (!response.ok) {
      throw new Error(`Error fetching containers: ${response.statusText}`);
    }

    const data = await response.json();
    const containers = data.containers;

    // Display containers in the UI
    const output = document.getElementById('output');
    output.innerHTML = '';
    containers.forEach(container => {
      output.innerHTML += `<p>Container: ${container.Names[0]} (ID: ${container.Id}) - Status: ${container.Status}</p>`;
    });
  } catch (error) {
    console.error('Error fetching containers:', error);
  }
}

// Function to start a container using Fetch API
async function startContainer(id) {
  try {
    const response = await fetch(`http://localhost:3000/containers/${id}/start`, {
      method: 'POST',
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`Error starting container: ${response.statusText}`);
    }

    alert('Container started');
  } catch (error) {
    console.error('Error starting container:', error);
  }
}

// Function to stop a container using Fetch API
async function stopContainer(id) {
  try {
    const response = await fetch(`http://localhost:3000/containers/${id}/stop`, {
      method: 'POST',
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`Error stopping container: ${response.statusText}`);
    }

    alert('Container stopped');
  } catch (error) {
    console.error('Error stopping container:', error);
  }
}

// Event listeners for buttons
document.getElementById('list-containers').addEventListener('click', fetchContainers);
document.getElementById('start-container').addEventListener('click', () => {
  const id = document.getElementById('container-id').value;
  startContainer(id);
});
document.getElementById('stop-container').addEventListener('click', () => {
  const id = document.getElementById('container-id').value;
  stopContainer(id);
});

