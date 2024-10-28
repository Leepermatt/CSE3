const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

module.exports = { getClassifications }

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



async function getCarDetail(inv_id) {
    try {
        const carData = await pool.query(
            `SELECT public.inventory.inv_id as i FROM 
            public.inventory
            WHERE i = $1`,
            [inv_id]
        )
        return carData.rows
    } catch (error) {
        console.error("getCarDetail error " + error)
    }

}

module.exports = { getClassifications, getInventoryByClassificationId, getCarDetail };