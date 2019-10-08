import { Page } from "puppeteer";
import { Browser } from "../browser/Browser";
import { CONFIG } from "../config";
import { QAWolf } from "./index";

let browser: Browser;
let page: Page;

beforeAll(async () => {
  browser = await Browser.create({ url: `${CONFIG.testUrl}login` });
  page = await browser.currentPage();
});

afterAll(() => browser.close());

describe("getDataValue", () => {
  test("returns null if data attribute not specified in config", async () => {
    const dataAttribute = await page.evaluate(() => {
      const qawolf: QAWolf = (window as any).qawolf;
      const username = document.getElementById("username")!;
      username.setAttribute("data-qa", "user");

      const result = qawolf.locator.getDataValue(username, null);
      username.removeAttribute("data-qa");

      return result;
    });

    expect(dataAttribute).toBeNull();
  });

  test("returns null if element does not have specified data attribute", async () => {
    const dataAttribute = await page.evaluate(() => {
      const qawolf: QAWolf = (window as any).qawolf;
      const username = document.getElementById("username")!;
      username.setAttribute("data-other", "user");

      const result = qawolf.locator.getDataValue(username, "data-qa");
      username.removeAttribute("data-other");

      return result;
    });

    expect(dataAttribute).toBeNull();
  });

  test("returns data attribute value correctly", async () => {
    const dataAttribute = await page.evaluate(() => {
      const qawolf: QAWolf = (window as any).qawolf;
      const username = document.getElementById("username")!;
      username.setAttribute("data-qa", "user");

      const result = qawolf.locator.getDataValue(username, "data-qa");
      username.removeAttribute("data-qa");

      return result;
    });

    expect(dataAttribute).toBe("user");
  });
});

test("getLabels correctly returns labels", async () => {
  const nullLabels = await page.evaluate(() => {
    const qawolf: QAWolf = (window as any).qawolf;

    return qawolf.locator.getLabels(document.getElementsByTagName("h2")[0]);
  });

  expect(nullLabels).toBeNull();

  const usernameLabels = await page.evaluate(() => {
    const qawolf: QAWolf = (window as any).qawolf;

    return qawolf.locator.getLabels(document.getElementsByTagName("input")[0]);
  });

  expect(usernameLabels).toEqual(["username"]);
});

test("getParentText correctly returns parent text", async () => {
  const iconParentText = await page.evaluate(() => {
    const qawolf: QAWolf = (window as any).qawolf;

    return qawolf.locator.getParentText(document.getElementsByTagName("i")[0]);
  });

  expect(iconParentText).toEqual(["login", "login"]);
});

describe("getPlaceholder", () => {
  test("returns placeholder if present", async () => {
    const placeholder = await page.evaluate(() => {
      const qawolf: QAWolf = (window as any).qawolf;
      const input = document.getElementsByTagName("input")[0];
      input.placeholder = "enter username";

      const result = qawolf.locator.getPlaceholder(
        document.getElementsByTagName("input")[0]
      );

      input.removeAttribute("placeholder");

      return result;
    });

    expect(placeholder).toBe("enter username");
  });

  test("returns null if no placeholder", async () => {
    const nullPlaceholder = await page.evaluate(() => {
      const qawolf: QAWolf = (window as any).qawolf;

      return qawolf.locator.getPlaceholder(
        document.getElementsByTagName("input")[0]
      );
    });

    expect(nullPlaceholder).toBeNull();
  });

  test("returns disabled option text for select", async () => {
    await page.goto(`${CONFIG.testUrl}dropdown`);

    const placeholder = await page.evaluate(() => {
      const qawolf: QAWolf = (window as any).qawolf;

      return qawolf.locator.getPlaceholder(
        document.getElementsByTagName("select")[0]
      );
    });

    expect(placeholder).toBe("please select an option");

    await page.goto(`${CONFIG.testUrl}login`);
  });
});

test("getTextContent returns text content", async () => {
  const headerTextContent = await page.evaluate(() => {
    const qawolf: QAWolf = (window as any).qawolf;

    return qawolf.locator.getTextContent(
      document.getElementsByTagName("h2")[0]
    );
  });

  expect(headerTextContent).toBe("login page");

  const nullTextContent = await page.evaluate(() => {
    const qawolf: QAWolf = (window as any).qawolf;

    return qawolf.locator.getTextContent(
      document.getElementsByTagName("input")[0]
    );
  });

  expect(nullTextContent).toBeNull();
});

test("getSerializedLocator correctly returns full element locator", async () => {
  const inputLocator = await page.evaluate(() => {
    const qawolf: QAWolf = (window as any).qawolf;

    const username = document.getElementById("username")!;
    username.setAttribute("data-qa", "user");

    const result = qawolf.locator.getSerializedLocator(
      document.getElementsByTagName("input")[0],
      "data-qa"
    );

    username.removeAttribute("data-qa");

    return result;
  });

  expect(inputLocator).toMatchObject({
    classList: null,
    dataValue: "user",
    href: null,
    id: "username",
    inputType: "text",
    labels: ["username"],
    name: "username",
    placeholder: null,
    tagName: "input",
    textContent: null
  });
  expect(inputLocator!.parentText).toContain("username");

  const headerLocator = await page.evaluate(() => {
    const qawolf: QAWolf = (window as any).qawolf;

    return qawolf.locator.getSerializedLocator(
      document.getElementsByTagName("h2")[0],
      "data-qa"
    );
  });

  expect(headerLocator).toMatchObject({
    classList: null,
    dataValue: null,
    href: null,
    id: null,
    inputType: null,
    labels: null,
    name: null,
    placeholder: null,
    tagName: "h2",
    textContent: "login page"
  });
  expect(headerLocator!.parentText).toContain("login page");
});
