
const utilities = require("../utilities/index")
const bcrypt = require("bcryptjs")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}


/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {

    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}


/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const {
        account_firstname,
        account_lastname,
        account_email,
        account_password
    } = req.body

    //Hash the password before storing
    let hashedPassword
    try {
        //regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        //account_password
        hashedPassword
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
        })
    }
}

/* ****************************************
 *   login access
 * ************************************ */

async function buildAccountManagement(req, res, next) {
    try {
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList();
        res.render("inventory/management", {
            title: "Account Management",
            message: "You're logged in",
            nav,
            classificationList,

        });
    } catch (error) {
        console.error("Error rendering account management view:", error);
        res.status(500).send("Internal Server Error");
    }
};

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
    let nav = await utilities.getNav();
    const { account_email, account_password } = req.body;

    // Fetch account data by email
    const accountData = await accountModel.getAccountByEmail(account_email);
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.");
        return res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        });
    }

    try {
        // Compare passwords
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            // Remove sensitive data
            delete accountData.account_password;

            // Check if account_type is present
            if (!accountData.account_type) {
                console.error("Missing account_type in accountData:", accountData);
                throw new Error("Account type missing. Please contact support.");
            }

            // Create payload explicitly
            const payload = {
                account_id: accountData.account_id,
                account_firstname: accountData.account_firstname,
                account_lastname: accountData.account_lastname,
                account_email: accountData.account_email,
                account_type: accountData.account_type, // Ensure this is included
            };

            // Create JWT token
            const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 });

            // Set cookie
            const cookieOptions = { httpOnly: true, maxAge: 3600 * 1000 };
            if (process.env.NODE_ENV !== 'development') {
                cookieOptions.secure = true; // Add secure flag in production
            }
            res.cookie("jwt", accessToken, cookieOptions);

            return res.redirect("/account");
        } else {
            req.flash("notice", "Incorrect password. Please try again.");
            return res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email,
            });
        }
    } catch (error) {
        console.error("Login Error:", error);
        req.flash("notice", "An unexpected error occurred. Please try again.");
        return res.status(500).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        });
    }
}


async function logout(req, res) {
    // Destroy session data
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err)
            res.status(500).send("Could not log out.")
        } else {
            // Clear the JWT cookie
            res.clearCookie("jwt")

            // Redirect to home page
            res.redirect("/")
        }
    })
}

/* ****************************************
 * Deliver account update view
 **************************************** */
// async function buildAccountUpdate(req, res) {
//     const nav = await utilities.getNav()
//     res.render("account/update", {
//         title: "Update Account Information",
//         nav,
//         user: req.user, // Pass the authenticated user's data
//         errors: null
//     })
// }
const buildAccountUpdate = async (req, res) => {
    let nav = await utilities.getNav()

    try {
        // Populate form with account info
        const accountData = await accountModel.getAccountById(req.user.account_id)
        if (!accountData) {
            req.flash("notice", "Account information not found.")
            return res.redirect("/account/login")
        }

        res.render("account/update", {
            title: "Account Update",
            nav,
            errors: null,
            locals: {
                account_firstname: accountData.account_firstname,
                account_lastname: accountData.account_lastname,
                account_email: accountData.account_email,
            },
        })
    } catch (error) {
        console.error("Error fetching account info:", error)
        req.flash("notice", "An unexpected error occurred. Please try again.")
        res.redirect("/account/update")
    }
}

/* ****************************************
 * Process account update
 **************************************** */
async function updateAccount(req, res) {
    const { account_firstname, account_lastname, account_email, account_password, accouunt_type } = req.body
    const account_id = req.user.account_id
    let nav = await utilities.getNav()

    try {
        // Update the user's information in the database
        const updateResult = await accountModel.updateAccount(
            account_id,
            account_firstname,
            account_lastname,
            account_email,
            account_password,
            accouunt_type
        )

        if (updateResult) {
            req.flash("notice", "Account information updated successfully.")
            res.redirect("/account")
        } else {
            req.flash("notice", "Error updating account. Please try again.")
            res.status(500).render("account/update", {
                title: "Update Account Information",
                nav,
                user: req.user,
                errors: null
            })
        }
    } catch (error) {
        req.flash("notice", "There was an issue updating the account.")
        res.status(500).render("account/update", {
            title: "Update Account Information",
            nav,
            user: req.user,
            errors: null
        })
    }
}

/* ****************************************
 * Process update password
 **************************************** */
