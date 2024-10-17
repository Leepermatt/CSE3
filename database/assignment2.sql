-- add Tony Stark
INSERT INTO account (first_name, last_name, email, password)
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
-- update to Admin
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';
-- Delete stony stark
DELETE FROM account
WHERE account_email = 'tony@starkent.com';
-- chagne interio fo hummer
UPDATE public.inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_make = 'GM'
    AND inv_model = 'Hummer';
-- use Inner Join to display sport
SELECT inv.inv_make,
    inv.inv_model,
    class.classification_name
FROM public.inventory inv
    INNER JOIN public.classification class ON inv.classification_id = class.classification_id
WHERE class.classification_name = 'Sport';
--update and add /vehicles to file path
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');