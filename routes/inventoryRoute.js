// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController");
const { handleErrors } = require("../utilities");

// Route to build inventory by classification view
router.get("/type/:classificationId", handleErrors(invController.buildByClassificationId));


// router.get("/type/:getCarDetail", invController.buildByCarDetail);
router.get("/detail/:invId", handleErrors(invController.buildByCarDetail));

router.get("", handleErrors(invController.buildManagementPage));
console.log("Management route has been registered");

router.get("/add-classification", handleErrors(invController.addClassification));
console.log("add classifiaction has been called.");

// Handle POST request to save classification (implement this functionality in the controller)
router.post(
    "/add-classification",

    handleErrors(invController.processClassification));

router.get('/add-inventory', handleErrors(invController.addInventory));
console.log("add inventory has been called.");

router.post(
    "/add-inventory",
    invController.processClassification
)
//route for error
router.get("/error", handleErrors((req, res, next) => {
    throw new Error('intentional 500 error')
}))

module.exports = router;