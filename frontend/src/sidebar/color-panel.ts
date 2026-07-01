import { equipmentData } from "../scene/equipment-data.ts";

// Color panel setup and event listeners

// Shows the color panel
function showColorPanel() {
    const colorPanel = document.querySelector<HTMLElement>('.color-panel');
    const sidebar = document.querySelector<HTMLElement>('.sidebar');
    if (!colorPanel || !sidebar) return;

    // Only shows if the sidebar is open
    if (!sidebar.classList.contains('open')) return;

    // Gets sidebar right edge position and makes the color panel visible
    const sidebarRect = sidebar.getBoundingClientRect();
    colorPanel.style.left = `${sidebarRect.right}px`;
    colorPanel.classList.add('visible');
}

// Hides the color panel
function hideColorPanel() {
    const colorPanel = document.querySelector<HTMLElement>('.color-panel');
    const sidebar = document.querySelector<HTMLElement>('.sidebar');

    // If either the color panel or sidebar element is not found, return early
    if (!colorPanel || !sidebar) return;
    colorPanel.classList.remove('visible');

    // If sidebar is closed, hides fully off screen, otherwise slides under it
    if (sidebar && sidebar.classList.contains('open')) {
        colorPanel.style.left = '0px';
    }
    else {
        colorPanel.style.left = '-150px';
    }
}

// Setups the color panel and event listeners for color wheel and hex input changes
function setupColorPanel(equipmentMeshes: any):void {
    // Assigns the color wheel and hex input elements to variables
    const colorWheel = document.querySelector<HTMLInputElement>('.color-wheel');
    const colorHexInput = document.querySelector<HTMLInputElement>('.color-hex-input');

    // Assigns the hex regular expression pattern to a variable, allows 3 letter shorthand as well as full 6 digit hex codes
    const colorHexPattern: RegExp = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

    // If either the color wheel or hex input element is not found, return early
    if (!colorWheel || !colorHexInput) {
        return;
    }

    // Adds an event listener to the color wheel input element to update the hex input value and apply the color to the equipped meshes
    colorWheel.addEventListener('input', () => {
        // Assigns the current color value to the hex input element
        colorHexInput.value = colorWheel.value;
        applyColorToEquippedMeshes(colorWheel.value, equipmentMeshes);
    })

    // Adds an event listener to the hex input element to validate the input value and update the color wheel value if valid and apply the color to the equipped meshes
    colorHexInput.addEventListener('input', () => {
        // Assigns the current color value to the hex input element
        let value = colorHexInput.value;
``
        // Ensures the '#' is always present at the start of the input value
        if (!value.startsWith('#')) {
            value = '#' + value.replace('#', '');
            colorHexInput.value = value;
        }

        // If the user deleted the input or it is just '#', resets to original mesh color
        if (value === '#' || value === '') {
            colorHexInput.value = '#ffffff';
            applyColorToEquippedMeshes('#ffffff', equipmentMeshes);
            return;
        }

        // Validates the input value against the hex pattern, if it is valid, apply the color to the equipped meshes
        if (colorHexPattern.test(value)) {
            // Assigns the color wheel value to the value of the hex input element
            colorWheel.value = value;
            applyColorToEquippedMeshes(value, equipmentMeshes);
        }
    })
}

// Applies the color to the equipped meshes based on the user's active body type setting
function applyColorToEquippedMeshes(colorHex: string, equipmentMeshes: any): void {
    // Assigns the user's active body type setting to a variable
    const savedBodyType = localStorage.getItem('savedBodyType') ?? 'both';

    // Loops through each equipment category defined in the global dataset
    for (const slotType in equipmentData) {
        // Assigns the saved item ID matching the current category slot to a variable, else continues
        const equippedId = localStorage.getItem(`equipped_${slotType}`);
        if (!equippedId) continue;

        // Assigns the item configuration data matching the saved ID to a variable, else continues
        const item = equipmentData[slotType].find(i => i.id === equippedId);
        if (!item) continue;

        // Assigns the mesh asset key based on the saved body type variant to a variable if there is one, else defaults to 'both'
        const meshKey = savedBodyType === 'both'
            ? item.meshTypeBoth
            : savedBodyType === 'type1'
            ? item.meshType1
            : item.meshType2;

        // Assigns the 3D asset model matching the mesh asset key to a variable, else continues
        const mesh = equipmentMeshes[meshKey]
        if (!mesh) continue;

        // After applying color to mesh, saves it
        mesh.traverse((child: any) => {
            if (child.isMesh && child.material) {
                child.material.color.set(colorHex);
            }
        })

        // Saves color per equipped item
        localStorage.setItem(`color_${slotType}_${equippedId}`, colorHex);
    }
}

export { showColorPanel, hideColorPanel, setupColorPanel, applyColorToEquippedMeshes }