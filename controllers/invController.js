const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
        errors: null,
    })
}
/* *******************
*  build by car detail
* ******************** */
invCont.buildNewCarDetail = async function (req, res, next) {
    try {
        let nav = await utilities.getNav(); // Build the navigation
        res.render("./inventory/new-car-detail", {
            title: "Create New Car Detail",
            nav,
            errors: null,
            inv_make: "",
            inv_model: "",
            inv_year: "",
            inv_description: "",
            inv_price: "",
            inv_miles: "",
            inv_color: "",
        });
    } catch (error) {
        console.error("Error rendering new car detail view:", error);
        next(error); // Pass the error to the global error handler
    }
};



invCont.buildByCarDetail = async function (req, res, next) {
    const inv_id = req.params.invId
    // Log to verify the function is being called
    console.log("buildByCarDetail function called");

    // Log to check if the route receives the invId parameter
    console.log("Received invId:", req.params.invId);

    const carData = await invModel.getCarDetail(inv_id)
    // Check if carData has any result
    if (!carData || carData.length === 0) {
        return res.status(404).send("Car not found");
    }
    const vehicle = carData[0]; // Assuming you want the first item from the result
    console.log(carData[0])
    const page = await utilities.buildCarModelPage(vehicle)
    let nav = await utilities.getNav()
    // const carName = carData[0]?.car_name || "Vehicle Details"
    res.render("./inventory/detail", {
        title: `${vehicle.inv_make} ${vehicle.inv_model}`,
        nav,
        page,
        errors: null,
    })
}
/* *******************
*  build management page
* ******************** */
invCont.buildManagementPage = async function (req, res, next) {
    //console.log("build management page called");
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList();

    res.render("inventory/management", {
        title: "Management",
        nav,
        //messages: req.flash(), // Pass flash messages to the view
        classificationList,
        errors: null,
    });
};

/* *******************
*  build classification page
* ******************** */
invCont.addClassification = async function (req, res, next) {
    console.log("build classification page called");
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
        //messages: req.flash(), // Pass flash messages to the view
        errors: null,
    });
};

/* ****************************************
*  Process Classification
* *************************************** */
invCont.processClassification = async function (req, res) {
    console.log("process classification page called");
    let nav = await utilities.getNav()
    const { classification_name } = req.body

    const classResults = await invModel.registerClassification(
        classification_name
    )
    if (classResults) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${classification_name}. It has been stored in the database.`


        )
        res.status(201).render("inventory/management", {
            title: "Management",
            nav,
            errors: null
        })


    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("inventory/add-classification", {
            title: "Add Classification",
            nav,
            errors: null
        })
    }
}
/* *******************
*  build new inventory page
* ******************** */
invCont.addInventory = async function (req, res, next) {
    console.log("build inventory page called");
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList() // Fetch classification dropdown

    res.render("inventory/add-inventory", {
        title: "Add New Inventory",
        nav,
        classificationList,

        errors: null,
    });
};

/* *******************
*   process new inventory page
* ******************** */
invCont.processCarInventory = async function (req, res) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList() // Fetch classification dropdown

    const {
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    } = req.body

    const regResult = await invModel.registerInventory(
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    )

    if (regResult) {
        req.flash(
            "notice",
            `Success! The ${inv_make} ${inv_model} has been added to inventory.`
        )
        res.status(201).render("inventory/management", {
            title: "Inventory Management",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, adding the vehicle to inventory failed.")
        res.status(501).render("inventory/add-inventory", {
            title: "Add New Inventory",
            nav,
            classificationList, // Pass classification dropdown back to the form
            messages: req.flash(), // Pass flash messages to the view
            errors: null,
        })
    }
}


module.exports = invCont



