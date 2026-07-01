import { equipmentData, type EquipmentItem } from "../scene/equipment-data.ts";
import { hideColorPanel, showColorPanel } from "./color-panel.ts";
import { updateEquipmentSlotSelectedState } from "./sidebar.ts";

// Setups search functionality and event listeners
function setupSearch(equipmentMeshes: any): void {
    // Creates a search bar variable from the DOM, returns early if not found
    const searchBar = document.querySelector<HTMLInputElement>('.search-bar');
    if (!searchBar) return;

    // Sets debounce timer to null
    let debounceTimer: number | null = null;

    searchBar.addEventListener('input', () => {
        // Clears any existing timer
        if (debounceTimer) clearTimeout(debounceTimer);

        // Trims query string to remove leading/trailing whitespace
        const query = searchBar.value.trim();

        // If empty, clears the search results by restoring the original equipment panel
        if (query.length === 0) {
            restoreEquipmentPanel();
            return
        }

        // Sets a new timer to perform the search after 300ms
        debounceTimer = setTimeout(() => {
            performSearch(query, equipmentMeshes);
        }, 300)
    })
}

// Performs a search based on the provided query
async function performSearch(query: string, equipmentMeshes: any): Promise<void> {
// Query is lowercased to match the equipmentData object's item names
    const queryLower = query.toLowerCase();

    // Holds results for each equipment slot type
    const results: { slotType: string, items:EquipmentItem[] }[] = [];

    // For loop that iterates through the equipmentData object and filters out items that do not match the query
    for (const slotType in equipmentData) {
        // Gets the matching items for the current slot type based on the query
        const matchingItems = equipmentData[slotType].filter(item => item.name.toLowerCase().includes(queryLower));

        // If the matching items array is not empty, adds the matching items to the results array
        if (matchingItems.length > 0) {
            results.push({ slotType, items: matchingItems });
        }
    }
    showSearchResults(results, equipmentMeshes);
}

