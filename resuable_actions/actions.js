// actions.js
const { expect } = require('@playwright/test');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

class Actions {
  constructor(page) {
    this.page = page;
    this.defaultTimeout = 90000;
    this.setupListeners();
  }

  setupListeners() {
    this.page.on('dialog', async (dialog) => {
      console.log(`Alert detected: ${dialog.message()}`);
      await dialog.accept();
    });

    this.page.on('console', (msg) => {
      console.log(`Browser log: [${msg.type()}] ${msg.text()}`);
    });
  }

  log(message) {
    console.log(`${message}`);
  }

  async click(selector, timeout = this.defaultTimeout) {
    this.log(`Clicking on ${selector}`);
    await this.page.locator(selector).click({ timeout });
  }

  async doubleClick(selector, timeout = this.defaultTimeout) {
    this.log(`Double-clicking on ${selector}`);
    await this.page.locator(selector).dblclick({ timeout });
  }

  async type(selector, text, clear = false, timeout = this.defaultTimeout) {
    this.log(`Typing "${text}" into ${selector}`);
    const element = this.page.locator(selector);
    if (clear) await element.fill('', { timeout });
    await element.type(text, { timeout });
  }

  async switchToFrame(frameSelectorOrName, timeout = this.defaultTimeout) {
  this.log(`Switching to frame: ${frameSelectorOrName}`);
  let frame = null;

  try {
    await this.page.waitForSelector(frameSelectorOrName, { timeout });
    const frameElementHandle = await this.page.$(frameSelectorOrName);
    frame = await frameElementHandle.contentFrame();
  } catch (e) {
    // Fallback: use frame by name or URL
    if (typeof frameSelectorOrName === 'string') {
      if (frameSelectorOrName.startsWith('http') || frameSelectorOrName.includes('/')) {
        frame = this.page.frame({ url: new RegExp(frameSelectorOrName) });
      } else {
        frame = this.page.frame({ name: frameSelectorOrName });
      }
    }
  }

  if (!frame) {
    throw new Error(`Frame "${frameSelectorOrName}" not found`);
  }

  this.log(`Switched to frame: ${frame.name() || 'unknown'}`);
  return frame;
}

  async fill(selector, text, timeout = this.defaultTimeout) {
    this.log(`Filling "${text}" into ${selector}`);
    await this.page.locator(selector).fill(text, { timeout });
  }

  async getText(selector, timeout = this.defaultTimeout) {
    const element = this.page.locator(selector);
    await element.waitFor({ timeout });
    const text = await element.innerText();
    this.log(`Text from ${selector}: "${text}"`);
    return text;
  }

  async isVisible(selector, timeout = this.defaultTimeout) {
    const visible = await this.page.locator(selector).isVisible({ timeout });
    this.log(`${selector} is visible: ${visible}`);
    return visible;
  }

  async isEnabled(selector, timeout = this.defaultTimeout) {
    const enabled = await this.page.locator(selector).isEnabled({ timeout });
    this.log(`${selector} is enabled: ${enabled}`);
    return enabled;
  }

  async isChecked(selector, timeout = this.defaultTimeout) {
    const checked = await this.page.locator(selector).isChecked({ timeout });
    this.log(`${selector} is checked: ${checked}`);
    return checked;
  }

  async selectOption(selector, value, timeout = this.defaultTimeout) {
    this.log(`Selecting option "${value}" from ${selector}`);
    await this.page.locator(selector).selectOption(value, { timeout });
  }

  async waitForSelector(selector, timeout = this.defaultTimeout) {
    this.log(`Waiting for ${selector} up to ${timeout}ms`);
    await this.page.locator(selector).waitFor({ timeout });
  }

  async hover(selector, timeout = this.defaultTimeout) {
    this.log(`Hovering over ${selector}`);
    await this.page.locator(selector).hover({ timeout });
  }

  async getTitle(timeout = this.defaultTimeout) {
    this.log(`Getting page title`);
    await this.page.waitForLoadState('load', { timeout });
    const title = await this.page.title();
    this.log(`Page title: "${title}"`);
    return title;
  }

  async expectTitleToBe(expectedTitle, timeout = this.defaultTimeout) {
    this.log(`Asserting page title is "${expectedTitle}"`);
    await expect(this.page).toHaveTitle(expectedTitle, { timeout });
  }

  async pressKey(selector, key, timeout = this.defaultTimeout) {
    this.log(`Pressing "${key}" on ${selector}`);
    await this.page.locator(selector).press(key, { timeout });
  }

  async uploadFile(selector, filePath, timeout = this.defaultTimeout) {
    this.log(`Uploading file "${filePath}" into ${selector}`);
    await this.page.setInputFiles(selector, filePath, { timeout });
  }

  async scrollIntoView(selector, timeout = this.defaultTimeout) {
    this.log(`Scrolling to ${selector}`);
    await this.page.locator(selector).scrollIntoViewIfNeeded({ timeout });
  }

  async getAttribute(selector, attr, timeout = this.defaultTimeout) {
    const value = await this.page.locator(selector).getAttribute(attr, { timeout });
    this.log(`Attribute "${attr}" of ${selector}: "${value}"`);
    return value;
  }

  async check(selector, timeout = this.defaultTimeout) {
    this.log(`Checking ${selector}`);
    await this.page.locator(selector).check({ timeout });
  }

