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
    const inv_id = req.params.invId
    const carData = await invCar.getCarDetail(inv_id)
    const page = await utilities.buildCarModelPage(carData)
    let nav = await utilities.getNav()
    const carName = data[0].car_name
    res.render("./inventory/", {
        title: carName,
        nav,
        page,
    })
}

module.exports = invCont

//buildbycardetail