// Shows the search results panel and populates it with the provided outfits
function showSearchResults(results: { slotType: string, items: any[] }[], equipmentMeshes: any): void {
    // Gets the equipment slot div elements and the selected equipment slot panel
    const equipmentSlotFirstDiv = document.querySelector<HTMLElement>('.equipment-slot-first-half');
    const equipmentSlotSecondDiv = document.querySelector<HTMLElement>('.equipment-slot-second-half');
    const selectedEquipmentSlotPanel = document.querySelector<HTMLElement>('.selected-equipment-slot-panel');

    // If any of the elements are not found, return early
    if (!equipmentSlotFirstDiv || !equipmentSlotSecondDiv || !selectedEquipmentSlotPanel) return;

    // Sets the display of the equipment slot divs to none and the selected equipment slot panel to visible and clears the panel content
    equipmentSlotFirstDiv.style.display = 'none';
    equipmentSlotSecondDiv.style.display = 'none';
    selectedEquipmentSlotPanel.classList.add('visible');
    selectedEquipmentSlotPanel.innerHTML = '';

    // If no results are found, displays a message and returns early
    if (results.length === 0) {
        const noResults = document.createElement('p');
        noResults.textContent = 'No results found.';
        selectedEquipmentSlotPanel.appendChild(noResults);
        return;
    }

    // For loop that iterates through the equipmentData object and displays the matching outfits in the selected equipment slot panel
    results.forEach(({ slotType, items }) => {
        // Creates section header
        const equipmentTopHr = document.createElement('hr');
        const equipmentSlotText = document.createElement('p');
        const equipmentBottomHr = document.createElement('hr');
        equipmentSlotText.textContent = slotType.charAt(0).toUpperCase() + slotType.slice(1) + ' Slot';
        selectedEquipmentSlotPanel.appendChild(equipmentTopHr);
        selectedEquipmentSlotPanel.appendChild(equipmentSlotText);
        selectedEquipmentSlotPanel.appendChild(equipmentBottomHr);

        // Creates result row for each item
        items.forEach(item => {
            const searchResultBtn = document.createElement('button');
            searchResultBtn.classList.add('search-result-item');

            // Creates an image element and sets its source and alt text to the item's image and name
            const img = document.createElement('img');
            img.src = item.thumbnail;
            img.alt = item.name;

            // Creates a paragraph element and sets its text content to the item's name
            const name = document.createElement('p');
            name.textContent = item.name;

            // Appends the image and name to the search result button and appends the button to the selected equipment slot panel
            searchResultBtn.appendChild(img);
            searchResultBtn.appendChild(name);
            selectedEquipmentSlotPanel.appendChild(searchResultBtn);

            // Checks if the item is already equipped and adds the 'selected' class if it is
            if (localStorage.getItem(`equipped_${slotType}`) === item.id) {
                searchResultBtn.classList.add('selected');
            }

            // Adds a click event listener to the search result button to equip the item and update the UI
            searchResultBtn.addEventListener('click', () => {
                // Gets the saved body type from local storage or defaults to both if it does not exist
                const savedBodyType = localStorage.getItem('savedBodyType') ?? 'both';

                // Gets the currently equipped item from local storage for the current slot type, if any
                const currentlyEquipped = localStorage.getItem(`equipped_${slotType}`);

                // Assigns the appropriate mesh key based on whether the saved body type is both, type1, or type2
                const meshKey = savedBodyType === 'both'
                    ? item.meshTypeBoth
                    : savedBodyType === 'type1'
                    ? item.meshType1
                    : item.meshType2;

                // If currently equipped item is the same as the item being equipped, un-equips the item, removes
                // it from local storage, and updates the UI
                if (currentlyEquipped === item.id) {
                    if (equipmentMeshes[meshKey]) equipmentMeshes[meshKey].visible = false;
                    localStorage.removeItem(`equipped_${slotType}`);
                    searchResultBtn.classList.remove('selected');
                    updateEquipmentSlotSelectedState(slotType);
                    hideColorPanel();
                    return
                }

                // If currently equipped item is different from the item being equipped, hides the current item's mesh
                const currentItem = equipmentData[slotType].find(i => i.id === currentlyEquipped);
                if (currentItem) {
                    const currentMeshKey = savedBodyType === 'both' ? currentItem.meshTypeBoth
                        : savedBodyType === 'type1' ? currentItem.meshType1 : currentItem.meshType2;
                    if (equipmentMeshes[currentMeshKey]) equipmentMeshes[currentMeshKey].visible = false;
                }

                // If the equipment mesh for the selected mesh key exists, sets its visibility to true
                if (equipmentMeshes[meshKey]) equipmentMeshes[meshKey].visible = true;

                // Saves the equipped item ID for the current slot type to local storage
                localStorage.setItem(`equipped_${slotType}`, item.id);

                // Updates selected state, removes from all buttons first and adds to the clicked button
                selectedEquipmentSlotPanel.querySelectorAll<HTMLButtonElement>('.search-result-item-selected')
                    .forEach(btn => btn.classList.remove('selected'));
                searchResultBtn.classList.add('selected');

                // Calls the updateEquipmentSlotSelectedState function to update the selected state UI for the slot type
                updateEquipmentSlotSelectedState(slotType);

                // Calls the showColorPanel function to display the color options panel
                showColorPanel();

            })
        })
    })
}

// Restores the original equipment panel
function restoreEquipmentPanel(): void {
    // Gets the equipment slot div elements and the selected equipment slot panel
    const equipmentSlotFirstDiv = document.querySelector<HTMLElement>('.equipment-slot-first-half');
    const equipmentSlotSecondDiv = document.querySelector<HTMLElement>('.equipment-slot-second-half');
    const selectedEquipmentSlotPanel = document.querySelector<HTMLElement>('.selected-equipment-slot-panel');

    // If any of the elements are not found, return early
    if (!equipmentSlotFirstDiv || !equipmentSlotSecondDiv || !selectedEquipmentSlotPanel) return;

    // Sets the display of the equipment slot divs to flex and the selected equipment slot panel to hidden and clears the panel content
    equipmentSlotFirstDiv.style.display = 'flex';
    equipmentSlotSecondDiv.style.display = 'flex';
    selectedEquipmentSlotPanel.classList.remove('visible');
    selectedEquipmentSlotPanel.innerHTML = '';
}

export { setupSearch };