  async uncheck(selector, timeout = this.defaultTimeout) {
    this.log(`Unchecking ${selector}`);
    await this.page.locator(selector).uncheck({ timeout });
  }

  async waitForTimeout(ms) {
    this.log(`Waiting for ${ms}ms`);
    await this.page.waitForTimeout(ms);
  }

  async expectToHaveText(selector, expectedText, timeout = this.defaultTimeout) {
    this.log(`Asserting ${selector} has text "${expectedText}"`);
    await expect(this.page.locator(selector)).toHaveText(expectedText, { timeout });
  }

  async expectToBeVisible(selector, timeoutOrOptions = this.defaultTimeout) {
    this.log(`Asserting ${selector} is visible`);
    const options = typeof timeoutOrOptions === 'number' ? { timeout: timeoutOrOptions } : timeoutOrOptions;
    await expect(this.page.locator(selector)).toBeVisible(options);
  }

  async expectToBeHidden(selector, timeout = this.defaultTimeout) {
    this.log(`Asserting ${selector} is hidden`);
    await expect(this.page.locator(selector)).toBeHidden({ timeout });
  }

  async expectToHaveAttribute(selector, attr, value, timeout = this.defaultTimeout) {
    this.log(`Asserting ${selector} has attribute ${attr}="${value}"`);
    await expect(this.page.locator(selector)).toHaveAttribute(attr, value, { timeout });
  }

  async expectToBeChecked(selector, timeout = this.defaultTimeout) {
    this.log(`Asserting ${selector} is checked`);
    await expect(this.page.locator(selector)).toBeChecked({ timeout });
  }

  async expectURLToContain(text, timeout = this.defaultTimeout) {
    this.log(`Asserting URL contains "${text}"`);
    await expect(this.page).toHaveURL(new RegExp(text), { timeout });
  }

  async clickAndVerifyApiStatusCode_inside_iframe(frameActionsInstance, buttonSelector, url, expectedStatus = 200, timeout = this.defaultTimeout) {
  this.log(`Waiting for API call to: ${url} after clicking ${buttonSelector}`);

  const [response] = await Promise.all([
    this.page.waitForResponse(
      response => {
        const isMatch = typeof url === 'string' 
          ? response.url().includes(url)   // use includes for partial matching
          : url.test(response.url());
        return isMatch;
      },
      { timeout }
    ),
    frameActionsInstance.click(buttonSelector)
  ]);

  const actualStatus = response.status();
  if (actualStatus === expectedStatus) {
    this.log(`API responded with expected status ${actualStatus}: ${response.url()}`);
  } else {
    this.log(`API responded with unexpected status ${actualStatus}, expected ${expectedStatus}: ${response.url()}`);
    throw new Error(`API ${response.url()} returned status ${actualStatus}, expected ${expectedStatus}`);
  }
}



  async handleAlertIfPresent(action = 'accept', timeout = 3000) {
    this.log(`Waiting for alert for up to ${timeout}ms`);
    try {
      const dialogPromise = new Promise((resolve) => {
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

  async assertTextContains(actualText, expectedSubstring, customMessage = 'The Values does not match') {
    this.log(`The text from locator is "${actualText}"`);
    const actualLower = actualText.toLowerCase();
    const expectedLower = expectedSubstring.toLowerCase();
    this.log(`Asserting that "${actualText}" contains "${expectedSubstring}" (case-insensitive)`);
    expect(actualLower, customMessage || `Expected "${actualText}" to contain "${expectedSubstring}"`).toContain(expectedLower);
  }

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

  async assertSortedByPriceAsc(productList) {
    const prices = productList.map(p => p.price);
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
    this.log('Products are sorted in ascending order by price.');
  }

  async logProductsToExcel(productList, fileName = 'products.xlsx') {
    const targetDir = path.resolve('product_excel');
    const fullPath = path.join(targetDir, fileName);
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
      throw new Error(msg);
    }
    this.log(`Element ${selector} is enabled as expected.`);
  }


  //Selecting option from dropdown
 async selectDropdownOptionByTitleOrText(locator, value, timeout = 15000) {
    this.log(`Trying to select option by value, title, or text: ${value} in ${locator}`);

    const dropdown = this.page.locator(locator);
    await dropdown.waitFor({ state: 'visible', timeout });

    // Try by value
    const optionByValue = dropdown.locator(`option[value="${value}"]`);
    if (await optionByValue.count({ timeout }) > 0) {
        await dropdown.selectOption(value, { timeout });
        return;
    }

    // Try by title
    const optionByTitle = dropdown.locator(`option[title="${value}"]`).first();
    if (await optionByTitle.count({ timeout }) > 0) {
        const val = await optionByTitle.getAttribute('value', { timeout });
        await dropdown.selectOption(val, { timeout });
        return;
    }

    // Try by visible text
    const optionByText = dropdown.locator('option', { hasText: value }).first();
    if (await optionByText.count({ timeout }) > 0) {
        const val = await optionByText.getAttribute('value', { timeout });
        await dropdown.selectOption(val, { timeout });
        return;
    }

    throw new Error(`Option with value/title/text "${value}" not found in dropdown: ${locator}`);
}






}

module.exports = Actions;
