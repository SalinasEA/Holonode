import {restoreEquippedItems} from "../sidebar/sidebar.ts";

// Handles the selection and persistence of the user's preferred body type view

// Applies the selected body type to the avatar meshes and restores equipped items
function applyBodyType(
    bodyTypeValue: string,
    bodyTypeBothMesh: any,
    bodyType1Mesh: any,
    bodyType2Mesh: any,
    equipmentMeshes: any
) {
    // Stops if the meshes aren't loaded yet
    if (!bodyTypeBothMesh || !bodyType1Mesh || !bodyType2Mesh) {
        return;
    }

    // Shows or hides each body type mesh based on the selected body type value
    bodyTypeBothMesh.visible = bodyTypeValue === 'both';
    bodyType1Mesh.visible = bodyTypeValue === 'type1';
    bodyType2Mesh.visible = bodyTypeValue === 'type2';

    // Calls the function to restore the previously equipped items if there was a saved selection
    restoreEquippedItems(equipmentMeshes);
}

// Initializes body type option selections, handles mesh switching, and active button state toggles
function bodyTypeSelector(
    bodyTypeBothMesh: any,
    bodyType1Mesh: any,
    bodyType2Mesh: any,
    equipmentMeshes: any
) {
    // Selects all body type selection buttons from the DOM
    const bodyTypeBtn = document.querySelectorAll<HTMLButtonElement>('.body-type-btn');

    // Retrieves the previously saved body type from local storage, defaulting to both
    let savedBodyType = localStorage.getItem('savedBodyType') ?? 'both';
    let savedBodyTypeBtn = document.querySelector<HTMLButtonElement>(`button[data-value="${savedBodyType}"]`);

    // Defaults to the 'both' option if the saved button cannot be found
    if (!savedBodyTypeBtn) {
        savedBodyType = 'both';
        savedBodyTypeBtn = document.querySelector<HTMLButtonElement>(`button[data-value="both"]`);
        localStorage.setItem('savedBodyType', 'both');
    }

    // Resets the visual state by removing the active class from all buttons
    bodyTypeBtn.forEach(btn => btn.classList.remove('active'));

    // Applies the active class to the restored/default button
    savedBodyTypeBtn?.classList.add('active');

    // Shows/hides body type based on saved body type
    applyBodyType(savedBodyType, bodyTypeBothMesh, bodyType1Mesh, bodyType2Mesh, equipmentMeshes);

    // Attaches a click event listener to each body type button
    bodyTypeBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            // Creates a variable to hold the body type value
            const bodyTypeValue = btn.dataset.value;

            // Stops if the body type value is missing
            if (bodyTypeValue == null) {
                return;
            }

            // Saves the new body type selection to local storage
            localStorage.setItem('savedBodyType', bodyTypeValue);

            // Removes active class from all buttons and adds it to the clicked button
            bodyTypeBtn.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Shows/hides body type based on selected body type
            applyBodyType(bodyTypeValue, bodyTypeBothMesh, bodyType1Mesh, bodyType2Mesh, equipmentMeshes);
        })
    })
}

export { bodyTypeSelector, applyBodyType }