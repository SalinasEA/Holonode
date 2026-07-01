import type {LoadingTracker} from "../scene/loading-tracker.ts";

// Sets up the loading progress UI to reflect clothing model loading state

// Updates the progress ring and percentage text as clothing models finish loading
function setupLoadingProgress(tracker: LoadingTracker) {
    // Selects the progress bar and percentage text elements from the DOM
    const loadingProgressBar = document.querySelector<SVGCircleElement>('.loading-progress-bar');
    const loadingProgressText = document.querySelector('.loading-progress-text') as HTMLElement;

    // If the progress bar or text element is not found, return early
    if (!loadingProgressBar || !loadingProgressText) {
        return;
    }

    // Defines the circle's circumference to calculate the stroke offset for the progress ring
    const circumference = 314;

    // Sets up the tracker to track clothing model loading progress and updates the progress ring and percentage text
    tracker.onProgress((percentage) => {
        const offset = circumference - (circumference * percentage / 100);
        loadingProgressBar.style.strokeDashoffset = offset.toString();
        loadingProgressText.textContent = `${Math.round(percentage)}%`;
    })
}

export { setupLoadingProgress }
