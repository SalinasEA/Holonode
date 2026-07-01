// Import lucide icons for the only icons needed
import { ChevronLeft, ChevronRight, CircleUserRound, createIcons, LogOut, X } from 'lucide';
import { equipmentData } from "../scene/equipment-data.ts";
import { hideColorPanel, showColorPanel } from "./color-panel.ts";
import { delay } from "../utility/utility.ts";

// Sidebar toggle, equipment slot listeners, and icon setup

// Lucide icons are created and rendered, giving credit to game-icons.net for the icon assets
createIcons({
    icons: {
        ChevronRight,
        ChevronLeft,
        X,
        CircleUserRound,
        LogOut
    }
});

// Assigns the sidebar left toggle button to a variable
const CHEVRON_LEFT_ICON = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
         class="lucide lucide-chevron-left-icon lucide-chevron-left">
        <path d="m15 18-6-6 6-6"/>
    </svg>
`

// Assigns the sidebar right toggle button to a variable
const CHEVRON_RIGHT_ICON = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
         class="lucide lucide-chevron-right-icon lucide-chevron-right">
        <path d="m9 18 6-6-6-6"/>
    </svg>
`

// Sets up the sidebar toggle button and adds an event listener to toggle the sidebar
function setupSidebarToggle() {
    const sidebar = document.querySelector<HTMLElement>('.sidebar')
    const sidebarButton = document.querySelector<HTMLButtonElement>('.sidebar-toggle-btn')

    if (!sidebar || !sidebarButton) {
        return
    }

    sidebarButton.addEventListener('click', () => {
        const isOpen = sidebar.classList.toggle('open')
        sidebarButton.innerHTML = isOpen ? CHEVRON_LEFT_ICON : CHEVRON_RIGHT_ICON

        // If closing the sidebar, hides color panel, otherwise shows it if there is an equipped item and the item panel is visible
        if (!isOpen) {
            hideColorPanel();
        }
        else {
            const selectedEquipmentSlotPanel = document.querySelector<HTMLElement>('.selected-equipment-slot-panel')
            const isItemPanelVisible = selectedEquipmentSlotPanel?.classList.contains('visible')
            if (isItemPanelVisible) {
                const hasEquippedItem = Object.keys(equipmentData).some(
                    slotType => localStorage.getItem(`equipped_${slotType}`)
                );

                // If there is an equipped item, shows the color panel after a short delay
                if (hasEquippedItem) {
                    delay(500).then(() => showColorPanel());
                }
            }
        }
    })
}

// Updates the selected class state of the equipment slot button based on the currently equipped item
function updateEquipmentSlotSelectedState(slotType: string) {
    // Selects the button element for the specified equipment slot type
    const equipmentSlotButton = document.querySelector<HTMLButtonElement>(`.equipment-slot-panel button[data-slot="${slotType}"]`);

    // Returns early if the button element is not found
    if (!equipmentSlotButton) {
        return;
    }

    // If the equipped item is found, add the selected class to the equipped type button, otherwise remove it
    if (localStorage.getItem(`equipped_${slotType}`)) {
        equipmentSlotButton.classList.add('selected');
    } else {
        equipmentSlotButton.classList.remove('selected');
    }
}

