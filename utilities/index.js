const invModel = require("../models/inventory-model");
const { link } = require("../routes/static");
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
// Util.getNav = async function (req, res, next) {

//     let data = await invModel.getClassifications()
//     let list = "<ul>"
//     list += '<li><a href="/" title="Home page">Home</a></li>'
//     data.rows.forEach((row) => {
//         list += "<li>"
//         list +=
//             '<a href="/inv/type/' +
//             row.classification_id +
//             '" title="See our inventory of ' +
//             row.classification_name +
//             ' vehicles">' +
//             row.classification_name +
//             "</a>"
//         list += "</li>"
//     })
//     list += "</ul>"
//     return list
// }

Util.getNav = async function () {
    try {
        // Attempt to retrieve classifications for navigation
        let data = await invModel.getClassifications();
        let list = "<ul>";
        list += '<li><a href="/" title="Home page">Home</a></li>';

        data.rows.forEach((row) => {
            list += "<li>";
            list +=
                '<a href="/inv/type/' +
                row.classification_id +
                '" title="See our inventory of ' +
                row.classification_name +
                ' vehicles">' +
                row.classification_name +
                "</a>";
            list += "</li>";
        });

        list += "</ul>";
        return list;
    } catch (err) {
        console.error("Error generating navigation:", err.message);
        // Throw the error to be handled by the Express error handler
        throw new Error("Failed to generate navigation");
    }
};



/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) {
    let grid
    if (data.length > 0) {
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id
                + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + 'details"><img src="' + vehicle.inv_thumbnail
                + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + ' on CSE Motors"></a>'
            grid += '<div class="namePrice">'
            grid += '<hr>'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
                + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
                + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$'
                + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/* **************************************
* Build the detail view HTML
* ************************************ */
Util.buildCarModelPage = async function (car) {
    let page = ''; // Initialize as an empty string

    if (car) { // Check if the car object is defined
        page += `<div id="car-detail">`;
        page += `<h2>${car.inv_make} ${car.inv_model}</h2>`;
        page += `<img src="${car.inv_image}" alt="Image of ${car.inv_make} ${car.inv_model} on CSE Motors">`;
        page += `<div class="price">`;
        page += `<span>$${new Intl.NumberFormat('en-US').format(car.inv_price)}</span>`;
        page += `</div>`;
        page += `<div class = "miles">`;
        page += `<span>${new Intl.NumberFormat('en-US').format(car.inv_miles) + " miles"}</span>`;
        page += `</div>`;
        page += `<div class="description">${car.inv_description}</div>`; // Assuming you have a description field
        page += `</div>`;
    } else {
        page += '<p class="notice">Sorry, no matching vehicle could be found.</p>';
    }

    return page;
}

/* **************************************
* Build the management view HTML
* ************************************ */
Util.getManagementPage = async function (link1, link2) {
    let linkContent = ''; // Initialize as an empty string

    if (link1 && link2) { // Check if both links are provided
        linkContent += `<div class="management-page">`;
        linkContent += `<h1>Management Page</h1>`;
        linkContent += `<ul>`;
        linkContent += `<li><a href="${link1.url}">${link1.text}</a></li>`;
        linkContent += `<li><a href="${link2.url}">${link2.text}</a></li>`;
        linkContent += `</ul>`;
        linkContent += `</div>`;
    } else {
        linkContent += `<p class="notice">Links are missing. Please provide valid links for the management page.</p>`;
    }

    return linkContent; // Return the generated HTML
};
Util.messages = async function (req) {
    const notice = req.flash('notice');
    if (notice && notice.length > 0) {
        return notice.map(msg => `<p class="alert alert-infor">${message}</p>`).join('');

    }
    return '';
}
Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
        '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
        classificationList += '<option value="' + row.classification_id + '"'
        if (
            classification_id != null &&
            row.classification_id == classification_id
        ) {
            classificationList += " selected "
        }
        classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util