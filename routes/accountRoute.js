// Needed Resources 
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController"); // Account controller to handle route logic
const utilities = require("../utilities/index"); // Import utilities


//router.get("/login", accountController.buildLogin);
// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

//router.get("/register", accountController.buildRegister)
router.get("/register", utilities.handleErrors(accountController.buildRegister))
/// new route
router.post('/register', utilities.handleErrors(accountController.registerAccount))

module.exports = router;