// Sets up click listeners for equipment slot buttons and selected equipment slot panel
function setupEquipmentSlotListeners(equipmentMeshes: any) {
    const allEquipmentSlotButtons = document.querySelectorAll<HTMLButtonElement>('.equipment-slot-panel > div button')
    const equipmentSlotFirstDiv = document.querySelector<HTMLElement>('.equipment-slot-first-half')
    const equipmentSlotSecondDiv = document.querySelector<HTMLElement>('.equipment-slot-second-half')
    const selectedEquipmentSlotPanel = document.querySelector<HTMLElement>('.selected-equipment-slot-panel')

    // If it is not found, return
    if (!allEquipmentSlotButtons || !equipmentSlotFirstDiv || !equipmentSlotSecondDiv || !selectedEquipmentSlotPanel) {
        return
    }

    // Iterates through every equipment slot button to attach click event listeners
    allEquipmentSlotButtons.forEach(button => {
        // Gets the slot type from the button's data attribute
        const slotType = button.dataset.slot;

        // If the slot type is found, updates the selected class state of the button
        if (slotType) {
            updateEquipmentSlotSelectedState(slotType)
        }

        // Adds a click event listener to the button to handle selection of the equipment slot
        button.addEventListener('click', () => {
            // Extracts the source URL of the image contained inside the clicked button
            const selectedEquipmentSlotImg = button.querySelector('img')?.src

            // Retrieves the custom slot type string from the button's data attributes
            const slotType = button.dataset.slot;

            // If either the image source or slot type is missing, return early
            if (!selectedEquipmentSlotImg || !slotType) {
                return
            }

            // Hides the equipment slot divs and shows the selected equipment panel
            equipmentSlotFirstDiv.style.display = 'none'
            equipmentSlotSecondDiv.style.display = 'none'
            selectedEquipmentSlotPanel.classList.add('visible')
            selectedEquipmentSlotPanel.innerHTML = ''

            // Creates a new button element to act as the back navigation for the panel
            const selectedEquipmentBackBtn = document.createElement('button') as HTMLButtonElement;
            selectedEquipmentBackBtn.className = 'selected-equipment-back-btn';

            // Creates an image element for the back button using the selected slot's icon
            const selectedEquipmentBackBtnImg = document.createElement('img') as HTMLImageElement;
            selectedEquipmentBackBtnImg.src = selectedEquipmentSlotImg;
            selectedEquipmentBackBtnImg.alt = 'Back';

            // Appends the icon image into the back button and mounts the button onto the active panel
            selectedEquipmentBackBtn.appendChild(selectedEquipmentBackBtnImg);
            selectedEquipmentSlotPanel.appendChild(selectedEquipmentBackBtn);

            // Adds a click event listener to the back button to handle exiting the item selection view
            selectedEquipmentBackBtn.addEventListener('click', () => {
                // Hides color panel when going back
                hideColorPanel();

                // Applies the sliding or fading hide animation class to the active selection panel
                selectedEquipmentSlotPanel.classList.add('hiding')

                // Listens for the exit animation to finish before restoring the original interface layout
                selectedEquipmentSlotPanel.addEventListener('animationend', () => {
                    selectedEquipmentSlotPanel.classList.remove('visible')
                    selectedEquipmentSlotPanel.classList.remove('hiding')
                    selectedEquipmentSlotPanel.innerHTML = ''
                    equipmentSlotFirstDiv.style.display = 'flex'
                    equipmentSlotSecondDiv.style.display = 'flex'
                } , { once: true })
            })

            // Runs the panel population routine
            populateEquipmentPanel(slotType, equipmentMeshes);

            // Shows color panel if something is already equipped in the slot
            if (localStorage.getItem(`equipped_${slotType}`)) {
                showColorPanel();
            }
        })
    })
}

// Restores the visibility of previously saved equipment pieces when the application loads
function restoreEquippedItems(equipmentMeshes: any) {
    // Resets the initial state by iterating through all 3D meshes and hiding them
    for (const key in equipmentMeshes) {
        if (equipmentMeshes[key]) {
            equipmentMeshes[key].visible = false;
        }
    }

    // Retrieves the user's active body type setting from local storage
    const savedBodyType = localStorage.getItem('savedBodyType') ?? 'both';

    // Loops through each equipment category defined in the global dataset
    for (const slotType in equipmentData) {
        // Checks local storage for a saved item ID matching the current category slot
        const equippedId = localStorage.getItem(`equipped_${slotType}`);

        // Skips to the next category if no item was recorded as equipped for this slot
        if (!equippedId) {
            continue;
        }

        // Searches the dataset array to locate the item configuration matching the saved ID
        const item = equipmentData[slotType].find(i => i.id === equippedId);

        // Skips processing if the item configuration data cannot be found in the registry
        if (!item) {
            continue;
        }

        // Computes the appropriate mesh object property key based on the saved body type variant
        const meshKey = savedBodyType === 'both' ? item.meshTypeBoth : savedBodyType === 'type1' ? item.meshType1 : item.meshType2;

        // Makes the specific matching 3D asset model visible on the character stance if it exists
        if (equipmentMeshes[meshKey]) {
            equipmentMeshes[meshKey].visible = true;
        }

        // If the color of the item is saved, assign it otherwise set it to the original value which is white
        const savedColor = localStorage.getItem(`color_${slotType}_${equippedId}`) ?? '#ffffff';

        // If the color of the item is saved, apply the color to the mesh
        if (savedColor) {
            equipmentMeshes[meshKey].traverse((child: any) => {
                if (child.isMesh && child.material) {
                    child.material.color.set(savedColor);
                }
            })

            // Applies the color to the color wheel and hex input
            const colorWheel = document.querySelector<HTMLInputElement>('.color-wheel');
            const colorHexInput = document.querySelector<HTMLInputElement>('.color-hex-input');
            if (colorWheel) colorWheel.value = savedColor;
            if (colorHexInput) colorHexInput.value = savedColor;
        }
    }
}

