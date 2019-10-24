import puppeteer from "puppeteer";
import React from "react";
import { ScreenshotServer } from "./server";

export class ScreenshotTaker {
  private readonly server: ScreenshotServer;
  private browser: puppeteer.Browser | null = null;

  constructor(port = 3000) {
    this.server = new ScreenshotServer(port);
  }

  async start() {
    this.browser = await puppeteer.launch();
    await this.server.start();
  }

  async stop() {
    if (!this.browser) {
      throw new Error(
        `Browser is not open! Please make sure that start() was called.`
      );
    }
    await this.server.stop();
    await this.browser.close();
  }

  async render(node: React.ReactNode): Promise<string> {
    if (!this.browser) {
      throw new Error(`Please call start() once before render().`);
    }
    const page = await this.browser.newPage();
    return this.server.serve(node, async url => {
      await page.goto(url);
      return page.screenshot();
    });
  }
}
