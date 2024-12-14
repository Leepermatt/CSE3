const pool = require("../database/index")


/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
    try {
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
        return error.message
    }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail(account_email) {
    try {
        const result = await pool.query(
            'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
            [account_email])
        return result.rows[0]
    } catch (error) {
        return new Error("No matching email found")
    }
}
async function checkExistingEmail(account_email) {
    try {
        const sql = "SELECT * FROM account WHERE account_email = $1"
        const email = await pool.query(sql, [account_email])
        return email.rowCount
    } catch (error) {
        return error.message
    }
}

/* ****************************************
 * Update account information
 **************************************** */
async function updateAccount(account_id, account_firstname, account_lastname, account_email, account_password, account_type) {
    try {
        const sql = `
            UPDATE account
            SET account_firstname = $1, account_lastname = $2, account_email = $3, account_password = $4, account_type = $5
            WHERE account_id = $6
            RETURNING *
        `
        const result = await pool.query(sql, [account_id, account_firstname, account_lastname, account_email, account_password, account_type])
        return result.rows[0]
    } catch (error) {
        console.error("Error updating account:", error)

    }
}

/* ****************************************
 * Update account information
 **************************************** */
async function getAccountById(account_id) {
    try {
        const result = await pool.query(
            'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1',
            [account_id]
        )
        return result.rows[0] // Return the first row if found
    } catch (error) {
        console.error("Error fetching account by ID:", error)
        throw new Error("No matching account found")
    }
}

module.exports = { registerAccount, getAccountByEmail, checkExistingEmail, updateAccount, getAccountById };