const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validateCar = {}


/*  **********************************
*   Car Registration Data Validation Rules
* ********************************* */
validateCar.carRegistrationRules = () => {
    return [
        // inv make is required and must be string
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a make of the car."), // on error this message is sent.

        // inv model is required and must be string
        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a model of the car."), // on error this message is sent.
        // year is requried and is a 4 digit number
        body("inv_year")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Year is required.")
            .isInt({ min: 1000, max: 9999 })
            .withMessage("Please provide the 4-digit year."),

        // inv description is required and must be string
        body("inv_description")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a description of the car."), // on error this message is sent.    


        // Validate inv_image
        body("inv_image")
            .custom((value, { req }) => {
                req.body.inv_thumbnail = "/images/no-image.png"; // Set a default value
                return true;
            })
            .withMessage("Image is required."),


        // Validate inv_thumbnail
        body("inv_thumbnail")
            .custom((value, { req }) => {
                req.body.inv_thumbnail = "/images/no-image-tn.png"; // Set a default value
                return true;
            })
            .withMessage("Thumbnail is required."),
        // price
        body("inv_price")
            .trim()
            .escape()
            .notEmpty()
            .isFloat({ min: 0.01 })
            .withMessage("Please provide a valid price greater than 0."),
        // miles
        body("inv_miles")
            .trim()
            .escape()
            .notEmpty()
            .isInt({ min: 0 })
            .withMessage("Please provide a valid mileage (must be a non-negative number)."),

        body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 3, max: 20 })
            .matches(/^[a-zA-Z\s]+$/)
            .withMessage("Color must contain only letters and spaces."),


    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validateCar.checkCarRegData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_thumbnail, inv_image, inv_mileage, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/management", {
            errors,
            title: "Management",
            nav,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_thumbnail,
            inv_image,
            inv_mileage,
            inv_color

        })
        return
    }
    next()
}

/* ******************************
 * Check data and return errors or continue to edit
 * ***************************** */
validateCar.checkCarUpdateData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_thumbnail, inv_image, inv_mileage, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const itemName = `${itemData.inv_make} ${itemData.inv_model}`
        res.render("inventory/edit/:inv_id'", {
            errors,
            title: "Edit " + itemName,
            nav,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_thumbnail,
            inv_image,
            inv_mileage,
            inv_color,
            inv_id

        })
        return
    }
    next()
}

/*  **********************************
*   Car Registration Data Validation Rules
* ********************************* */
validateCar.newInventoryRules = () => {
    return [
        // inv make is required and must be string
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a make of the car."), // on error this message is sent.

        // inv model is required and must be string
        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a model of the car."), // on error this message is sent.
        // year is requried and is a 4 digit number
        body("inv_year")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Year is required.")
            .isInt({ min: 1000, max: 9999 })
            .withMessage("Please provide the 4-digit year."),

        // inv description is required and must be string
        body("inv_description")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a description of the car."), // on error this message is sent.    


        // Validate inv_image
        body("inv_image")
            .custom((value, { req }) => {
                req.body.inv_thumbnail = "/images/no-image.png"; // Set a default value
                return true;
            })
            .withMessage("Image is required."),


        // Validate inv_thumbnail
        body("inv_thumbnail")
            .custom((value, { req }) => {
                req.body.inv_thumbnail = "/images/no-image-tn.png"; // Set a default value
                return true;
            })
            .withMessage("Thumbnail is required."),
        // price
        body("inv_price")
            .trim()
            .escape()
            .notEmpty()
            .isFloat({ min: 0.01 })
            .withMessage("Please provide a valid price greater than 0."),
        // miles
        body("inv_miles")
            .trim()
            .escape()
            .notEmpty()
            .isInt({ min: 0 })
            .withMessage("Please provide a valid mileage (must be a non-negative number)."),

        body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 3, max: 20 })
            .matches(/^[a-zA-Z\s]+$/)
            .withMessage("Color must contain only letters and spaces."),

        // Validate inv_id (check if it exists and is a valid number)
        body("inv_id")
            .exists().withMessage("Inventory ID is required.")
            .isInt().withMessage("Inventory ID must be a valid integer."),
    ]
}
module.exports = validateCar

