const { test, expect } = require('@playwright/test');
const Actions = require('../resuable_actions/actions');
const { waitForDebugger } = require('inspector');



class ProductPurchase {
    constructor(page) {
      this.page = page;
      this.actions = new Actions(page);
  
      // Locators
      this.iframe_selector = page.locator('//*[@name="framelive"]');
      this.explore_back_office = page.locator('//*[text()="Explore back office"]');
      this.log_in = page.locator('//*[@id="submit_login"]');
      this.explore_front_office = page.locator('//*[text()="Explore front office"]');
      this.clothes_menu = page.locator('//*[@href="https://purring-pipe.demo.prestashop.com/en/3-clothes"]');
      this.accessories_menu = page.locator('//*[@href="https://purring-pipe.demo.prestashop.com/en/6-accessories"]');
      this.art_menu = page.locator('//*[@href="https://purring-pipe.demo.prestashop.com/en/9-art"]');
      this.search_bar = page.locator('//*[@aria-label="Search"]');
      this.search_list_5_count = page.locator('//*[@id="ui-id-1"]/li');
      this.pack_mug = page.locator('(//*[@id="ui-id-1"]/li)[5]');
      this.breadcrumbs_pack_mug = page.locator('//span[text()="Pack Mug + Framed poster"]');
      this.price_mug = page.locator('//span[@class="current-price-value"]');
      this.dimension_60_40 = page.locator('(//*[@class="pack-product-price"]/preceding-sibling::div/a)[1]');
      this.home_logo = page.locator('//*[@alt="PrestaShop"]');
      this.english_lang_validation = page.locator('//*[@class="expand-more" and text()="English"]');
      this.accessories_breadcrumbs = page.locator('//span[text()="Accessories"]');
      this.products_count_11_text = page.locator('//p[text()="There are 11 products."]');
      this.product_list_count = page.locator('//*[@class="h3 product-title"]');
      this.available_checkbox = page.locator('//*[@data-search-url="https://purring-pipe.demo.prestashop.com/en/6-accessories?q=Availability-Available"]/parent::span');
      this.available_filter_blocks = page.locator('//*[@class="filter-block"]');
      this.sort_by_btn = page.locator('//*[@aria-label="Sort by selection"]');
      this.low_to_high_price_filter = page.locator('//*[@href="https://purring-pipe.demo.prestashop.com/en/6-accessories?q=Availability-Available&order=product.price.asc"]');
      this.tshirt_name = page.locator('//*[@class="products row"]/descendant::a[text()="Hummingbird printed t-shirt"]');
      this.tshirt_quick_view = page.locator('//*[@class="products row"]/descendant::a[text()="Hummingbird printed t-shirt"]/preceding::a[@data-link-action="quickview"]');
      this.tshirt_size = page.locator('//*[@aria-label="Size"]');
      this.tshirt_black = page.locator('//*[@class="input-color" and @title="Black"]');
      this.tshirt_L_size = page.locator('//*[@title="L"]');
      this.tshirt_quantity = page.locator('//*[@name="qty"]');
      this.tshirt_add_cart = page.locator('//*[@data-button-action="add-to-cart"]');
      this.proceed_checkout_btn = page.locator('//*[text()="Proceed to checkout"]');
      this.shopping_cart = page.locator('//*[text()="Cart"]/following-sibling::span');
      this.user_address = page.locator('//*[@id="field-address1"]');
      this.user_city = page.locator('//*[@id="field-city"]');
      this.user_state_dropdown = page.locator('//*[@name="id_state"]');
      this.user_state_selection = page.locator('//*[text()="Alabama"]');
      this.user_postal_code = page.locator('//*[@id="field-postcode"]');
      this.confirm_address = page.locator('//*[@name="confirm-addresses"]');
      this.confirm_delivery = page.locator('//*[@name="confirmDeliveryOption"]');
      this.user_terms_condition = page.locator('//*[@name="conditions_to_approve[terms-and-conditions]"]');
      this.place_order_btn = page.locator('//*[@id="payment-confirmation"]/div/button');
      this.product_title_list = page.locator('//*[@class="h3 product-title"]');
      this.product_price_list = page.locator('//*[@aria-label="Price"]');
      this.tshirt_pop_up_name = page.locator('//h1[text()="Hummingbird printed t-shirt"]');
      this.product_adding_successful_message = page.locator('//*[text()="Product successfully added to your shopping cart"]');
      this.product_quantity_number = page.locator('//*[@name="product-quantity-spin"]');
      this.user_firstname = page.locator('//*[@name="firstname"]');
      this.user_lastname = page.locator('//*[@name="lastname"]');
      this.user_country_dropdown = page.locator('//*[@name="id_country"]');
      this.delivery_next_day = page.locator('//*[text()="Delivery next day!"]');
      this.total_price = page.locator('//*[@class="cart-summary-line cart-total"]/child::span[@class="value"]');



    }