async function changePassword(req, res) {
    let nav = await utilities.getNav()
    const { current_password, new_password, confirm_password } = req.body
    const userId = req.user.account_id

    try {
        const accountData = await accountModel.getAccountById(userId)

        // Check if the user exists
        if (!accountData) {
            req.flash("notice", "Account not found. Please log in again.")
            return res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: null,
            })
        }

        // Verify current password
        if (!await bcrypt.compare(current_password, accountData.account_password)) {
            req.flash("notice", "Current password is incorrect.")
            return res.status(400).render("account/change-password", {
                title: "Change Password",
                nav,
                locals: { current_password, new_password, confirm_password },
            })
        }

        // Verify new password and confirmation match
        if (new_password !== confirm_password) {
            req.flash("notice", "New password and confirmation do not match.")
            return res.status(400).render("account/change-password", {
                title: "Change Password",
                nav,
                locals: { current_password, new_password, confirm_password },
            })
        }

        // Hash and update the new password
        const hashedPassword = await bcrypt.hash(new_password, 10)
        const updateResult = await accountModel.updatePassword(userId, hashedPassword)

        if (updateResult) {
            req.flash("notice", "Password updated successfully.")
            return res.redirect("/account/manage")
        } else {
            req.flash("notice", "Error updating password. Please try again.")
            return res.status(500).render("account/change-password", {
                title: "Change Password",
                nav,
                locals: { current_password, new_password, confirm_password },
            })
        }
    } catch (error) {
        console.error("Error changing password:", error)
        req.flash("notice", "An unexpected error occurred. Please try again later.")
        return res.status(500).render("account/update", {
            title: "Change Password",
            nav,
            locals: { current_password, new_password, confirm_password },
        })
    }
}

/* ****************************************
 * checkLoginStatus to see if logged in
 **************************************** */
function checkLoginStatus(req, res, next) {
    const token = req.cookies.jwt; // Get the JWT token from cookies
    if (token) {

        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.user = decoded; // Store user data in request object
            res.locals.userLoggedIn = true; // Set userLoggedIn flag
            res.locals.userName = decoded.account_firstname || 'Guest'; // Optionally, set userName
            res.locals.userType = decoded.account_type; // Add account_type to locals
        } catch (error) {
            res.locals.userLoggedIn = false;
            res.locals.userName = 'Guest';
        }
    } else {
        res.locals.userLoggedIn = false;
        res.locals.userName = 'Guest';
    }
    next();
}
// function checkLoginStatus(req, res, next) {
//     const token = req.cookies.jwt
//     if (!token) {
//         req.user = null
//         return next()
//     }

//     try {
//         const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
//         req.user = user // Attach user data to the request
//         next()
//     } catch (error) {
//         console.error("Invalid token:", error)
//         req.user = null
//         next()
//     }
// }

/* ****************************************
 * Process update password
 **************************************** */
const populateAccountInfo = async (req, res) => {
    if (!req.user) {
        req.flash("notice", "Please log in to access this page.")
        return res.redirect("/account/login")
    }

    try {
        const nav = await utilities.getNav()
        const accountData = await accountModel.getAccountById(req.user.account_id) // Fetch user details
        if (!accountData) {
            req.flash("notice", "Account not found.")
            return res.redirect("/account/login")
        }

        res.render("account/update", {
            title: "Account Update",
            nav,
            locals: {
                account_firstname: accountData.account_firstname,
                account_lastname: accountData.account_lastname,
                account_email: accountData.account_email,
            },
        })
    } catch (error) {
        console.error("Error fetching account info:", error)
        req.flash("notice", "An unexpected error occurred. Please try again.")
        res.redirect("/account")
    }
}

/* ****************************************
 * Process update password
 **************************************** */
function checkAdminOrEmployee(req, res, next) {
    const token = req.cookies.jwt;

    if (!token) {
        req.flash("notice", "Please log in to access this page.");
        return res.redirect("/account/login");
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded; // Store the user info in the request object

        // Check if account type is "Employee" or "Admin"
        if (decoded.account_type === 'Employee' || decoded.account_type === 'Admin') {
            return next(); // Proceed to the requested route
        } else {
            req.flash("notice", "You do not have the required permissions to access this page.");
            return res.redirect("/account/login"); // Redirect to login with a notice
        }
    } catch (error) {
        req.flash("notice", "Session expired or invalid. Please log in again.");
        return res.redirect("/account/login"); // Redirect to login if token is invalid or expired
    }
}




module.exports = { buildLogin, buildRegister, registerAccount, buildAccountManagement, accountLogin, logout, buildAccountUpdate, updateAccount, changePassword, checkLoginStatus, populateAccountInfo, checkAdminOrEmployee }