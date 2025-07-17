const { test, expect } = require('@playwright/test');
const Actions = require('../resuable_actions/actions');
const { waitForDebugger } = require('inspector');



class ProductPurchase {
    constructor(page) {
      this.page = page;
      this.actions = new Actions(page);
  
      // Locators
      this.iframe_selector = ('//*[@name="framelive"]');
      this.explore_back_office = ('//*[text()="Explore back office"]');
      this.log_in = ('//*[@id="submit_login"]');
      this.explore_front_office = ('//*[text()="Explore front office"]');
      this.clothes_menu = ('//*[@class="top-menu"]/li[@id="category-3"]');
      this.accessories_menu = ('//*[@class="top-menu"]/li[@id="category-6"]');
      this.art_menu = ('//*[@class="top-menu"]/li[@id="category-9"]');
      this.search_bar = ('//*[@aria-label="Search"]');
      this.search_list_5_count = ('//*[@id="ui-id-1"]/li');
      this.pack_mug = ('//*[@class="product"and contains(text(),"Pack Mug + Framed poster")]');
      this.breadcrumbs_pack_mug = ('//span[text()="Pack Mug + Framed poster"]');
      this.price_mug = ('//span[@class="current-price-value"]');
      this.dimension_60_40 = ('(//*[@class="pack-product-price"]/preceding-sibling::div/a)[1]');
      this.home_logo = ('//*[@alt="PrestaShop"]');
      this.english_lang_validation = ('//*[@class="expand-more" and text()="English"]');
      this.accessories_breadcrumbs = ('//span[text()="Accessories"]');
      this.products_count_11_text = ('//p[text()="There are 11 products."]');
      this.product_list_count = ('//*[@class="h3 product-title"]');
      this.available_checkbox = ('//*[contains(text(),"Available")]');
      this.available_filter_blocks = ('//*[@class="filter-block"]');
      this.sort_by_btn = ('//*[@aria-label="Sort by selection"]');
      this.low_to_high_price_filter = ('//*[contains(text(),"low to high")]');
      this.tshirt_name = ('//*[@class="products row"]/descendant::a[text()="Hummingbird printed t-shirt"]');
      this.tshirt_quick_view = ('//*[@class="products row"]/descendant::a[text()="Hummingbird printed t-shirt"]/preceding::a[@data-link-action="quickview"]');
      this.tshirt_size = ('//*[@aria-label="Size"]');
      this.tshirt_black = ('//*[@class="input-color" and @title="Black"]');
      this.tshirt_L_size = ('//*[@title="L"]');
      this.tshirt_quantity = ('//*[@name="qty"]');
      this.tshirt_add_cart = ('//*[@data-button-action="add-to-cart"]');
      this.proceed_checkout_btn = ('//*[text()="Proceed to checkout"]');
      this.shopping_cart = ('//*[text()="Cart"]/following-sibling::span');
      this.user_address = ('//*[@id="field-address1"]');
      this.user_city = ('//*[@id="field-city"]');
      this.user_state_dropdown = ('//*[@name="id_state"]');
      this.user_state_selection = ('//*[text()="Alabama"]');
      this.user_postal_code = ('//*[@id="field-postcode"]');
      this.confirm_address = ('//*[@name="confirm-addresses"]');
      this.confirm_delivery = ('//*[@name="confirmDeliveryOption"]');
      this.user_terms_condition = ('//*[@name="conditions_to_approve[terms-and-conditions]"]');
      this.place_order_btn = ('//*[@id="payment-confirmation"]/div/button');
      this.product_title_list = ('//*[@class="h3 product-title"]');
      this.product_price_list = ('//*[@aria-label="Price"]');
      this.tshirt_pop_up_name = ('//h1[text()="Hummingbird printed t-shirt"]');
      this.product_adding_successful_message = ('//*[text()="Product successfully added to your shopping cart"]');
      this.product_quantity_number = ('//*[@name="product-quantity-spin"]');
      this.user_firstname = ('//*[@name="firstname"]');
      this.user_lastname = ('//*[@name="lastname"]');
      this.user_country_dropdown = ('//*[@name="id_country"]');
      this.delivery_next_day = ('//*[text()="Delivery next day!"]');
      this.total_price = ('//*[@class="cart-summary-line cart-total"]/child::span[@class="value"]');
      this.customizal_mug = ('//*[contains(text(),"Customizable mug")]');
      this.mug_best = ('//*[@class="product"and contains(text(),"Mug The best is yet to come")]');
      this.mug_adventure = ('//*[@class="product"and contains(text(),"Mug The adventure begins")]');
      this.mug_today = ('//*[@class="product"and contains(text(),"Mug Today is a good day")]');



    }

