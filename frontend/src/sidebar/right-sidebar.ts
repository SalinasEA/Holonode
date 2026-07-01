import { getUserIdFromToken } from "../utility/utility.ts";
import { restoreEquippedItems, updateEquipmentSlotSelectedState } from "./sidebar.ts";
import { equipmentData } from "../scene/equipment-data.ts";
import { applyBodyType } from "../scene/body-type-selector.ts";

// Right sidebar toggle, equipment slot listeners, and icon setup

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

// Handles 401 responses by clearing the auth token and selected outfit ID from local storage and updates the right sidebar
function handleUnauthorized(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('selectedOutfitId');
    updateRightSidebarAuth();
}

// Setups the outfit manager buttons and adds event listeners to save and load outfits
async function setupOutfitManager(equipmentMeshes: any, bodyTypeMeshes: any) {
    const saveBtn = document.querySelector<HTMLButtonElement>('.outfit-save-btn');
    const deleteBtn = document.querySelector<HTMLButtonElement>('.outfit-delete-btn');
    const loadBtn = document.querySelector<HTMLButtonElement>('.outfit-load-btn');
    const outfitNameInput = document.querySelector<HTMLInputElement>('.outfit-name');

    // API URL from the environment variables
    const API_URL = import.meta.env.VITE_API_URL;

    // If the buttons or input are not found, return
    if (!saveBtn || !deleteBtn || !loadBtn || !outfitNameInput) {
        return;
    }

    // Adds an event listener to the save button to save the outfit
    saveBtn.addEventListener('click', () => {
        saveOutfit(outfitNameInput.value.trim());
    })

    // Adds a click event listener to the delete button to remove the selected outfit configuration from the server
    deleteBtn.addEventListener('click', async () => {
        const selectedOutfitId = localStorage.getItem('selectedOutfitId');

        // If there is no selected outfit, or it is "none", returns early from the event listener
        if (!selectedOutfitId || selectedOutfitId === 'none') return;

        // If the user cancels the confirmation dialog prompt, cancels the deletion and returns early
        if (!confirm('Delete this outfit?')) return;

        // Gets the authentication token from local storage and returns early if it is not found
        const token = localStorage.getItem('authToken');
        if (!token) return;

        // Try catch block to handle the network request for sending the delete command to the server
        try {
            const response = await fetch(`${API_URL}/api/outfits/${selectedOutfitId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            // If the server response is unauthorized, handles the unauthorized response and returns early
            if (response.status === 401) {
                handleUnauthorized();
                return;
            }

            // If the server response confirms a successful deletion, removes the selected outfit ID from local storage and refreshes the user outfits list
            if (response.ok) {
                localStorage.removeItem('selectedOutfitId');

                // Resets the dropdown button text
                const dropdownBtn = document.querySelector<HTMLButtonElement>('.outfit-dropdown-btn');
                if (dropdownBtn) dropdownBtn.textContent = 'None';

                // Clears the outfit name input
                const outfitNameInput = document.querySelector<HTMLInputElement>('.outfit-name');
                if (outfitNameInput) outfitNameInput.value = '';

                await loadUserOutfits();
            }
        }
        catch (error) {
            console.error('Error deleting outfit:', error);
        }
    })

    // Adds an event listener to the load button to load the outfit
    loadBtn.addEventListener('click', () => {
        const selectedOutfitId = localStorage.getItem('selectedOutfitId');

        // If there is no selected outfit or it is "none", return
        if (!selectedOutfitId || selectedOutfitId === 'none') return;

        // Loads the outfit with the selected ID and body type meshes
        loadOutfit(selectedOutfitId, equipmentMeshes, bodyTypeMeshes);
    })
}

// Saves or updates the current outfit configuration to the server asynchronously using the provided outfit name
async function saveOutfit(outfitName: string): Promise<void> {
    // API URL from the environment variables
    const API_URL = import.meta.env.VITE_API_URL;

    // If the outfit name is empty or falsy, displays an alert message and returns early
    if (!outfitName) {
        alert('Please enter a name for the outfit.');
        return;
    }

    // Gets the authentication token from local storage and returns early if it is not found
    const token = localStorage.getItem('authToken');
    if (!token) return;

    // Gets the saved body type from local storage or defaults to both if it does not exist
    const savedBodyType = localStorage.getItem('savedBodyType') ?? 'both';

    // Gets the currently selected outfit ID from local storage to determine if this is an update or a new save
    const selectedOutfitId = localStorage.getItem('selectedOutfitId');

    // Determines whether to update an existing outfit or create a new one
    const isUpdating = selectedOutfitId && selectedOutfitId !== 'none';

    // Creates an outfit data object populated with the outfit name, body type, and all equipped slot item IDs retrieved from local storage
    const outfitData = {
        outfitName: outfitName,
        outfitDescription: '',
        bodyType: savedBodyType,
        helmet: localStorage.getItem('equipped_helmet'),
        neck: localStorage.getItem('equipped_neck'),
        chest: localStorage.getItem('equipped_chest'),
        belt: localStorage.getItem('equipped_belt'),
        pelvis: localStorage.getItem('equipped_pelvis'),
        robe: localStorage.getItem('equipped_robe'),
        cloak: localStorage.getItem('equipped_cloak'),
        leftShoulder: localStorage.getItem('equipped_leftShoulder'),
        rightShoulder: localStorage.getItem('equipped_rightShoulder'),
        leftBicep: localStorage.getItem('equipped_leftBicep'),
        rightBicep: localStorage.getItem('equipped_rightBicep'),
        leftForearm: localStorage.getItem('equipped_leftForearm'),
        rightForearm: localStorage.getItem('equipped_rightForearm'),
        leftHand: localStorage.getItem('equipped_leftHand'),
        rightHand: localStorage.getItem('equipped_rightHand'),
        leftThigh: localStorage.getItem('equipped_leftThigh'),
        rightThigh: localStorage.getItem('equipped_rightThigh'),
        leftShin: localStorage.getItem('equipped_leftShin'),
        rightShin: localStorage.getItem('equipped_rightShin'),
        leftFoot: localStorage.getItem('equipped_leftFoot'),
        rightFoot: localStorage.getItem('equipped_rightFoot'),
    }

    // Sets the URL and method based on whether this is an update or a new save
    const url = isUpdating
        ? `${API_URL}/api/arelith/outfits/${selectedOutfitId}`
        : `${API_URL}/api/arelith/outfits`;
    const method = isUpdating ? 'PUT' : 'POST';

    // Try catch block to handle the network request for sending the outfit data object to the server
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(outfitData)
        });

        // If the server response is unauthorized, handles the unauthorized response and returns early
        if (response.status === 401) {
            handleUnauthorized();
            return;
        }

        // If the server response is successful, refreshes the user outfits list and displays a success alert message
        if (response.ok) {
            const savedOutfit = await response.json();

            // Only updates the selected outfit ID in local storage if this is a new save
            if (!isUpdating) {
                localStorage.setItem('selectedOutfitId', String(savedOutfit.id));
            }

            // Reloads the dropdown and displays a success alert message
            await loadUserOutfits();
            alert(isUpdating
                ? `Outfit "${outfitName}" updated successfully!`
                : `Outfit "${outfitName}" saved successfully!`
            );
        }
    }
    catch (error) {
        console.error('Error saving outfit:', error);
    }
}

// Loads a specific outfit configuration from the server asynchronously using the outfit ID and updates the equipment meshes
async function loadOutfit(outfitId: string, equipmentMeshes: any, bodyTypeMeshes: any): Promise<void> {
    const token = localStorage.getItem('authToken');

    // API URL from the environment variables
    const API_URL = import.meta.env.VITE_API_URL;

    if (!token) return;

    // Try catch block to handle the network request for fetching the specific outfit details from the server
    try {
        const response = await fetch(`${API_URL}/api/outfits/${outfitId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        // If the server response is unauthorized, handles the unauthorized response and returns early
        if (response.status === 401) {
            handleUnauthorized();
            return;
        }

        // If the response is not successful, returns early from the function
        if (!response.ok) return;

        // Awaits the JSON data parsed from the server response containing the outfit data
        const outfit = await response.json();

        // For in loop that iterates through the equipment data object and removes all existing equipped items from local storage
        for (const slotType in equipmentData) {
            localStorage.removeItem(`equipped_${slotType}`);
        }

        // Defines an array of string values representing all available equipment slot types
        const slots = ['helmet', 'neck', 'chest', 'belt', 'pelvis', 'robe', 'cloak',
            'leftShoulder', 'rightShoulder', 'leftBicep', 'rightBicep',
            'leftForearm', 'rightForearm', 'leftHand', 'rightHand',
            'leftThigh', 'rightThigh', 'leftShin', 'rightShin',
            'leftFoot', 'rightFoot']

        // Iterates over each slot type string and saves the item ID to local storage if it exists within the outfit object
        slots.forEach(slot => {
            if (outfit[slot]) {
                localStorage.setItem(`equipped_${slot}`, outfit[slot]);
            }
        })

        // If the outfit contains a valid body type property, saves it to local storage and updates the UI
        if (outfit.bodyType) {
            localStorage.setItem('savedBodyType', outfit.bodyType);

            // Updates the body type selector button UI to reflect the loaded outfit's body type
            const bodyTypeBtns = document.querySelectorAll<HTMLButtonElement>('.body-type-btn');
            bodyTypeBtns.forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.value === outfit.bodyType) {
                    btn.classList.add('active');
                }
            });

            // Applies the body type meshes and restores equipped items via applyBodyType
            applyBodyType(
                outfit.bodyType,
                bodyTypeMeshes.BodyTypeBoth,
                bodyTypeMeshes.BodyType1,
                bodyTypeMeshes.BodyType2,
                equipmentMeshes
            );
        } else {
            // If no body type is found in the outfit, just restores the equipped items
            restoreEquippedItems(equipmentMeshes);
        }

        // Updates all equipment slot selected states
        for (const slotType in equipmentData) {
            updateEquipmentSlotSelectedState(slotType);
        }

        // Gets the selected equipment slot panel element and checks if it contains the visible class
        const selectedPanel = document.querySelector<HTMLElement>('.selected-equipment-slot-panel');
        const isVisible = selectedPanel?.classList.contains('visible');

        // If the selected equipment slot panel is visible, finds the back button and its child image element
        if (isVisible) {
            const backBtn = document.querySelector<HTMLButtonElement>('.selected-equipment-back-btn');
            const backBtnImg = backBtn?.querySelector<HTMLImageElement>('img');

            // If the back button image element is found, iterates through all equipment slot buttons to find and click the one with a matching image source
            if (backBtnImg) {
                const slotButtons = document.querySelectorAll<HTMLButtonElement>('.equipment-slot-panel > div button');
                slotButtons.forEach(btn => {
                    const btnImg = btn.querySelector<HTMLImageElement>('img');
                    if (btnImg?.src === backBtnImg.src) {
                        btn.click();
                    }
                });
            }
        }
    }
    catch (error) {
        console.error('Error loading outfit:', error);
    }
}

// Setsup the right sidebar toggle button and adds an event listener to toggle the sidebar
function setupRightSidebarToggle() {
    const rightSidebar = document.querySelector<HTMLElement>('.right-sidebar')
    const rightSidebarToggleBtn = document.querySelector<HTMLButtonElement>('.right-sidebar-toggle-btn')

    // If it is not found, return
    if (!rightSidebar || !rightSidebarToggleBtn) {
        return
    }

    // Adds a click event listener to the button to handle sidebar toggle and icons
    rightSidebarToggleBtn.addEventListener('click', () => {
        const isOpen = rightSidebar.classList.toggle('open')
        rightSidebarToggleBtn.innerHTML = isOpen ? CHEVRON_RIGHT_ICON : CHEVRON_LEFT_ICON
    })
}

// Updates the right sidebar based on auth state. Also shows outfit manager if logged in, login message if not
function updateRightSidebarAuth(): void {
    const loginMessage = document.querySelector<HTMLElement>('.right-sidebar-login-message');
    const outfitManager = document.querySelector<HTMLElement>('.outfit-manager');
    const token = localStorage.getItem('authToken');

    // If not found, return
    if (!loginMessage || !outfitManager) return;

    // If token exists, login message is hidden and outfit manager is shown, otherwise it is shown. If token does not exist, login message is shown, otherwise it is hidden
    // and loads the user outfits as well as sets up the dropdown toggle
    if (token) {
        loginMessage.style.display = 'none';
        outfitManager.classList.add('visible');
        loadUserOutfits();
        setupDropdownToggle();
    } else {
        loginMessage.style.display = 'block';
        outfitManager.classList.remove('visible');
    }
}

// Loads all outfits for the current user into the dropdown
async function loadUserOutfits(): Promise<void> {
    const userId = getUserIdFromToken();

    // API URL from the environment variables
    const API_URL = import.meta.env.VITE_API_URL;

    // If user is not logged in, return
    if (!userId) return;

    // Gets the auth token from local storage
    const token = localStorage.getItem('authToken');

    // Tries to fetch outfits for the user and populates the dropdown for the outfits
    try {
        const response = await fetch(`${API_URL}/api/outfits/user/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        // If the server response is unauthorized, handles the unauthorized response and returns early
        if (response.status === 401) {
            handleUnauthorized();
            return;
        }

        // If the response is not ok, return
        if (!response.ok) return

        // POJO for the outfits, then populates the dropdown
        const outfits = await response.json();
        populateOutfitDropdown(outfits);
    }
    catch (error) {
        console.error('Error loading user outfits:', error);
    }
}

// Populates the outfit dropdown with outfit items
function populateOutfitDropdown(outfits: any[]): void {
    const dropdownList = document.querySelector<HTMLElement>('.outfit-dropdown-list');
    const dropdownBtn = document.querySelector<HTMLButtonElement>('.outfit-dropdown-btn');

    // If the dropdown list or button are not found, return
    if (!dropdownList || !dropdownBtn) return;

    // Clears existing items in the dropdown
    dropdownList.innerHTML = '';

    // Adds the "None" item to the dropdown
    const noneItem = document.createElement('div');
    noneItem.classList.add('outfit-dropdown-item');
    noneItem.textContent = 'None';
    noneItem.dataset.id = 'none';
    dropdownList.appendChild(noneItem);

    // Adds each outfit item to the dropdown
    outfits.forEach(outfit => {
        const item = document.createElement('div');
        item.classList.add('outfit-dropdown-item');
        item.textContent = outfit.outfitName;
        item.dataset.id = String(outfit.id);
        dropdownList.appendChild(item);
    });

    // Restores the last selected outfit
    const lastOutfitId = localStorage.getItem('selectedOutfitId');

    // If last selected outfit exists, selects it in the dropdown
    if (lastOutfitId) {
        const savedItem = dropdownList.querySelector<HTMLElement>(`[data-id="${lastOutfitId}"]`);

        // If the item exists, selects it and updates the button text
        if (savedItem) {
            savedItem.classList.add('selected');
            dropdownBtn.textContent = savedItem.textContent;
        }
    }

    // Setups the dropdown and items
    setupDropdownItems();
}

// Toggles the dropdown list visibility
function setupDropdownToggle(): void {
    const dropdownBtn = document.querySelector<HTMLButtonElement>('.outfit-dropdown-btn');
    const dropdownList = document.querySelector<HTMLElement>('.outfit-dropdown-list');

    // If the dropdown button or list are not found, return
    if (!dropdownBtn || !dropdownList) return;

    // Toggles on the dropdown list visibility on button click
    dropdownBtn.addEventListener('click', () => {
        dropdownList.classList.toggle('visible');
    });

    // Closes the dropdown list when clicking outside of it
    document.addEventListener('click', (e) => {
        if (!dropdownBtn.contains(e.target as Node) && !dropdownList.contains(e.target as Node)) {
            dropdownList.classList.remove('visible');
        }
    });
}

// Handles clicking an item in the dropdown
function setupDropdownItems(): void {
    const dropdownList = document.querySelector<HTMLElement>('.outfit-dropdown-list');
    const dropdownBtn = document.querySelector<HTMLButtonElement>('.outfit-dropdown-btn');

    // If the dropdown list or button are not found, return
    if (!dropdownList || !dropdownBtn) return;

    dropdownList.querySelectorAll<HTMLElement>('.outfit-dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
            // Updates the selected item in the dropdown and button text
            dropdownList.querySelectorAll<HTMLElement>('.outfit-dropdown-item').forEach(i => i.classList.remove('selected'));
            item.classList.add('selected');

            // Sets the text content of the button to the selected item's text content
            dropdownBtn.textContent = item.textContent;

            // Sets the selected outfit ID in local storage, otherwise sets it to "none"
            localStorage.setItem('selectedOutfitId', item.dataset.id ?? '');

            // Updates the outfit name input to the selected outfit name for easy updating
            // and only updates if the selected item is not "None"
            const outfitNameInput = document.querySelector<HTMLInputElement>('.outfit-name');
            if (outfitNameInput) {
                outfitNameInput.value = item.dataset.id !== 'none' ? item.textContent ?? '' : '';
            }

            // Removes the dropdown list visibility
            dropdownList.classList.remove('visible');
        })
    })
}

export { loadUserOutfits, setupOutfitManager, setupRightSidebarToggle, updateRightSidebarAuth };
