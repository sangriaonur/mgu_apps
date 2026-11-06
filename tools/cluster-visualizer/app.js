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
            toggleBtn.textContent = 'Hide Front Camera Feed';
            toggleBtn.classList.add('active');
        } else {
            adasView.style.display = 'block';
            cameraView.style.display = 'none';
            toggleBtn.textContent = 'Toggle Front Camera Demo';
            toggleBtn.classList.remove('active');
        }
    });
});