// Import the necessary functions from the refactored files
import { listImages, pullImage, removeImage } from './js/images.js';
import { listNetworks, createNetwork, removeNetwork } from './js/networks.js';
import { listVolumes, createVolume, removeVolume, pruneVolumes } from './js/volumes.js';
import { fetchContainers, startContainer, stopContainer } from './js/containers.js';
import { viewStats, closeStatsModal } from './js/stats.js';
import { listComposeServices, startCompose, stopCompose, selectProjectDirectory } from './js/compose.js';
import { listContainerServices } from './js/services.js';  // Corrected import for service listing



// Attach event listeners for container actions
document.getElementById('list-containers').addEventListener('click', fetchContainers);

// Attach event listeners for the Images section
document.getElementById('list-images').addEventListener('click', listImages);
document.getElementById('pull-image').addEventListener('click', pullImage);

// Attach event listeners for the Networks section
document.getElementById('list-networks').addEventListener('click', listNetworks);
document.getElementById('create-network').addEventListener('click', createNetwork);

// Attach event listeners for the Volumes section
document.getElementById('list-volumes').addEventListener('click', listVolumes);
document.getElementById('create-volume').addEventListener('click', createVolume);
document.getElementById('prune-volumes').addEventListener('click', pruneVolumes);

// Attach event listeners for Docker Compose
document.getElementById('start-compose').addEventListener('click', startCompose);
document.getElementById('stop-compose').addEventListener('click', stopCompose);
document.getElementById('project-dir').addEventListener('input', selectProjectDirectory);

// Event listener for viewing stats
document.getElementById('stats-modal').addEventListener('click', closeStatsModal);

// Function to switch between Containers, Images, Networks, Volumes, and Compose sections
// frontend.js

// frontend.js

// frontend.js

// frontend.js

function switchSection(section) {
  // Get references to all sections
  const sections = {
    containers: document.getElementById('containers-section'),
    images: document.getElementById('images-section'),
    volumes: document.getElementById('volumes-section'),
    networks: document.getElementById('networks-section'),
    compose: document.getElementById('compose-section')
  };

  // Hide all sections
  Object.keys(sections).forEach(key => {
    sections[key].style.display = 'none';  // Hide each section
  });

  // Show the selected section without clearing the content
  if (sections[section]) {
    sections[section].style.display = 'block';  // Show the active section
  }
}



// Attach event listeners to sidebar navigation links
document.querySelector('a[href="#containers-section"]').addEventListener('click', (e) => {
  e.preventDefault();
  switchSection('containers');
});

document.querySelector('a[href="#images-section"]').addEventListener('click', (e) => {
  e.preventDefault();
  switchSection('images');
});

document.querySelector('a[href="#volumes-section"]').addEventListener('click', (e) => {
  e.preventDefault();
  switchSection('volumes');
});

document.querySelector('a[href="#networks-section"]').addEventListener('click', (e) => {
  e.preventDefault();
  switchSection('networks');
});

document.querySelector('a[href="#compose-section"]').addEventListener('click', (e) => {
  e.preventDefault();
  switchSection('compose');
});