    async user_login_back_office(){
        const url = '/admin-dev/index.php'
        
        //Validating Page Url
        await this.actions.expectURLToContain('front')
        await this.actions.click(this.explore_back_office)

        // Validate link has been changed to “Explore front office
        await this.actions.expectToBeVisible(this.explore_front_office)

        // Validating api and Loging in 
        let frame = await this.actions.switchToFrame(this.iframe_selector)
        const actionsInFrame_1 = new Actions(frame);
        await actionsInFrame_1.scrollIntoView(this.log_in)
        await this.actions.clickAndVerifyApiStatusCode_inside_iframe(actionsInFrame_1,this.log_in,url, 200);  

        //handling alert pop up
        await this.actions.handleAlertIfPresent()

        // Validate it navigate to front office page
        await this.actions.click(this.explore_front_office)
        await this.actions.expectToBeVisible(this.explore_back_office)
        
        // Validate the page title
        await this.actions.expectTitleToBe('PrestaShop Live Demo')

        
    }

    async search_product(){
        // Validate Menus (clothes, accessories, art) are getting displayed
        let frame = await this.actions.switchToFrame(this.iframe_selector)
        const actionsInFrame = new Actions(frame);
        await actionsInFrame.expectToBeVisible(this.clothes_menu)
        await actionsInFrame.expectToBeVisible(this.accessories_menu)
        await actionsInFrame.expectToBeVisible(this.art_menu)

        // Validate total 5 mugs are getting displayed
        await actionsInFrame.fill(this.search_bar, 'Mug')
        await actionsInFrame.hover(this.customizal_mug)
        await actionsInFrame.expectToBeVisible(this.customizal_mug)
        await actionsInFrame.hover(this.mug_adventure)
        await actionsInFrame.expectToBeVisible(this.mug_adventure)
        await actionsInFrame.hover(this.mug_best)
        await actionsInFrame.expectToBeVisible(this.mug_best)
        await actionsInFrame.hover(this.mug_today)
        await actionsInFrame.expectToBeVisible(this.mug_today)
        await actionsInFrame.hover(this.pack_mug)
        await actionsInFrame.expectToBeVisible(this.pack_mug)
        await actionsInFrame.click(this.pack_mug)

        // Validate breadcrumbs, price and dimension
        frame = await this.actions.switchToFrame(this.iframe_selector)
        const actionsInFrame_1 = new Actions(frame);
        await actionsInFrame_1.expectToBeVisible(this.breadcrumbs_pack_mug)
        await actionsInFrame_1.expectToBeVisible(this.price_mug)
        const mug_price_value = await actionsInFrame_1.getText(this.price_mug)
        await actionsInFrame_1.assertTextContains(mug_price_value, '42')
        await actionsInFrame_1.expectToBeVisible(this.dimension_60_40)
    }

    async sort_filter(){
        let frame = await this.actions.switchToFrame(this.iframe_selector)
        const actionsInFrame_1 = new Actions(frame);
        await actionsInFrame_1.click(this.home_logo)

        // Validate breadcrums and product count
        frame = await this.actions.switchToFrame(this.iframe_selector)
        const actionsInFrame_2 = new Actions(frame);
        
        // Validate ‘English’ Language is selected
        await actionsInFrame_2.expectToBeVisible(this.english_lang_validation)

        await actionsInFrame_2.click(this.accessories_menu)
        frame = await this.actions.switchToFrame(this.iframe_selector)
        const actionsInFrame = new Actions(frame);
        await actionsInFrame.expectToBeVisible(this.accessories_breadcrumbs)
        await actionsInFrame.expectToBeVisible(this.products_count_11_text)

        // Validate active filters are selected: Availability: Available
        await actionsInFrame.scrollIntoView(this.available_checkbox)
        await actionsInFrame.click(this.available_checkbox)
        await actionsInFrame.scrollIntoView(this.available_filter_blocks)
        await actionsInFrame.expectToBeVisible(this.available_filter_blocks)

        // Validated Sort order and put data in an excel
        await actionsInFrame.scrollIntoView(this.sort_by_btn)
        await actionsInFrame.click(this.sort_by_btn)
        await actionsInFrame.hover(this.low_to_high_price_filter)
        await actionsInFrame.click(this.low_to_high_price_filter)
        await actionsInFrame.waitForTimeout(10000)
        await actionsInFrame.scrollIntoView(this.sort_by_btn)
        const product_with_price = await actionsInFrame.getProductsFromSeparateLists(this.product_list_count, this.product_price_list)
        //validating the sort function
        await actionsInFrame.assertSortedByPriceAsc(product_with_price)
        //uploading the data in excel
        await actionsInFrame.logProductsToExcel(product_with_price, 'Item_list_excel')
    }

