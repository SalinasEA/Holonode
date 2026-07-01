import { getUserIdFromToken } from "../utility/utility.ts";

// Initializes outfit report function and export modules for external use

// Setsup the report button and adds an event listener to generate a report when clicked
function setupReportBtn(): void {
    const reportBtn = document.querySelector<HTMLButtonElement>('.outfit-report-btn');

    // API URL from the environment variables
    const API_URL = import.meta.env.VITE_API_URL;

    // If the report button element is not found in the DOM, returns early
    if (!reportBtn) return;

    // Adds a click event listener to the report button to asynchronously fetch data and trigger the report download
    reportBtn.addEventListener('click', async () => {
        // Gets the user ID from the token utility and returns early if it is not valid or found
        const userId = getUserIdFromToken();
        if (!userId) return;

        // Gets the authentication token from local storage
        const token = localStorage.getItem('authToken');

        // Try catch block to handle the network request for fetching the user's outfit report data from the server
        try {
            // Sends a GET request to the server report endpoint using the user ID and authorization bearer token
            const response = await fetch(`${API_URL}/api/outfits/user/${userId}/report`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            // If the server response status is not successful, returns early from the event listener
            if (!response.ok) return;

            // Awaits the JSON data parsed from the server response containing the full report information
            const reportData = await response.json();

            // Calls the generateReportHtml function to transform the raw report JSON data into a structured HTML template string
            const htmlContent = generateReportHtml(reportData);

            // Calls the downloadHtmlFile function to prompt the browser to download the generated HTML content as a local file
            downloadHtmlFile(htmlContent, `outfit-report-${reportData.username}.html`);
        }
        catch (error) {
            console.error('Error generating report:', error);
        }
    })
}

// Generates an HTML document string populated with the provided user outfit report details and formatted table rows
function generateReportHtml(reportData: any): string {
    // Maps over the outfit collection array to dynamically construct data rows containing every equipment slot property
    const rows = reportData.outfits.map((outfit: any) => `
        <tr>
            <td>${outfit.outfitName}</td>
            <td>${outfit.bodyType}</td>
            <td>${outfit.helmet}</td>
            <td>${outfit.neck}</td>
            <td>${outfit.chest}</td>
            <td>${outfit.belt}</td>
            <td>${outfit.pelvis}</td>
            <td>${outfit.robe}</td>
            <td>${outfit.cloak}</td>
            <td>${outfit.leftShoulder}</td>
            <td>${outfit.rightShoulder}</td>
            <td>${outfit.leftBicep}</td>
            <td>${outfit.rightBicep}</td>
            <td>${outfit.leftForearm}</td>
            <td>${outfit.rightForearm}</td>
            <td>${outfit.leftHand}</td>
            <td>${outfit.rightHand}</td>
            <td>${outfit.leftThigh}</td>
            <td>${outfit.rightThigh}</td>
            <td>${outfit.leftShin}</td>
            <td>${outfit.rightShin}</td>
            <td>${outfit.leftFoot}</td>
            <td>${outfit.rightFoot}</td>
        </tr>
    `).join("")

    // Returns a complete HTML string structure including internal styles, user metadata, and the populated data rows
    return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>${reportData.title}</title>
                <style>
                    body { font-family: sans-serif; padding: 20px; }
                    h1 { color: #333; }
                    p { color: #666; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th { background: #333; color: white; padding: 10px; text-align: left; }
                    td { padding: 8px 10px; border-bottom: 1px solid #ddd; }
                    tr:nth-child(even) { background: #f5f5f5; }
                </style>
                </meta>
            </head>
            <body>
                <h1>${reportData.title}</h1>
                <p>Generated: ${new Date(reportData.creationTimestamp).toLocaleString()}</p>
                <p>User: ${reportData.username}</p>
                <table>
                    <thead>
                        <tr>
                            <th>Outfit Name</th>
                            <th>Body Type</th>
                            <th>Helmet</th>
                            <th>Neck</th>
                            <th>Chest</th>
                            <th>Belt</th>
                            <th>Pelvis</th>
                            <th>Robe</th>
                            <th>Cloak</th>
                            <th>Left Shoulder</th>
                            <th>Right Shoulder</th>
                            <th>Left Bicep</th>
                            <th>Right Bicep</th>
                            <th>Left Forearm</th>
                            <th>Right Forearm</th>
                            <th>Left Hand</th>
                            <th>Right Hand</th>
                            <th>Left Thigh</th>
                            <th>Right Thigh</th>
                            <th>Left Shin</th>
                            <th>Right Shin</th>
                            <th>Left Foot</th>
                            <th>Right Foot</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            </body>
        </html>
    `
}

// Creates a temporary anchor link element to download a raw string value as an HTML file in the user's browser
function downloadHtmlFile(htmlContent: string, fileName: string): void {
    // Converts the HTML content string into a raw text data Blob object explicitly typed as text/html
    const blob = new Blob([htmlContent], { type: 'text/html' });

    // Instantiates an anchor element object and assigns its hyperlink source to an object URL pointing to the text blob
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;

    // Temporarily mounts the anchor button to the document body, triggers its internal click mechanism, and instantly cleans it up
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revokes the object URL string to safely free allocated system memory pointers
    URL.revokeObjectURL(link.href);
}

export { setupReportBtn };