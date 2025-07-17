import { test, expect, chromium} from '@playwright/test';
import UserRegistration from '../page_class/user_registration.js';
import ProductPurchase from '../page_class/product_purchase.js';


let browser;
let page;

const email = 'Micheal_Clark@maildrop.cc'
const password = 'IIQUpass@123'
const fname = 'Micheal'
const lname = 'Clark'
const tshirt_total_price = '€102.60'

test.describe('User Account Tests (Shared Page)', () => {


// Launch browser and page once before all test cases
test.beforeAll(async () => {
  browser = await chromium.launch({ headless: false });
  
  // Temporary context just to get screen size
  const tempContext = await browser.newContext();
  const tempPage = await tempContext.newPage();
  await tempPage.goto('about:blank');

  const { width, height } = await tempPage.evaluate(() => {
    return {
      width: window.screen.availWidth,
      height: window.screen.availHeight
    };
  });

  await tempContext.close(); // Close temporary context

  // Create new context with full screen resolution
  const context = await browser.newContext({
    viewport: { width, height }
  });

  page = await context.newPage();
  await page.goto('https://demo.prestashop.com/#/en/front');
});




test('User Creation Validation', async () => {
    const user_reg = new UserRegistration(page);
    await user_reg.create_user(email,password,fname,lname);
    });

    
test('User Product Purchase', async () => {
    const purchase = new ProductPurchase(page);
    await purchase.user_login_back_office();
    await purchase.search_product();
    await purchase.sort_filter();
    await purchase.purchase_product(fname, lname, tshirt_total_price);
    });


 // Close browser after all tests
test.afterAll(async () => {
    await browser.close();
    // console.log('Browser will remain open. Press CTRL+C to exit.');
    // await new Promise(() => {}); // Keeps the process alive
  });

});
