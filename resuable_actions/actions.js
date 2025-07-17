const { expect } = require('@playwright/test');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

class Actions {
  constructor(page) {
    this.page = page;
    this.defaultTimeout = 30000; // Default wait time: 30 seconds
    this.setupListeners();
  }

  // Set up listeners for alerts and browser console logs
  setupListeners() {
    this.page.on('dialog', async (dialog) => {
      console.log(`Alert detected: ${dialog.message()}`);
      await dialog.accept();
    });

    this.page.on('console', (msg) => {
      console.log(`Browser log: [${msg.type()}] ${msg.text()}`);
    });
  }

  // Print logs for each action
  log(message) {
    console.log(`${message}`);
  }

  // Click on an element
  async click(selector, timeout = this.defaultTimeout) {
    this.log(`Clicking on ${selector}`);
    await this.page.locator(selector).click({ timeout });
  }

  // Double-click on an element
  async doubleClick(selector, timeout = this.defaultTimeout) {
    this.log(`Double-clicking on ${selector}`);
    await this.page.locator(selector).dblclick({ timeout });
  }

  // Type text into a field (simulates real key presses)
  async type(selector, text, clear = false, timeout = this.defaultTimeout) {
    this.log(`Typing "${text}" into ${selector}`);
    const element = this.page.locator(selector);
    if (clear) await element.fill('', { timeout });
    await element.type(text, { timeout });
  }


  // Switch to a frame by name, id, or selector
  async switchToFrame(frameSelectorOrName, timeout = this.defaultTimeout) {
    this.log(`Switching to frame: ${frameSelectorOrName}`);

    let frame = null;

    // Case 1: Use as a selector
    try {
      await this.page.waitForSelector(frameSelectorOrName, { timeout });
      const frameElementHandle = await this.page.$(frameSelectorOrName);
      frame = await frameElementHandle.contentFrame();
    } catch (e) {
      // Case 2: Try by name or id
      frame = this.page.frame({ name: frameSelectorOrName }) || this.page.frame({ url: new RegExp(frameSelectorOrName) });
    }

    if (!frame) {
      throw new Error(`Frame "${frameSelectorOrName}" not found`);
    }

    this.log(`Switched to frame: ${frame.name() || 'unknown'}`);
    return frame;
  }


  
  // Fill input field with text (clears existing text)
  async fill(selector, text, timeout = this.defaultTimeout) {
    this.log(`Filling "${text}" into ${selector}`);
    await this.page.locator(selector).fill(text, { timeout });
  }

  // Get visible text content from an element
  async getText(selector, timeout = this.defaultTimeout) {
    const element = this.page.locator(selector);
    await element.waitFor({ timeout });
    const text = await element.innerText();
    this.log(`Text from ${selector}: "${text}"`);
    return text;
  }

  // Check if an element is visible
  async isVisible(selector, timeout = this.defaultTimeout) {
    const visible = await this.page.locator(selector).isVisible({ timeout });
    this.log(`${selector} is visible: ${visible}`);
    return visible;
  }

  // Check if an element is enabled
  async isEnabled(selector, timeout = this.defaultTimeout) {
    const enabled = await this.page.locator(selector).isEnabled({ timeout });
    this.log(`${selector} is enabled: ${enabled}`);
    return enabled;
  }

  // Check if a checkbox/radio is selected
  async isChecked(selector, timeout = this.defaultTimeout) {
    const checked = await this.page.locator(selector).isChecked({ timeout });
    this.log(`${selector} is checked: ${checked}`);
    return checked;
  }

  // Select a dropdown option by value
  async selectOption(selector, value, timeout = this.defaultTimeout) {
    this.log(`Selecting option "${value}" from ${selector}`);
    await this.page.locator(selector).selectOption(value, { timeout });
  }

  // Wait until an element is visible or present in DOM
  async waitForSelector(selector, timeout = this.defaultTimeout) {
    this.log(`Waiting for ${selector} up to ${timeout}ms`);
    await this.page.locator(selector).waitFor({ timeout });
  }

