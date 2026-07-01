import './style.css'
import { bodyTypeSelector } from "./scene/body-type-selector.ts";
import { setupColorPanel } from "./sidebar/color-panel.ts";
import { setupLoadingProgress } from "./loading-overlay/loading-overlay.ts";
import { setupLoginModal, setupLogoutModal } from './modal/modal'
import { setupOutfitManager, setupRightSidebarToggle } from "./sidebar/right-sidebar.ts";
import { setupScene } from "./scene/scene";
import { setupSearch } from "./sidebar/search.ts";
import { setupSidebarToggle, setupEquipmentSlotListeners, restoreEquippedItems } from './sidebar/sidebar'
import { setupReportBtn } from "./sidebar/report.ts";
import { updateAuth } from './auth/auth'

// Main entry point for frontend and calls all setup functions after the DOM is ready
async function initializeApp(): Promise<void> {
    // Setups Three.js scene with the loading tracker
    const { tracker, bodyTypeMeshes, equipmentMeshes } = setupScene();

    // Setups the loading overlay with the loading tracker
    setupLoadingProgress(tracker)

    // Setups sidebar listeners
    setupSidebarToggle();
    setupRightSidebarToggle();

    // Setups login/register and logout modal
    setupLoginModal();
    setupLogoutModal();

    // Adds a fade-out to the overlay, waits until the transition is done, then removes it
    const overlay = document.querySelector('.loading-overlay') as HTMLElement
    tracker.onAllLoaded(async () => {
        // Hides the loading overlay
        overlay.classList.add('fade-out');
        overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });

        // Setups the body type selector now that the mesh is loaded
        bodyTypeSelector(
            bodyTypeMeshes.BodyTypeBoth,
            bodyTypeMeshes.BodyType1,
            bodyTypeMeshes.BodyType2,
            equipmentMeshes
        );

        // Setups equipment slot listeners
        setupEquipmentSlotListeners(equipmentMeshes);

        // Restores saved equipment
        restoreEquippedItems(equipmentMeshes);

        // Setups the color panel
        setupColorPanel(equipmentMeshes);

        // Setups the search bar
        setupSearch(equipmentMeshes);

        // Setups the outfit manager with both equipment and body type meshes
        setupOutfitManager(equipmentMeshes, bodyTypeMeshes);
    });

    // Animates sidebar and right sidebar after a short delay
    setTimeout(() => {
        document.querySelector('.sidebar')?.classList.add('animated');
        document.querySelector('.right-sidebar')?.classList.add('animated');
    }, 100)

    // Checks authentication state
    updateAuth();

    // Setups the report button
    setupReportBtn();
}

// Waits for the DOM to be fully loaded before calling the initializeApp function
window.addEventListener('load', initializeApp)