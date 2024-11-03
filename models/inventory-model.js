const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}
// this is onld code that worked
// module.exports = { getClassifications }

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
            [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error("getclassificationsbyid error " + error)
    }
}


/* ***************************
 *  Get car details by inventory ID
 * ************************** */
async function getCarDetail(inv_id) {
    // Check if inv_id is defined and is an integer
    if (!inv_id || isNaN(parseInt(inv_id))) {
        console.error("Invalid inv_id:", inv_id);  // Log the inv_id if invalid
        return [];  // Return an empty result to avoid querying with invalid id
    }

    try {
        // Convert inv_id to an integer to ensure it matches the database type
        const carData = await pool.query(
            `SELECT * FROM public.inventory WHERE inv_id = $1`,
            [parseInt(inv_id)]
        );
        return carData.rows
    } catch (error) {
        console.error("getCarDetail error " + error)
        return []; // Return an empty array on error
    }

}

module.exports = { getClassifications, getInventoryByClassificationId, getCarDetail };