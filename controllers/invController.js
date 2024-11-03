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
    })
}
invCont.buildByCarDetail = async function (req, res, next) {
    // Log to verify the function is being called
    console.log("buildByCarDetail function called");

    // Log to check if the route receives the invId parameter
    console.log("Received invId:", req.params.invId);
    const inv_id = req.params.invId
    const carData = await invModel.getCarDetail(inv_id)
    // Check if carData has any result
    if (!carData || carData.length === 0) {
        return res.status(404).send("Car not found");
    }
    const vehicle = carData[0]; // Assuming you want the first item from the result
    const page = await utilities.buildCarModelPage(carData)
    let nav = await utilities.getNav()
    // const carName = carData[0]?.car_name || "Vehicle Details"
    res.render("./inventory/detail", {
        title: `${vehicle.inv_make} ${vehicle.inv_model}`,
        nav,
        page,
    })
}

module.exports = invCont

//buildbycardetail

