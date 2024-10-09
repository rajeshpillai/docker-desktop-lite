import { fetchContainers, startContainer, stopContainer } from './js/containers.js';
import { listVolumes, createVolume, removeVolume } from './js/volumes.js';
import { listComposeServices, startCompose, stopCompose } from './js/compose.js';
import { viewLogs, closeLogsModal } from './js/logs.js';
import { switchSection } from './js/common.js';

// Event listeners for navigation
document.querySelector('a[href="#containers-section"]').addEventListener('click', () => switchSection('containers'));
document.querySelector('a[href="#images-section"]').addEventListener('click', () => switchSection('images'));
document.querySelector('a[href="#volumes-section"]').addEventListener('click', () => switchSection('volumes'));
document.querySelector('a[href="#networks-section"]').addEventListener('click', () => switchSection('networks'));
document.querySelector('a[href="#compose-section"]').addEventListener('click', () => switchSection('compose'));

// Event listeners for container actions
document.getElementById('list-containers').addEventListener('click', fetchContainers);

// Docker Compose actions
document.getElementById('start-compose').addEventListener('click', startCompose);
document.getElementById('stop-compose').addEventListener('click', stopCompose);

// Logs modal
document.getElementById('logs-modal').addEventListener('click', closeLogsModal);
