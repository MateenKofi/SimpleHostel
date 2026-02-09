import axios from "axios";

/**
 * Script to test the Admin Maintenance Flow endpoints.
 * Run this while the server is active.
 */

const BASE_URL = "http://localhost:3000/api/v1/admin/maintenance";
const TOKEN = "YOUR_ADMIN_TOKEN_HERE"; // Simulate an admin token

const axiosClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json"
    }
});

async function runTests() {
    console.log("Starting Admin Maintenance Flow Tests...");

    try {
        // 1. Test Fetch All Requests
        console.log("\nTesting: GET /");
        const fetchAllResponse = await axiosClient.get("/");
        console.log("Response:", fetchAllResponse.data.message);

        // 2. Test Get Stats
        console.log("\nTesting: GET /stats");
        const statsResponse = await axiosClient.get("/stats");
        console.log("Stats Data:", statsResponse.data.data);

        // 3. Test Update Request (Status/Priority)
        const testRequestId = "test-uuid-123";
        console.log(`\nTesting: PATCH /:${testRequestId}`);
        const updateResponse = await axiosClient.patch(`/${testRequestId}`, {
            status: "in_progress",
            priority: "high"
        });
        console.log("Update Response:", updateResponse.data.message);
        console.log("Updated Data:", updateResponse.data.data);

        console.log("\nAll tests completed successfully!");
    } catch (error: unknown) {
        console.error("\nTest failed!");
        if (error instanceof Error) {
            if ("response" in error) {
                const err = error as { response?: { status: number; data: unknown } };
                console.error(`Status: ${err.response?.status}`);
                console.error("Data:", err.response?.data);
            } else {
                console.error("Error:", error.message);
            }
        } else {
            console.error("Unknown error occurred");
        }
    }
}

// Note: In a real environment, you would run this.
// For now, we simulate the structure.
// runTests();

console.log("Verification script created. To run: npx ts-node scripts/test-admin-maintenance.ts");