    async user_login_back_office(){
        const url = 'https://venomous-tongue.demo.prestashop.com/admin-dev/index.php'
        
        //Validating Page Url
        await this.actions.expectURLToContain('front')
        await this.actions.click(this.explore_back_office)

        // Validate link has been changed to “Explore front office
        await this.actions.expectToBeVisible(this.explore_front_office)

        // Validating api and Loging in
        let frame = await this.actions.switchToFrame(this.iframe_selector)
        await frame.click(this.log_in)
        await this.actions.verifyApiStatusCode(url, 200)
        await this.actions.handleAlertIfPresent()

        // Validate it navigate to front office page
        await this.actions.click(this.explore_back_office)
        await this.actions.expectToBeVisible(this.explore_front_office)


        
        // Validate the page title
        await this.actions.expectTitleToBe('PrestaShop Live Demo')
        
        

        // Validate login page is getting displayed
        await this.actions.expectToBeVisible(this.create_acc)
        
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
        await actionsInFrame.expectToBeVisible(this.search_list_5_count)
        await actionsInFrame.click(this.pack_mug)

        // Validate breadcrumbs, price and dimension
        await actionsInFrame.expectToBeVisible(this.breadcrumbs_pack_mug)
        await actionsInFrame.expectToBeVisible(this.price_mug)
        await actionsInFrame.assertTextContains(actionsInFrame.getText(this.price_mug), '42')
        await actionsInFrame.expectToBeVisible(this.dimension_60_40)
    }

    async sort_filter(){
        let frame = await this.actions.switchToFrame(this.iframe_selector)
        const actionsInFrame_1 = new Actions(frame);
        await actionsInFrame_1.click(this.home_logo)

        // Validate ‘English’ Language is selected
        await this.actions.expectToBeVisible(this.english_lang_validation)

        // Validate breadcrums and product count
        frame = await this.actions.switchToFrame(this.iframe_selector)
        const actionsInFrame = new Actions(frame);
        await actionsInFrame.click(this.accessories_menu)
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
        const product_with_price = await actionsInFrame.getProductsFromSeparateLists(this.product_list_count, this.product_price_list)
        //validating the sort function
        await actionsInFrame.assertSortedByPriceAsc(product_with_price)
        //uploading the data in excel
        await actionsInFrame.logProductsToExcel(product_with_price, 'Item_list_excel')
    }

    async purchase_product(fname, lname, tshirt_total_price){
        let frame = await this.actions.switchToFrame(this.iframe_selector)
        const actionsInFrame_1 = new Actions(frame);
        await actionsInFrame_1.scrollIntoView(this.tshirt_name)
        await actionsInFrame_1.hover(this.tshirt_name)
        await actionsInFrame_1.click(this.tshirt_quick_view)

        // Validate pop up has text - Hummingbird printed t-shirt
        await actionsInFrame_1.expectToBeVisible(this.tshirt_pop_up_name)
        await actionsInFrame_1.click(this.tshirt_size)
        await actionsInFrame_1.hover(this.tshirt_L_size)
        await actionsInFrame_1.click(this.tshirt_L_size)
        await actionsInFrame_1.click(this.tshirt_black)
        await actionsInFrame_1.fill(this.tshirt_quantity,'5')
        await actionsInFrame_1.click(this.tshirt_add_cart)

        // Validate success message (“Product successfully added to your shopping cart”)
        await actionsInFrame_1.expectToBeVisible(this.product_adding_successful_message)
        await actionsInFrame_1.click(this.proceed_checkout_btn)

        // Validate cart has 5 products added
        await this.actions.expectToBeVisible(this.shopping_cart)
        await this.actions.assertTextContains(this.actions.getText(this.shopping_cart), '5')
        frame = await this.actions.switchToFrame(this.iframe_selector)
        const actionsInFrame = new Actions(frame);
        await actionsInFrame.click(this.proceed_checkout_btn)
        
        // Validat first and last Name is auto populated on Address form
        await actionsInFrame.assertTextContains(this.actions.getText(this.user_firstname), fname)
        await actionsInFrame.assertTextContains(this.actions.getText(this.user_lastname), lname)
        await actionsInFrame.fill(this.user_address, 'The address for tshirt is given here')
        await actionsInFrame.fill(this.user_city, 'City for Tshirt')
        await actionsInFrame.fill(this.user_postal_code, '35004')
        await actionsInFrame.click(this.user_state_dropdown)
        await actionsInFrame.click(this.user_state_selection)
        await actionsInFrame.scrollIntoView(this.confirm_address)
        await actionsInFrame.click(this.confirm_address)

        // Validate ‘Pick up in-store’ option is by default selected
        await actionsInFrame.expectToBeVisible(this.delivery_next_day)
        await actionsInFrame.click(this.confirm_delivery)

        // Validate total price should be €102
        await actionsInFrame.assertTextContains(this.actions.getText(this.total_price), tshirt_total_price)

        // Validate the following on Order confirmation screen - Failed Test case
        await actionsInFrame.assertElementEnabled(this.place_order_btn)
        

    }

  
  }
  
  module.exports = ProductPurchase;
