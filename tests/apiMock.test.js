import { test, expect } from "@playwright/test";
import { mockPosts } from "../mocks/postsMock";

test.describe("API mocking with Playwright", () => {
  test("Mock GET /posts API", async ({ page }) => {
    //Intercept and mock API response
    await page.route(
      "https://jsonplaceholder.typicode.com/posts",
      async (route) => {
        console.log("Mocking GET request....");
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(mockPosts),
        });
      }
    );

    // Fetch data inside the browser context
    const responseData = await page.evaluate(async () => {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      const status = response.status;
      const data = await response.json();
      return { status, data };
    });

    console.log("Mocked response: ", responseData.data); //Debugging

    expect(responseData.status).toBe(200);
    expect(responseData.data.length).toBe(mockPosts.length);
    expect(responseData.data[0].title).toBe(mockPosts[0].title);
  });

  test.only("Mock POST /posts API", async ({ page }) => {
    await page.route(
      "https://jsonplaceholder.typicode.com/posts",
      async (route) => {
        if (route.request().method() === "POST") {
          console.log("Mocking POST request....");
          await route.fulfill({
            status: 201,
            contentType: "application/json",
            body: JSON.stringify({
              id: 101,
              title: "New mocked post",
              body: "This post was mocked",
              userId: 1,
            }),
          });
        } else {
          route.continue();
        }
      }
    );

    //Send the POST request inside the browser context
    const responseData = await page.evaluate(async () => {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: "Test Post",
            body: "Testing mock.",
            userId: 1,
          }),
        }
      );

      const status = response.status; //Capture status code
      const data = await response.json();
      return { status, data };
    });

    console.log("Mocked Response:", responseData); //Debugging

    //Validate status code
    expect(responseData.status).toBe(201);

    //Validate response body
    expect(responseData.data.title).toBe("New mocked post");
    expect(responseData.data.body).toBe("This post was mocked");
    expect(responseData.data.userId).toBe(1);
  });
});
