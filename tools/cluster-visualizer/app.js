// SPDX-License-Identifier: MPL-2.0
'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggleDemoBtn');
    const adasView = document.getElementById('adasView');
    const cameraView = document.getElementById('cameraView');

    let isCameraActive = false;

    toggleBtn.addEventListener('click', () => {
        isCameraActive = !isCameraActive;
        if (isCameraActive) {
            adasView.style.display = 'none';
            cameraView.style.display = 'block';
            toggleBtn.textContent = 'Switch to ADAS / Map View';
            toggleBtn.style.backgroundColor = '#28a745';
        } else {
            cameraView.style.display = 'none';
            adasView.style.display = 'flex';
            toggleBtn.textContent = 'Toggle Front Camera Demo';
            toggleBtn.style.backgroundColor = '#0066b2';
        }
    });
});