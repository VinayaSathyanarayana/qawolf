import { CONFIG } from "@qawolf/config";
// needed to test logging test start
import "@qawolf/jest-plugin";
import { browserLogger } from "@qawolf/logger";
import { sleep, waitFor } from "@qawolf/web";
import { isEqual } from "lodash";
import { Browser, launch, Page } from "../../src";

describe("capture logs", () => {
  describe("logging", () => {
    let lastMessage: any | false = false;
    let browser: Browser;
    let page: Page;

    beforeAll(async () => {
      browser = await launch({
        logLevel: "debug",
        url: `${CONFIG.testUrl}login`
      });

      browserLogger.onLog((level: string, message: string) => {
        lastMessage = { level, message };
      });

      page = await browser.page();
    });

    afterAll(() => browser.close());

    it("logs browser logs", async () => {
      await page.evaluate(() => {
        console.debug("qawolf: my log", { hello: true });
      });

      await waitFor(
        () =>
          isEqual(lastMessage, {
            level: "debug",
            message: 'qawolf: my log {"hello":true}'
          }),
        1000,
        50
      );
    });

    it("logs test start", async () => {
      await waitFor(
        () =>
          isEqual(lastMessage, {
            level: "log",
            message: "jest: logs test start"
          }),
        1000,
        50
      );
    });

    it("formats elements by their xpath", async () => {
      await page.evaluate(() => {
        const button = document.getElementsByTagName("button")[0]!;
        console.debug("click on", button);
      });

      await waitFor(
        () =>
          isEqual(lastMessage, {
            level: "debug",
            message: `click on //*[@id='login']/button`
          }),
        1000,
        50
      );
    });
  });

  it("ignores qawolf debug logs when QAW_LOG_LEVEL != debug", async () => {
    const browser = await launch({
      logLevel: "verbose",
      url: CONFIG.testUrl
    });
    const page = await browser.page();

    let lastMessage: any | false = false;

    browserLogger.onLog(
      (level: string, message: string) => (lastMessage = { level, message })
    );

    await page.evaluate(() => {
      console.debug("1");
      console.debug("qawolf: 2");
    });

    await sleep(1000);

    expect(lastMessage).toEqual({
      level: "debug",
      message: "1"
    });

    await browser.close();
  });
});
