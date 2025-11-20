import {Builder, By, until, Key} from "selenium-webdriver";
import { expect } from "chai";

let driver;
describe("User Login and Navigation", () => {
    before(async () => {
        driver = new Builder().forBrowser("chrome").build();
        await driver.get('http://localhost:3000/login/')
        console.log("Page loaded");
    })

    it("Home button click at login", async() => {
        let homeButton = await driver.findElement(By.xpath("//a[contains(text(),'Home')]"));
        await homeButton.click();
        await driver.wait(until.urlContains('/login'), 10000); // waits up to 10 seconds
    });
    // Test that the login page loads correctly
    it("Login page loads", async() => {
        let element = await driver.findElement(By.css('h5.MuiTypography-root.MuiTypography-h5.MuiTypography-gutterBottom'));
        let title = await element.getText();
        expect(title).to.equal("Login");
    });

    it("Invalid Enail Login", async() => {
        const emailField = await driver.findElement(By.xpath('//input[@class="MuiInputBase-input MuiOutlinedInput-input css-16wblaj-MuiInputBase-input-MuiOutlinedInput-input" and @type="text"]'));
        const passwordField = await driver.findElement(By.xpath('//input[@class="MuiInputBase-input MuiOutlinedInput-input css-16wblaj-MuiInputBase-input-MuiOutlinedInput-input" and @type="password"]'));
        let loginButton = await driver.findElement(By.xpath("//button[contains(text(),'Login')]"));

        await emailField.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);
        await passwordField.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);
        await emailField.sendKeys("hacker@example.com");
        await passwordField.sendKeys("password123");
        await loginButton.click();

        // Wait for alert
        const alert = await driver.wait(until.alertIsPresent(), 5000);
        const alertText = await alert.getText();

        expect(alertText).to.include('Invalid login credentials');
        await alert.accept();
    });
    it("Invalid Password Login", async() => {
        const emailField = await driver.findElement(By.xpath('//input[@class="MuiInputBase-input MuiOutlinedInput-input css-16wblaj-MuiInputBase-input-MuiOutlinedInput-input" and @type="text"]'));
        const passwordField = await driver.findElement(By.xpath('//input[@class="MuiInputBase-input MuiOutlinedInput-input css-16wblaj-MuiInputBase-input-MuiOutlinedInput-input" and @type="password"]'));
        let loginButton = await driver.findElement(By.xpath("//button[contains(text(),'Login')]"));

        await emailField.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);
        await passwordField.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);

        await emailField.sendKeys("john.doe@example.com");
        await passwordField.sendKeys("wrongpassword");
        await loginButton.click();
        // Wait for alert
        const alert = await driver.wait(until.alertIsPresent(), 5000);
        const alertText = await alert.getText();
        expect(alertText).to.include('Invalid login credentials'); 
        await alert.accept();
    });


    // Test that the login form works
    it("Valid Login", async() => {
        const emailField = await driver.findElement(By.xpath('//input[@class="MuiInputBase-input MuiOutlinedInput-input css-16wblaj-MuiInputBase-input-MuiOutlinedInput-input" and @type="text"]'));
        const passwordField = await driver.findElement(By.xpath('//input[@class="MuiInputBase-input MuiOutlinedInput-input css-16wblaj-MuiInputBase-input-MuiOutlinedInput-input" and @type="password"]'));
        let loginButton = await driver.findElement(By.xpath("//button[contains(text(),'Login')]"));

        await emailField.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);
        await passwordField.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);

        await emailField.sendKeys("john.doe@example.com");
        await passwordField.sendKeys("password123");
        await loginButton.click();

        let logoutButton = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(),'Logout')]")), 10000);
        let logoutButtonText = await logoutButton.getText();
        expect(logoutButtonText).to.equal("LOGOUT");
        console.log("Login successful");
        const currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).to.equal("http://localhost:3000/");
    });


    it("Home button click", async() => {
        let homeButton = await driver.findElement(By.xpath("//a[contains(text(),'Home')]"));
        await homeButton.click();
        const currentUrl = await driver.getCurrentUrl();
        await driver.wait(until.urlContains('/'), 10000); // waits up to 10 seconds
    });

    it("RSVP button click", async() => {
        const eventCards = await driver.findElements(By.css('div.MuiGrid-item')); // Get all event cards
        let rsvpButton;
        let targetCard;

        for (const card of eventCards) {
        try {
            // Find the RSVP button within the card (text = "RSVP")
            rsvpButton = await card.findElement(By.xpath('.//button[normalize-space()="RSVP"]'));
            targetCard = card; // Save the card for later validation
            break; // Exit loop once the first eligible button is found
        } catch (err) {
            // Button not found in this card; continue searching
        }
        }

        if (rsvpButton) {
            await rsvpButton.click();
            const confirmationText = await targetCard.findElement(By.xpath('//p[@class="MuiTypography-root MuiTypography-body2 css-1mdbx3m-MuiTypography-root"]'));
            const text = await confirmationText.getText();
            expect(text).to.include("You have RSVPed to this event.");
        }
        else {
        console.log('RSVP button not found on the page.');
        }
    });

    it("Logout button click", async() => {
        let logoutButton = await driver.findElement(By.xpath("//button[contains(text(),'Logout')]"));
        await logoutButton.click();
        const currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).to.equal("http://localhost:3000/login");
    });

    after(async () => {
        await driver.quit();
    }) 
});

