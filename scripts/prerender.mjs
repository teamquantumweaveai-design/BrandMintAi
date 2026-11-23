
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const BASE_URL = "http://127.0.0.1:4178";

const ROUTES = [
  "/",
  "/about",
  "/solutions",
  "/business-growth",
  "/ventures",
  "/quantum-weave",
  "/academy",
  "/blog",
  "/contact",
  "/whatsapp-automation-bangalore",
  "/ai-agents-bangalore"
];

const server = spawn(
  process.execPath,
  [
    "node_modules/vite/bin/vite.js",
    "preview",
    "--host",
    "127.0.0.1",
    "--port",
    "4178",
    "--strictPort"
  ],
  { stdio: "inherit" }
);

let browser;

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt++) {
    if (server.exitCode !== null) {
      throw new Error("Preview server exited unexpectedly");
    }

    try {
      const response = await fetch(BASE_URL);

      if (response.ok) {
        return;
      }
    } catch {
      // The preview server is still starting.
    }

    await new Promise(resolve =>
      setTimeout(resolve, 500)
    );
  }

  throw new Error("Vite preview server did not start");
}

async function prerender() {
  await waitForServer();

  browser = await chromium.launch({
    headless: true
  });

  const page = await browser.newPage({
    viewport: {
      width: 1365,
      height: 900
    }
  });

  for (const route of ROUTES) {
    console.log(`Processing ${route}`);

    await page.goto(BASE_URL + route, {
      waitUntil: "domcontentloaded",
      timeout: 30000
    });

    await page.locator("main h1, h1")
      .first()
      .waitFor({ timeout: 15000 });

    const seo = await page.evaluate(() => {
      const title = document.title;

      const description = document.querySelector(
        'meta[name="description"]'
      )?.getAttribute("content");

      const canonical = document.querySelector(
        'link[rel="canonical"]'
      )?.getAttribute("href");

      const heading = document.querySelector("h1")
        ?.textContent?.trim();

      return {
        title,
        description,
        canonical,
        heading
      };
    });

    if (
      !seo.title ||
      !seo.description ||
      !seo.canonical ||
      !seo.heading
    ) {
      throw new Error(
        `Missing required SEO information on ${route}`
      );
    }

    const html = await page.content();

    const directory = route === "/"
      ? "dist"
      : join("dist", route.slice(1));

    await mkdir(directory, {
      recursive: true
    });

    await writeFile(
      join(directory, "index.html"),
      html,
      "utf8"
    );

    console.log(`SUCCESS: ${route}`);
  }

  console.log("SEO prerendering completed successfully");
}

try {
  await prerender();
} catch (error) {
  console.error("SEO prerender failed:", error);
  process.exitCode = 1;
} finally {
  if (browser) {
    await browser.close();
  }

  server.kill("SIGTERM");
}