  // Hover over an element
  async hover(selector, timeout = this.defaultTimeout) {
    this.log(`Hovering over ${selector}`);
    await this.page.locator(selector).hover({ timeout });
  }

  // Get the current page title
  async getTitle(timeout = this.defaultTimeout) {
    this.log(`Getting page title`);
    await this.page.waitForLoadState('load', { timeout });
    const title = await this.page.title();
    this.log(`Page title: "${title}"`);
    return title;
  }

  // Assert the current page title matches expected
  async expectTitleToBe(expectedTitle, timeout = this.defaultTimeout) {
    this.log(`Asserting page title is "${expectedTitle}"`);
    await expect(this.page).toHaveTitle(expectedTitle, { timeout });
  }

  
  // Press a keyboard key on a specific element
  async pressKey(selector, key, timeout = this.defaultTimeout) {
    this.log(`Pressing "${key}" on ${selector}`);
    await this.page.locator(selector).press(key, { timeout });
  }

  // Upload a file using a file input element
  async uploadFile(selector, filePath, timeout = this.defaultTimeout) {
    this.log(`Uploading file "${filePath}" into ${selector}`);
    await this.page.setInputFiles(selector, filePath, { timeout });
  }

  // Scroll an element into view
  async scrollIntoView(selector, timeout = this.defaultTimeout) {
    this.log(`Scrolling to ${selector}`);
    await this.page.locator(selector).scrollIntoViewIfNeeded({ timeout });
  }

  // Get an attribute value from an element
  async getAttribute(selector, attr, timeout = this.defaultTimeout) {
    const value = await this.page.locator(selector).getAttribute(attr, { timeout });
    this.log(`Attribute "${attr}" of ${selector}: "${value}"`);
    return value;
  }

  // Check a checkbox or radio button
  async check(selector, timeout = this.defaultTimeout) {
    this.log(`Checking ${selector}`);
    await this.page.locator(selector).check({ timeout });
  }

  // Uncheck a checkbox
  async uncheck(selector, timeout = this.defaultTimeout) {
    this.log(`Unchecking ${selector}`);
    await this.page.locator(selector).uncheck({ timeout });
  }

  // Wait for a fixed amount of time (in milliseconds)
  async waitForTimeout(ms) {
    this.log(`Waiting for ${ms}ms`);
    await this.page.waitForTimeout(ms);
  }

  // Expect the element to have specific text
  async expectToHaveText(selector, expectedText, timeout = this.defaultTimeout) {
    this.log(`Asserting ${selector} has text "${expectedText}"`);
    await expect(this.page.locator(selector)).toHaveText(expectedText, { timeout });
  }

  // Expect the element to be visible
  async expectToBeVisible(selector, timeout = this.defaultTimeout) {
    this.log(`Asserting ${selector} is visible`);
    await expect(this.page.locator(selector)).toBeVisible({ timeout });
  }

  // Expect the element to be hidden
  async expectToBeHidden(selector, timeout = this.defaultTimeout) {
    this.log(`Asserting ${selector} is hidden`);
    await expect(this.page.locator(selector)).toBeHidden({ timeout });
  }

  // Expect the element to have a specific attribute and value
  async expectToHaveAttribute(selector, attr, value, timeout = this.defaultTimeout) {
    this.log(`Asserting ${selector} has attribute ${attr}="${value}"`);
    await expect(this.page.locator(selector)).toHaveAttribute(attr, value, { timeout });
  }

  // Expect the element (checkbox/radio) to be checked
  async expectToBeChecked(selector, timeout = this.defaultTimeout) {
    this.log(`Asserting ${selector} is checked`);
    await expect(this.page.locator(selector)).toBeChecked({ timeout });
  }

  // Expect the current URL to contain specific text
  async expectURLToContain(text, timeout = this.defaultTimeout) {
    this.log(`Asserting URL contains "${text}"`);
    await expect(this.page).toHaveURL(new RegExp(text), { timeout });
  }