// Populates the selected equipment panel with items matching the active equipment slot type
function populateEquipmentPanel(
    slotType: string,
    equipmentMeshes: any
) {
    // Selects the target equipment panel and retrieves the item list for this specific slot
    const selectedEquipmentSlotPanel = document.querySelector<HTMLElement>('.selected-equipment-slot-panel')
    const items = equipmentData[slotType]

    // Returns early if the panel element or the items data collection does not exist
    if (!selectedEquipmentSlotPanel || !items) {
        return
    }

    // Displays a fallback message if the item array is completely empty
    if (!items || items.length === 0) {
        const noItemsMessage = document.createElement('p');
        noItemsMessage.textContent = 'No items available';
        selectedEquipmentSlotPanel.appendChild(noItemsMessage);
        return
    }

    // Loops through each item in the data set to build and append its UI elements
    items.forEach(item => {
        const button: HTMLButtonElement = document.createElement('button');

        // Adds the styling class for the equipment option button
        button.classList.add('equipment-item-btn');

        // Stores the unique item identifier as a dataset property on the button
        button.dataset.id = item.id;

        // If the item is already equipped, adds a selected class to the button to highlight it
        if (localStorage.getItem(`equipped_${slotType}`) === item.id) {
            button.classList.add('selected');
        }

        // Creates the thumbnail image element using the item asset path and name
        const equipmentItemImg: HTMLImageElement = document.createElement('img');
        equipmentItemImg.src = item.thumbnail;
        equipmentItemImg.alt = item.name;

        // Creates a paragraph element to display the user-friendly item name
        const equipmentItemName: HTMLParagraphElement = document.createElement('p');
        equipmentItemName.textContent = item.name;

        // Assembles the button structure and injects it directly into the side panel
        button.appendChild(equipmentItemImg);
        button.appendChild(equipmentItemName);
        selectedEquipmentSlotPanel.appendChild(button);

        // Adds a click event listener to handle equipping the asset when selected
        button.addEventListener("click", () => {
            // Gets the saved body type from local storage, defaulting to 'both' if not found
            const savedBodyType = localStorage.getItem('savedBodyType') ?? 'both';

            // Gets the currently equipped item for the selected slot type, if any
            const currentlyEquipped = localStorage.getItem(`equipped_${slotType}`);

            // Initializes a variable to hold the chosen mesh asset key
            let meshKey = null;

            // Evaluates the current body type to select the corresponding item mesh property
            if (savedBodyType === 'both') {
                meshKey = item.meshTypeBoth
            }
            else if (savedBodyType === 'type1') {
                meshKey = item.meshType1
            }
            else {
                meshKey = item.meshType2
            }

            // If the currently equipped item matches the selected item, un-equip it and remove it from local storage, then return early
            if (currentlyEquipped === item.id) {
                // If the mesh asset exists, hides it
                if (equipmentMeshes[meshKey]) {
                    equipmentMeshes[meshKey].visible = false;
                }

                // Removes the item and selected button class from local storage, updates the equipment slot selected state, then returns early
                localStorage.removeItem(`equipped_${slotType}`);
                button.classList.remove('selected');
                updateEquipmentSlotSelectedState(slotType);

                // Hides the color panel
                hideColorPanel();

                return;
            }

            // Initializes a variable to hold the currently equipped item data, if any
            const currentlyEquippedItem = items.find(existingItem => existingItem.id === currentlyEquipped);

            // If a currently equipped item exists, hides its mesh asset so the newly selected item can be displayed properly
            if (currentlyEquippedItem) {
                let currentlyEquippedMeshKey = null;

                // Uses the saved body type to select the correct mesh key for the currently equipped item
                if (savedBodyType === 'both') {
                    currentlyEquippedMeshKey = currentlyEquippedItem.meshTypeBoth
                }
                else if (savedBodyType === 'type1') {
                    currentlyEquippedMeshKey = currentlyEquippedItem.meshType1
                }
                else {
                    currentlyEquippedMeshKey = currentlyEquippedItem.meshType2
                }

                // If the currently equipped mesh asset exists, hides it
                if (equipmentMeshes[currentlyEquippedMeshKey]) {
                    equipmentMeshes[currentlyEquippedMeshKey].visible = false;
                }
            }

            // Sets the visibility of the newly selected mesh asset to true if it exists
            if (equipmentMeshes[meshKey]) {
                equipmentMeshes[meshKey].visible = true;
            }

            // Saves the newly selected item ID to local storage to persist the user's choice and allows scalability for all items
            localStorage.setItem(`equipped_${slotType}`, item.id);

            // Calls the color panel setup function to show the color wheel and hex input
            showColorPanel();

            // Updates the selected class state of the equipment slot button to reflect the newly equipped item
            updateEquipmentSlotSelectedState(slotType);

            // Removes the selected class from all other buttons in the panel
            selectedEquipmentSlotPanel
                .querySelectorAll<HTMLButtonElement>('.equipment-item-btn.selected')
                .forEach(btn => btn.classList.remove('selected'));

            // Adds the selected class to the recently clicked button to highlight it
            button.classList.add('selected');
        })
    })
}

export { setupSidebarToggle, setupEquipmentSlotListeners, restoreEquippedItems, populateEquipmentPanel, updateEquipmentSlotSelectedState}