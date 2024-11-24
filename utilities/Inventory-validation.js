const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validateCar = {}


validateCar.carRegistationRules = () => {
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