  //Verify Status Code for url
  async verifyApiStatusCode(url, expectedStatus = 200, timeout = this.defaultTimeout) {
    this.log(`Waiting for API call to: ${url}`);
  
    const response = await this.page.waitForResponse(
      response => {
        const isMatch = typeof url === 'string' 
          ? response.url() === url 
          : url.test(response.url());
        return isMatch;
      },
      { timeout }
    );
  
    const actualStatus = response.status();
    if (actualStatus === expectedStatus) {
      this.log(`API responded with expected status ${actualStatus}: ${response.url()}`);
    } else {
      this.log(`API responded with unexpected status ${actualStatus}, expected ${expectedStatus}: ${response.url()}`);
      throw new Error(`API ${response.url()} returned status ${actualStatus}, expected ${expectedStatus}`);
    }
  }

  // handling the alert only if present
  async handleAlertIfPresent(action = 'accept', timeout = 3000) {
    this.log(`Waiting for alert for up to ${timeout}ms`);
  
    try {
      const dialogPromise = new Promise((resolve, reject) => {
        this.page.once('dialog', async dialog => {
          this.log(`Alert detected: ${dialog.message()}`);
  
          if (action === 'accept') {
            await dialog.accept();
            this.log('Alert accepted');
          } else {
            await dialog.dismiss();
            this.log('Alert dismissed');
          }
          resolve();
        });
  
        // Timeout fallback — if no alert comes, just resolve
        setTimeout(() => {
          this.log('ℹ️ No alert appeared within timeout, continuing...');
          resolve();
        }, timeout);
      });
  
      await dialogPromise;
    } catch (err) {
      this.log(`Error handling alert: ${err.message}`);
    }
  }

  // Asserting the string values
  async assertTextContains(actualText, expectedSubstring, customMessage = 'The Values does not match') {
    const actualLower = actualText.toLowerCase();
    const expectedLower = expectedSubstring.toLowerCase();

    this.log(`Asserting that "${actualText}" contains "${expectedSubstring}" (case-insensitive)`);

    expect(actualLower, customMessage || `Expected "${actualText}" to contain "${expectedSubstring}"`)
      .toContain(expectedLower);
  }


// Extracts product names and prices using separate selectors (must be aligned by index)
  async getProductsFromSeparateLists(nameSelector, priceSelector) {
    const nameElements = await this.page.$$(nameSelector);
    const priceElements = await this.page.$$(priceSelector);

    if (nameElements.length !== priceElements.length) {
      throw new Error(`Name (${nameElements.length}) and Price (${priceElements.length}) counts do not match`);
    }

    const products = [];
    for (let i = 0; i < nameElements.length; i++) {
      const name = (await nameElements[i].textContent()).trim();
      const priceText = (await priceElements[i].textContent()).trim();
      const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));

      products.push({ name, price });
    }

    return products;
  }


  // Asserts product list is sorted by ascending price
  async assertSortedByPriceAsc(productList) {
    const prices = productList.map(p => p.price);
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
    this.log('Products are sorted in ascending order by price.');
  }

  // prints value to Excel Sheet
  async logProductsToExcel(productList, fileName = 'products.xlsx') {
    const targetDir = path.resolve('product_excel'); // relative to project root
    const fullPath = path.join(targetDir, fileName);
  
    // Ensure folder exists
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
  
    this.log('Product list:');
    productList.forEach(p => console.log(`- ${p.name}: €${p.price}`));
  
    const worksheetData = productList.map(p => ({ Name: p.name, Price: p.price }));
    const worksheet = xlsx.utils.json_to_sheet(worksheetData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Products');
  
    xlsx.writeFile(workbook, fullPath);
    this.log(`Exported product list to: ${fullPath}`);
  }

  async assertElementEnabled(selector, timeout = this.defaultTimeout) {
    this.log(`Checking if element ${selector} is enabled...`);
  
    const isDisabled = await this.page.locator(selector).isDisabled({ timeout });
  
    if (isDisabled) {
      const msg = `[FAILED] Element ${selector} is DISABLED, but was expected to be ENABLED.`;
      this.log(msg);
      throw new Error(msg); // force test to fail
    }
  
    this.log(`Element ${selector} is enabled as expected.`);
  }
  



}

  

module.exports = Actions;
