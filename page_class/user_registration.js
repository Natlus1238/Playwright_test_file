const { test, expect } = require('@playwright/test');
const Actions = require('../resuable_actions/actions');



class UserRegistration {
    constructor(page) {
      this.page = page;
      this.actions = new Actions(page);
  
      // Locators
      this.sing_in_iframe = page.locator('//*[@name="framelive"]');
      this.sing_in = page.locator('//span[text()="Sign in"]');
      this.create_acc = page.locator('//a[contains(text(),"No account? Create one here")]');
      this.social_title = page.locator('//label[@for="field-id_gender-1"]');
      this.fist_name = page.locator('//*[@name="firstname"]');
      this.last_name = page.locator('//*[@name="lastname"]');
      this.email = page.locator('//*[@name="email"]');
      this.password = page.locator('//*[@name="password"]');
      this.birthday = page.locator('//*[@name="birthday"]');
      this.terms_condition_checkbox = page.locator('(//*[@type="checkbox"])[2]');
      this.data_privacy_checkbox = page.locator('(//*[@type="checkbox"])[4]');
      this.save_button = page.locator('//*[contains(text(),"Save")]');
      this.sing_out = page.locator('(//*[@href="https://functional-watch.demo.prestashop.com/en/?mylogout="])[1]');
      this.acc_name = page.locator('//*[@title="View my customer account"]');

    }

    async create_user(username, password, fname, lname){
        const url = 'https://clear-stage.demo.prestashop.com/en/registration'

        // Validate the page title
        await this.actions.expectTitleToBe('PrestaShop Live Demo')
        
        // Switching to Iframe
        let frame = await this.actions.switchToFrame(this.sing_in_iframe)
        await frame.click(this.sing_in)

        // Validate login page is getting displayed
        await this.actions.expectToBeVisible(this.create_acc)

        // Switching to Iframe
        frame = await this.actions.switchToFrame(this.sing_in_iframe)
        await frame.click(this.create_acc)

        // Validate "Create an account" page is getting displayed
        await this.actions.expectToBeVisible(this.fist_name)

        // Switching to Iframe
        frame = await this.actions.switchToFrame(this.sing_in_iframe)

        await frame.click(this.social_title, {timeout: 30000})
        await frame.fill(this.fist_name,fname)
        await frame.fill(this.last_name,lname)
        await frame.fill(this.email,username)
        await frame.fill(this.password,password)
        await frame.fill(this.birthday,'03/03/2000')
        await frame.click(this.terms_condition_checkbox, {timeout: 30000})
        await frame.click(this.data_privacy_checkbox, {timeout: 30000})
        await frame.click(this.save_button, {timeout: 30000})

        // Validating the Status Code
        await this.actions.verifyApiStatusCode(url,302)

        // Validating signout button and user name
        await this.actions.expectToBeVisible(this.sing_out)
        await this.actions.expectToHaveText(this.acc_name, 'Micheal Clark')

        // Switching to Iframe
        frame = await this.actions.switchToFrame(this.sing_in_iframe)
        await frame.click(this.sing_out, {timeout: 30000})
        // Validating the Sign_in Button
        await this.actions.expectToBeVisible(this.sing_in)

        
    }
  
  }
  
  module.exports = UserRegistration;