describe("User Registration", () => {
    before(async () => {
        driver = new Builder().forBrowser("chrome").build();
        await driver.get('http://localhost:3000/login')
        console.log("Page loaded");
    })

    it("Register Button click", async() => {
        let registerButton = await driver.findElement(By.xpath("//a[contains(text(),'Register')]"));
        await registerButton.click();
        const currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).to.equal("http://localhost:3000/register");
    });

    it("Register Valid User", async() => {
        const usernameField = await driver.findElement(By.id('username'));
        const emailField = await driver.findElement(By.id('email'));
        const passwordField = await driver.findElement(By.id('password'));
        const confirmPasswordField = await driver.findElement(By.id('confirmPassword'));
        const registerButton = await driver.findElement(By.xpath("//button[contains(text(),'Register')]"));
        await usernameField.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);
        await emailField.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);
        await passwordField.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);
        await confirmPasswordField.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);

        const randomNum = Math.floor(Math.random() * 100000);
        await usernameField.sendKeys("testuser" + randomNum);
        await emailField.sendKeys("testuser" + randomNum + "@example.com");
        await passwordField.sendKeys("password123");
        await confirmPasswordField.sendKeys("password123");
        await registerButton.click();

        // Redirect to login page
        const currentUrl = await driver.getCurrentUrl();
        await driver.wait(until.urlContains('/login'), 10000);
        console.log("Registration successful");
    });
    it("Register Invalid Short passeord", async() => {
        let registerationButton = await driver.findElement(By.xpath("//a[contains(text(),'Register')]"));
        await registerationButton.click();
        const currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).to.equal("http://localhost:3000/register");
        const usernameField = await driver.findElement(By.id('username'));
        const emailField = await driver.findElement(By.id('email'));
        const passwordField = await driver.findElement(By.id('password'));
        const confirmPasswordField = await driver.findElement(By.id('confirmPassword'));
        const registerButton = await driver.findElement(By.xpath("//button[contains(text(),'Register')]"));
        await usernameField.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);
        await emailField.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);
        await passwordField.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);
        await confirmPasswordField.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);

        const randomNum = Math.floor(Math.random() * 100000);
        await usernameField.sendKeys("testuser");
        await emailField.sendKeys("testuser" + randomNum + "@example.com");
        await passwordField.sendKeys("pass");
        await confirmPasswordField.sendKeys("pass");
        await registerButton.click();

        // Wait for error banner
        const errorBanner = await driver.wait(until.elementLocated(By.xpath('//div[contains(@class, "error-banner")]')),5000 );
        const errorText = await errorBanner.getText();
        expect(errorText).to.include("Password must be at least 8 characters long!");

    });
    it("Register Invalid Missing Fields", async() => {
        let registerationButton = await driver.findElement(By.xpath("//a[contains(text(),'Register')]"));
        await registerationButton.click();
        const currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).to.equal("http://localhost:3000/register");
        const usernameField = await driver.findElement(By.id('username'));
        const emailField = await driver.findElement(By.id('email'));
        const passwordField = await driver.findElement(By.id('password'));
        const confirmPasswordField = await driver.findElement(By.id('confirmPassword'));
        const registerButton = await driver.findElement(By.xpath("//button[contains(text(),'Register')]"));
        await usernameField.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);
        await emailField.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);
        await passwordField.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);
        await confirmPasswordField.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);

        const randomNum = Math.floor(Math.random() * 100000);
        // await usernameField.sendKeys("testuser" + randomNum);
        await emailField.sendKeys("testuser" + randomNum + "@example.com");
        await passwordField.sendKeys("password123");
        await confirmPasswordField.sendKeys("password123");
        await registerButton.click();

        // Wait for error banner
        const errorBanner = await driver.wait(until.elementLocated(By.xpath('//div[contains(@class, "error-banner")]')),5000 );
        const errorText = await errorBanner.getText();
        expect(errorText).to.include("Username field is required!");

        await usernameField.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);
        await emailField.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);
        await passwordField.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);
        await confirmPasswordField.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);
        await usernameField.sendKeys("testuser" + randomNum);
        // await emailField.sendKeys("testuser" + randomNum + "@example.com");
        await passwordField.sendKeys("password123");
        await confirmPasswordField.sendKeys("password123");
        await registerButton.click();
        // Wait for error banner
        const errorBanner2 = await driver.wait(until.elementLocated(By.xpath('//div[contains(@class, "error-banner")]')),5000 );
        const errorText2 = await errorBanner2.getText();
        expect(errorText2).to.include("Email field is required!");


        await usernameField.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);
        await emailField.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);
        await passwordField.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);
        await confirmPasswordField.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);
        await usernameField.sendKeys("testuser" + randomNum);
        await emailField.sendKeys("testuser" + randomNum + "@example.com");
        // await passwordField.sendKeys("password123");
        await confirmPasswordField.sendKeys("password123");
        await registerButton.click();
        // Wait for error banner
        const errorBanner3 = await driver.wait(until.elementLocated(By.xpath('//div[contains(@class, "error-banner")]')),5000 );
        const errorText3 = await errorBanner3.getText();
        expect(errorText3).to.include("Password field is required!");
    });
    it("Register Invalid Passwords do not match", async() => {
        let registerationButton = await driver.findElement(By.xpath("//a[contains(text(),'Register')]"));
        await registerationButton.click();
        const currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).to.equal("http://localhost:3000/register");
        const usernameField = await driver.findElement(By.id('username'));
        const emailField = await driver.findElement(By.id('email'));
        const passwordField = await driver.findElement(By.id('password'));
        const confirmPasswordField = await driver.findElement(By.id('confirmPassword'));
        const registerButton = await driver.findElement(By.xpath("//button[contains(text(),'Register')]"));
        await usernameField.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);
        await emailField.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);
        await passwordField.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);
        await confirmPasswordField.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);

        const randomNum = Math.floor(Math.random() * 100000);
        await usernameField.sendKeys("testuser" + randomNum);
        await emailField.sendKeys("testuser" + randomNum + "@example.com");
        await passwordField.sendKeys("password123");
        await confirmPasswordField.sendKeys("password1234");
        await registerButton.click();

        // Wait for error banner
        const errorBanner = await driver.wait(until.elementLocated(By.xpath('//div[contains(@class, "error-banner")]')),5000 );
        const errorText = await errorBanner.getText();
        expect(errorText).to.include("asswords don\'t match!");
    });
    after(async () => {
        await driver.quit();
    });

});