    async purchase_product(fname, lname, tshirt_total_price){
        let frame = await this.actions.switchToFrame(this.iframe_selector)
        const actionsInFrame_pov = new Actions(frame);
        await actionsInFrame_pov.click(this.home_logo)
        frame = await this.actions.switchToFrame(this.iframe_selector)
        const actionsInFrame_1 = new Actions(frame);
        await actionsInFrame_1.scrollIntoView(this.tshirt_name)
        await actionsInFrame_1.hover(this.tshirt_name)
        await actionsInFrame_1.click(this.tshirt_quick_view)

        // Validate pop up has text - Hummingbird printed t-shirt
        await actionsInFrame_1.expectToBeVisible(this.tshirt_pop_up_name)
        await actionsInFrame_1.click(this.tshirt_black)
        await actionsInFrame_1.selectDropdownOptionByTitleOrText(this.tshirt_size, 'L');
        await actionsInFrame_1.fill(this.tshirt_quantity,'5')
        await actionsInFrame_1.click(this.tshirt_add_cart)

        // Validate success message (“Product successfully added to your shopping cart”)
        await actionsInFrame_1.expectToBeVisible(this.product_adding_successful_message)
        await actionsInFrame_1.click(this.proceed_checkout_btn)

        // Validate cart has 5 products added
        frame = await this.actions.switchToFrame(this.iframe_selector)
        const actionsInFrame = new Actions(frame);
        await actionsInFrame.expectToBeVisible(this.shopping_cart)
        const cart_count = await actionsInFrame.getText(this.shopping_cart)
        await actionsInFrame.assertTextContains(cart_count, '5')
        await actionsInFrame.waitForTimeout(10000)
        await actionsInFrame.expectToBeVisible(this.proceed_checkout_btn)
        await actionsInFrame.click(this.proceed_checkout_btn)
        
        // Validat first and last Name is auto populated on Address form
        await actionsInFrame.waitForTimeout(10000)
        frame = await this.actions.switchToFrame(this.iframe_selector)
        const actionsInFrame_3 = new Actions(frame);
        const first_name_value = await actionsInFrame_3.getAttribute(this.user_firstname, 'value')
        const last_name_value = await actionsInFrame_3.getAttribute(this.user_lastname, 'value')
        await actionsInFrame_3.assertTextContains(first_name_value, fname)
        await actionsInFrame_3.assertTextContains(last_name_value, lname)
        await actionsInFrame_3.fill(this.user_address, 'The address for tshirt is given here')
        await actionsInFrame_3.fill(this.user_city, 'City for Tshirt')
        await actionsInFrame_3.fill(this.user_postal_code, '35004')
        await actionsInFrame.waitForTimeout(8000)
        await actionsInFrame_3.scrollIntoView(this.confirm_address)
        await actionsInFrame_3.selectDropdownOptionByTitleOrText(this.user_state_dropdown, 'Alabama')
        await actionsInFrame_3.scrollIntoView(this.confirm_address)
        await actionsInFrame_3.click(this.confirm_address)

        // Validate ‘Pick up in-store’ option is by default selected
        await actionsInFrame_3.expectToBeVisible(this.delivery_next_day)
        await actionsInFrame_3.click(this.confirm_delivery)

        // Validate total price should be €102
        const total_price_value = await actionsInFrame_3.getText(this.total_price)
        await actionsInFrame_3.assertTextContains(total_price_value, tshirt_total_price)

        // Validate the following on Order confirmation screen - Failed Test case
        await actionsInFrame_3.assertElementEnabled(this.place_order_btn)
        

    }

  
  }
  
  module.exports = ProductPurchase;
