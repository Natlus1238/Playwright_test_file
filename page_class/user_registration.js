const { test, expect } = require('@playwright/test');
const Actions = require('../resuable_actions/actions');



class UserRegistration {
    constructor(page) {
      this.page = page;
      this.actions = new Actions(page);
  
      // Locators
      this.sing_in_iframe = ('//*[@name="framelive"]');
      this.sing_in = ('//span[text()="Sign in"]');
      this.create_acc =('//a[contains(text(),"No account? Create one here")]');
      this.social_title = ('//label[@for="field-id_gender-1"]');
      this.fist_name = ('//*[@name="firstname"]');
      this.last_name = ('//*[@name="lastname"]');
      this.email = ('//*[@name="email" and @id="field-email"]');
      this.password = ('//*[@name="password"]');
      this.birthday = ('//*[@name="birthday"]');
      this.terms_condition_checkbox = ('(//*[@type="checkbox"])[2]');
      this.data_privacy_checkbox = ('(//*[@type="checkbox"])[4]');
      this.save_button = ('//*[contains(text(),"Save")]');
      this.sing_out = ('(//*[@class="user-info"]/a)[1]');
      this.acc_name = ('//*[@title="View my customer account"]');

    }

    async create_user(username, password, fname, lname){
        const url = '/en/registration'

        // Validate the page title
        await this.actions.expectTitleToBe('PrestaShop Live Demo')
        
        // Switching to Iframe
        let frame = await this.actions.switchToFrame(this.sing_in_iframe)
        const actionsInFrame_2 = new Actions(frame);
        await actionsInFrame_2.click(this.sing_in)


        // Switching to Iframe and validate the create acc
        frame = await this.actions.switchToFrame(this.sing_in_iframe)
        const actionsInFrame_1 = new Actions(frame);
        await actionsInFrame_1.expectToBeVisible(this.create_acc)
        await actionsInFrame_1.click(this.create_acc)

        

        // Switching to Iframe and Validate "Create an account" page is getting displayed

        frame = await this.actions.switchToFrame(this.sing_in_iframe)
        const actionsInFrame = new Actions(frame);
        await actionsInFrame.expectToBeVisible(this.fist_name)

        await actionsInFrame.click(this.social_title)
        await actionsInFrame.fill(this.fist_name,fname)
        await actionsInFrame.fill(this.last_name,lname)
        await actionsInFrame.fill(this.email,username)
        await actionsInFrame.fill(this.password,password)
        await actionsInFrame.fill(this.birthday,'03/03/2000')
        await actionsInFrame.click(this.terms_condition_checkbox)
        await actionsInFrame.click(this.data_privacy_checkbox)
        await actionsInFrame.scrollIntoView(this.save_button)

        // Validating the Status Code
        await this.actions.clickAndVerifyApiStatusCode_inside_iframe(actionsInFrame,this.save_button,url, 302);  

        // Switching to Iframe and validate the signout button and account name
        frame = await this.actions.switchToFrame(this.sing_in_iframe)
        const actionsInFrame_3 = new Actions(frame);
        await actionsInFrame_3.expectToBeVisible(this.sing_out)
        const user_name_value = await actionsInFrame_3.getText(this.acc_name)
        await actionsInFrame_3.assertTextContains(user_name_value, 'Micheal Clark')

        // await actionsInFrame_3.click(this.sing_out)
        // // Validating the Sign_in Button
        // await this.actions.expectToBeVisible(this.sing_in)

        
    }
  
  }
  
  module.exports = UserRegistration;