describe("Admin event creation and deletion.", () => {
    before(async () => {
        driver = new Builder().forBrowser("chrome").build();
        await driver.get('http://localhost:3000/login')
        console.log("Page loaded");
        const emailField = await driver.findElement(By.xpath('//input[@class="MuiInputBase-input MuiOutlinedInput-input css-16wblaj-MuiInputBase-input-MuiOutlinedInput-input" and @type="text"]'));
        const passwordField = await driver.findElement(By.xpath('//input[@class="MuiInputBase-input MuiOutlinedInput-input css-16wblaj-MuiInputBase-input-MuiOutlinedInput-input" and @type="password"]'));
        let loginButton = await driver.findElement(By.xpath("//button[contains(text(),'Login')]"));

        await emailField.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);
        await passwordField.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);

        await emailField.sendKeys("admin_test1@example.com");
        await passwordField.sendKeys("admin123");
        await loginButton.click();
    })

    it("Logged In as admin", async() => {
        let dashboardButton = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(),'Dashboard')]")), 10000);
        let dashboardButtonText = await dashboardButton.getText();
        expect(dashboardButtonText).to.equal("DASHBOARD");
    });

    it("Create Event", async() => {
        let dashboardButton = await driver.findElement(By.xpath("//a[contains(text(),'Dashboard')]"));
        await dashboardButton.click();
        const currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).to.equal("http://localhost:3000/dashboard");
        const eventNameField = await driver.findElement(By.xpath('//input[@name="name"]'));
        const eventDescriptionField = await driver.findElement(By.xpath('//textarea[@name="description"]'));
        const eventDateField = await driver.findElement(By.xpath('//input[@name="date"]'));
        const eventTimeField = await driver.findElement(By.xpath('//input[@name="time"]'));
        const eventLocationField = await driver.findElement(By.xpath('//input[@name="location"]'));
        const createEventButton = await driver.findElement(By.xpath("//button[contains(text(),'Create Event')]"));

        await eventNameField.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);
        await eventDescriptionField.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);
        await eventDateField.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);
        await eventTimeField.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);
        await eventLocationField.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);

        await eventNameField.sendKeys("Test Event");
        await eventDescriptionField.sendKeys("This is a test event.");
        await eventDateField.sendKeys("03122023");
        await eventTimeField.sendKeys("1200pm");
        await eventLocationField.sendKeys("Test Location");
        await createEventButton.click();
        await driver.wait(until.urlContains('/'), 10000);

    });

    it("Delete Event", async() => {
        //go to home
        let homeButton = await driver.findElement(By.xpath("//a[contains(text(),'Home')]"));
        await homeButton.click();
        let eventCards = await driver.findElements(By.css('div.MuiGrid-item')); // Get all event cards
        let deleteButton;
        let targetCard;
        console.log(eventCards.length);
        for (const card of eventCards) {
            try {
                // Find the RSVP button within the card (text = "RSVP")
                deleteButton = await card.findElement(By.xpath('//button[normalize-space()="Delete"]'));
                targetCard = card; // Save the card for later validation
                break; // Exit loop once the first eligible button is found
            } catch (err) {
                // Button not found in this card; continue searching
            }
        }

        if (deleteButton) {
            await deleteButton.click();
            const confirmationText = await targetCard.findElement(By.xpath('//p[@class="MuiTypography-root MuiTypography-body2 css-1mdbx3m-MuiTypography-root"]'));
            const text = await confirmationText.getText();
            expect(text).to.include("You have deleted this event.");
        }
        else {
            console.log('No Events found on the page.');
        }
    });
    after(async () => {
        await driver.quit();
    });
        
});