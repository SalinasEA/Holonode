

// Tracks clothing model loading progress and triggers a callback when all items are loaded
class LoadingTracker {
    private clothingToLoad: Set<string> = new Set();
    private clothingLoaded: Set<string> = new Set();
    private onCompleteCallback: (() => void) | null;
    private onProgressCallback: ((percentage: number) => void) | null;

    // Initializes the tracker with no callbacks
    constructor() {
        this.onCompleteCallback = null;
        this.onProgressCallback = null;
    }

    // Adds a clothing item to the set of items that need to be loaded
    register(clothing: string) {
        this.clothingToLoad.add(clothing);
    }

    // Marks a clothing item as loaded, invokes the completion callback if all items are loaded, and reports progress
    markAsLoaded(clothing: string) {
        // Marks a clothing item as loaded and invokes the callback if all items are now loaded
        this.clothingLoaded.add(clothing);
        if (this.clothingLoaded.size === this.clothingToLoad.size) {
            this.onCompleteCallback?.();
        }

        // Calculates the loading progress percentage and invokes the progress callback if one is set
        const percentage = (this.clothingLoaded.size / this.clothingToLoad.size) * 100;
        if (this.onProgressCallback) {
            this.onProgressCallback(percentage);
        }
    }

    // Sets or updates the completion callback and invokes it immediately if all items are already loaded
    onAllLoaded(callback: () => void) {
        this.onCompleteCallback = callback;
        if (this.clothingLoaded.size === this.clothingToLoad.size) {
            callback();
        }
    }

    // Sets the callback to be invoked whenever loading progress updates
    onProgress(callback: (percentage: number) => void) {
        this.onProgressCallback = callback;
    }
}

export { LoadingTracker };