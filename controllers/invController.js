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
/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const itemDataArray = await invModel.getCarDetail(inv_id);
    const itemData = itemDataArray[0]; // Access the first element
    //const itemData = await invModel.getCarDetail(inv_id)
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)

    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    console.log("Rendering edit-inventory view with data:", itemData);
    res.render("./inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationSelect: classificationSelect,
        errors: null,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_description: itemData.inv_description,
        inv_image: itemData.inv_image,
        inv_thumbnail: itemData.inv_thumbnail,
        inv_price: itemData.inv_price,
        inv_miles: itemData.inv_miles,
        inv_color: itemData.inv_color,
        classification_id: itemData.classification_id
    })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const {
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id,
    } = req.body
    const updateResult = await invModel.updateInventory(
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id
    )

    if (updateResult) {
        const itemName = updateResult.inv_make + " " + updateResult.inv_model
        req.flash("notice", `The ${itemName} was successfully updated.`)
        res.redirect("/inv/")
    } else {
        const classificationSelect = await utilities.buildClassificationList(classification_id)
        const itemName = `${inv_make} ${inv_model}`
        req.flash("notice", "Sorry, the insert failed.")
        res.status(501).render("inventory/edit-inventory", {
            title: "Edit " + itemName,
            nav,
            classificationSelect: classificationSelect,
            errors: null,
            inv_id,
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
        })
    }
}


module.exports = invCont



