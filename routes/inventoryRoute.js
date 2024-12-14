// Needed Resources 

const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const { handleErrors } = require("../utilities");
const utilities = require("../utilities/index"); // Import utilities
const carValidate = require('../utilities/Inventory-validation');
const accountController = require("../controllers/accountController")
//const { carRegistrationRules, checkCarRegData } = require("./utilities/inventory-validation");

// Route to build inventory by classification view
router.get("/type/:classificationId", handleErrors(invController.buildByClassificationId));

// route to get inventory by class unit 6
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to display the edit inventory view for a specific inventory item
router.get('/edit/:inv_id', utilities.handleErrors(invController.editInventoryView));
console.log("Edit Inventory View route triggered with inv_id:");


// Route to handle inventory update
router.post("/update",
    accountController.checkAdminOrEmployee,
    carValidate.newInventoryRules(),  // Use the updated validation function
    carValidate.checkCarUpdateData,      // Use the existing checkUpdateData middleware
    utilities.handleErrors(invController.updateInventory)
);


// router.get("/type/:getCarDetail", invController.buildByCarDetail);
router.get("/detail/:invId", handleErrors(invController.buildByCarDetail));

router.get("", handleErrors(invController.buildManagementPage));
console.log("Management route has been registered");

router.get("/add-classification", handleErrors(invController.addClassification));
console.log("add classifiaction has been called.");

// Handle POST request to save classification (implement this functionality in the controller)
router.post(
    "/add-classification",
    accountController.checkAdminOrEmployee,
    handleErrors(invController.processClassification));

router.get('/add-inventory', handleErrors(invController.addInventory));
console.log("add inventory has been called.");

router.post(

    "/add-inventory",
    accountController.checkAdminOrEmployee,
    //handleErrors(carValidate.carRegistrationRules),
    //handleErrors(carValidate.checkCarRegData),
    handleErrors(invController.processCarInventory)

);
// route to delete
// Route to show the delete confirmation view
router.get("/delete/:inv_id", utilities.handleErrors(invController.showDeleteConfirmation));

// Route to handle the deletion of the inventory item
router.post("/delete/:inv_id",
    accountController.checkAdminOrEmployee,
    utilities.handleErrors(invController.deleteInventory));


//route for error
router.get("/error", handleErrors((req, res, next) => {
    throw new Error('intentional 500 error')
}))

module.exports = router;