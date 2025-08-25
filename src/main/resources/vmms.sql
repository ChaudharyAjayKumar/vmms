CREATE DATABASE IF NOT EXISTS vmms_db;
USE vmms_db;

-- Users table with role-based access control
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role ENUM('Vendor', 'Admin', 'DeliveryPartner') NOT NULL,
    last_login DATETIME,
    INDEX idx_username (username)
) ENGINE=InnoDB;

-- Vendors table (1:1 with users)
CREATE TABLE vendors (
    vendor_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    contact VARCHAR(20),
    address TEXT,
    due_amount DECIMAL(10,2) DEFAULT 0.00,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Middleware Admins (1:1 with users)
CREATE TABLE middleware_admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    contact VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Delivery Partners (1:1 with users)
CREATE TABLE delivery_partners (
    delivery_partner_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    contact VARCHAR(20),
    current_status ENUM('Available', 'OnDuty', 'Offline') DEFAULT 'Offline',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- Products catalog
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    box_price DECIMAL(10,2) NOT NULL,
    qty_per_box INT NOT NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB;

ALTER TABLE products ADD COLUMN stock_quantity INT NOT NULL DEFAULT 0;


-- Orders placed by vendors
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_id INT NOT NULL,
    order_date DATETIME NOT NULL,
    status ENUM('Pending', 'Confirmed', 'Delivered') DEFAULT 'Pending',
    total_amount DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id) ON DELETE CASCADE,
    INDEX idx_order_date (order_date),
    INDEX idx_vendor_id (vendor_id)
) ENGINE=InnoDB;

-- Order items (can be unit or box mode)
CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    qty INT NOT NULL,
    mode ENUM('unit', 'box') NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE RESTRICT,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB;

-- Returns linked to an order
CREATE TABLE returns (
    return_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    return_date DATETIME NOT NULL,
    return_status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    overall_reason TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id)
) ENGINE=InnoDB;

-- Return items: supports partial returns
CREATE TABLE return_items (
    return_item_id INT AUTO_INCREMENT PRIMARY KEY,
    return_id INT NOT NULL,
    product_id INT NOT NULL,
    qty INT NOT NULL,
    reason TEXT,
    FOREIGN KEY (return_id) REFERENCES returns(return_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Payments made by vendors
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_id INT NOT NULL,
    order_id INT NOT NULL,
    amount_paid DECIMAL(10,2) NOT NULL,
    mode ENUM('Cash', 'UPI') NOT NULL,
    paid_on DATETIME NOT NULL,
    FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    INDEX idx_vendor_order (vendor_id, order_id)
) ENGINE=InnoDB;

-- Delivery tracking log
CREATE TABLE delivery_log (
    delivery_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    vendor_id INT NOT NULL,
    delivery_partner_id INT NULL,
    status ENUM('Pending', 'Delivered', 'Failed') DEFAULT 'Pending',
    delivered_on DATETIME,
    confirmed_by_vendor BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id) ON DELETE CASCADE,
    FOREIGN KEY (delivery_partner_id) REFERENCES delivery_partners(delivery_partner_id) ON DELETE SET NULL,
    INDEX idx_order_id (order_id),
    INDEX idx_delivery_partner (delivery_partner_id)
) ENGINE=InnoDB;


-- Calculator history for normal and billing modes
CREATE TABLE calculator_history (
    calc_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    mode ENUM('Normal','Billing') NOT NULL,
    input_expression TEXT NOT NULL,
    result VARCHAR(255),
    timestamp DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB;

-- Language preference per user
CREATE TABLE language_settings (
    user_id INT PRIMARY KEY,
    selected_language ENUM('en','hi') DEFAULT 'en',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- User Management Module 
-- 1. Functions

-- Returns the role of a user by user_id.
DELIMITER //
CREATE FUNCTION fn_get_user_role(p_user_id INT) RETURNS VARCHAR(20)
DETERMINISTIC
BEGIN
    DECLARE v_role VARCHAR(20);
    SELECT role INTO v_role FROM users WHERE user_id = p_user_id;
    RETURN v_role;
END;
//
DELIMITER ;


-- 2. Stored Procedures
-- Registers a new user with username, plaintext password, and role.
DELIMITER //
CREATE PROCEDURE sp_register_user(
    IN p_username VARCHAR(100),
    IN p_password_hash TEXT, -- Changed from p_password
    IN p_role ENUM('Vendor','Admin','DeliveryPartner'),
    OUT p_user_id INT,
    OUT p_status VARCHAR(50)
)
BEGIN
    IF EXISTS (SELECT 1 FROM users WHERE username = p_username) THEN
        SET p_user_id = NULL;
        SET p_status = 'Username already exists';
    ELSE
        INSERT INTO users (username, password_hash, role)
        VALUES (p_username, p_password_hash, p_role); -- Store the hash directly
        SET p_user_id = LAST_INSERT_ID();
        SET p_status = 'Registration successful';
    END IF;
END;
//
DELIMITER ;


--  Validates login, updates last_login timestamp.
DELIMITER //
CREATE PROCEDURE sp_login_user(
    IN p_username VARCHAR(100),
    IN p_password_hash TEXT, -- Changed from p_password
    OUT p_user_id INT,
    OUT p_role VARCHAR(20),
    OUT p_status VARCHAR(50)
)
BEGIN
    SELECT user_id INTO p_user_id FROM users 
    WHERE username = p_username AND password_hash = p_password_hash;

    IF p_user_id IS NULL THEN
        SET p_role = NULL;
        SET p_status = 'Invalid username or password';
    ELSE
        UPDATE users SET last_login = NOW() WHERE user_id = p_user_id;
        SELECT role INTO p_role FROM users WHERE user_id = p_user_id;
        SET p_status = 'Login successful';
    END IF;
END;
//
DELIMITER ;

-- Allows updating user contact info and optionally password (hashed).

DELIMITER //
CREATE PROCEDURE sp_update_user_profile(
    IN p_user_id INT,
    IN p_new_password_hash TEXT, -- Changed to accept a hash
    IN p_contact VARCHAR(20),
    OUT p_status VARCHAR(50)
)
BEGIN
    DECLARE v_role VARCHAR(20);

    -- Get the user's role first
    SELECT role INTO v_role FROM users WHERE user_id = p_user_id;

    -- Update password hash if a new one is provided
    IF p_new_password_hash IS NOT NULL AND p_new_password_hash != '' THEN
        UPDATE users SET password_hash = p_new_password_hash WHERE user_id = p_user_id;
    END IF;

    -- Update contact in the correct profile table based on role
    IF v_role = 'Vendor' THEN
        UPDATE vendors SET contact = p_contact WHERE user_id = p_user_id;
    ELSEIF v_role = 'Admin' THEN
        UPDATE middleware_admins SET contact = p_contact WHERE user_id = p_user_id;
    ELSEIF v_role = 'DeliveryPartner' THEN
        UPDATE delivery_partners SET contact = p_contact WHERE user_id = p_user_id;
    END IF;

    SET p_status = 'Profile updated';
END;
//
DELIMITER ;

-- 3.trigger
-- After user creation, automatically insert a matching record in the appropriate profile table based on role.
DELIMITER //
CREATE TRIGGER trg_after_user_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    IF NEW.role = 'Vendor' THEN
        INSERT INTO vendors (user_id, name, contact, address, due_amount) VALUES (NEW.user_id, '', '', '', 0.00);
    ELSEIF NEW.role = 'Admin' THEN
        INSERT INTO middleware_admins (user_id, name, contact) VALUES (NEW.user_id, '', '');
    ELSEIF NEW.role = 'DeliveryPartner' THEN
        INSERT INTO delivery_partners (user_id, name, contact, current_status) VALUES (NEW.user_id, '', '', 'Offline');
    END IF;
END;
//
DELIMITER ;

-- Product Catalog Module

-- 1.function 
--  Returns whether a given product is active (visible in catalog).

DELIMITER //
CREATE FUNCTION fn_is_product_active(p_product_id INT) RETURNS BOOLEAN
DETERMINISTIC
BEGIN
    DECLARE v_active BOOLEAN;
    SELECT is_active INTO v_active FROM products WHERE product_id = p_product_id;
    RETURN v_active;
END;
//
DELIMITER ;

-- Stored Procedures
-- Adds a new product with unit & box pricing, quantity per box, image URL, and active status.
DELIMITER //
CREATE PROCEDURE sp_add_product(
    IN p_name VARCHAR(255),
    IN p_unit_price DECIMAL(10,2),
    IN p_box_price DECIMAL(10,2),
    IN p_qty_per_box INT,
    IN p_image_url TEXT,
    IN p_is_active BOOLEAN,
    OUT p_product_id INT,
    OUT p_status VARCHAR(50)
)
BEGIN
    INSERT INTO products
    (name, unit_price, box_price, qty_per_box, image_url, is_active)
    VALUES
    (p_name, p_unit_price, p_box_price, p_qty_per_box, p_image_url, p_is_active);

    SET p_product_id = LAST_INSERT_ID();
    SET p_status = 'Product added successfully';
END;
//
DELIMITER ;

-- sp_update_product
DELIMITER //
CREATE PROCEDURE sp_update_product(
    IN p_product_id INT,
    IN p_name VARCHAR(255),
    IN p_unit_price DECIMAL(10,2),
    IN p_box_price DECIMAL(10,2),
    IN p_qty_per_box INT,
    IN p_image_url TEXT,
    IN p_is_active BOOLEAN,
    OUT p_status VARCHAR(50)
)
BEGIN
    UPDATE products SET
        name = p_name,
        unit_price = p_unit_price,
        box_price = p_box_price,
        qty_per_box = p_qty_per_box,
        image_url = p_image_url,
        is_active = p_is_active
    WHERE product_id = p_product_id;

    SET p_status = 'Product updated successfully';
END;
//
DELIMITER ;


-- sp_delete_product
DELIMITER //
CREATE PROCEDURE sp_delete_product(
    IN p_product_id INT,
    OUT p_status VARCHAR(50)
)
BEGIN
    UPDATE products SET is_active = FALSE WHERE product_id = p_product_id;
    SET p_status = 'Product marked as inactive';
END;
//
DELIMITER ;


-- sp_get_active_products
DELIMITER //
CREATE PROCEDURE sp_get_active_products()
BEGIN
    SELECT product_id, name, unit_price, box_price, qty_per_box, image_url
    FROM products
    WHERE is_active = TRUE;
END;
//
DELIMITER ;


-- 3. Trigger
-- a. trg_before_product_update

DELIMITER //
CREATE TRIGGER trg_before_product_update
BEFORE UPDATE ON products
FOR EACH ROW
BEGIN
    IF OLD.unit_price != NEW.unit_price OR OLD.box_price != NEW.box_price THEN
        -- Example action: Log price change (assuming price_changes table exists)
        INSERT INTO price_changes(product_id, old_unit_price, new_unit_price, old_box_price, new_box_price, changed_on)
        VALUES (OLD.product_id, OLD.unit_price, NEW.unit_price, OLD.box_price, NEW.box_price, NOW());
    END IF;
END;
//
DELIMITER ;


-- above trigger to work 
CREATE TABLE price_changes (
    change_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    old_unit_price DECIMAL(10,2),
    new_unit_price DECIMAL(10,2),
    old_box_price DECIMAL(10,2),
    new_box_price DECIMAL(10,2),
    changed_on DATETIME NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- 3. Order Management Module

-- 1. Functions
-- a. fn_calculate_order_total

DELIMITER //
CREATE FUNCTION fn_calculate_order_total(p_order_id INT) RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE v_total DECIMAL(10,2);
    SELECT IFNULL(SUM(qty * price), 0) INTO v_total
    FROM order_items
    WHERE order_id = p_order_id;
    RETURN v_total;
END;
//
DELIMITER ;


-- 2. Stored Procedures
-- a. sp_add_to_cart

-- Table cart_items assumed: cart_id PK, vendor_id FK, product_id FK,
-- qty INT, mode ENUM('unit','box'), price DECIMAL(10,2)

DELIMITER //
CREATE PROCEDURE sp_add_to_cart(
    IN p_vendor_id INT,
    IN p_product_id INT,
    IN p_qty INT,
    IN p_mode ENUM('unit','box'),
    IN p_price DECIMAL(10,2),
    OUT p_status VARCHAR(50)
)
BEGIN
    -- Check if item already in cart to update
    IF EXISTS (SELECT 1 FROM cart_items WHERE vendor_id = p_vendor_id AND product_id = p_product_id AND mode = p_mode) THEN
        UPDATE cart_items 
        SET qty = qty + p_qty, price = p_price
        WHERE vendor_id = p_vendor_id AND product_id = p_product_id AND mode = p_mode;
        SET p_status = 'Cart updated';
    ELSE
        INSERT INTO cart_items (vendor_id, product_id, qty, mode, price)
        VALUES (p_vendor_id, p_product_id, p_qty, p_mode, p_price);
        SET p_status = 'Item added to cart';
    END IF;
END;
//
DELIMITER ;

-- b. sp_update_cart_item
DELIMITER //
CREATE PROCEDURE sp_update_cart_item(
    IN p_cart_id INT,
    IN p_qty INT,
    IN p_mode ENUM('unit','box'),
    OUT p_status VARCHAR(50)
)
BEGIN
    UPDATE cart_items
    SET qty = p_qty, mode = p_mode
    WHERE cart_id = p_cart_id;

    SET p_status = 'Cart item updated';
END;
//
DELIMITER ;

-- . sp_remove_cart_item
DELIMITER //
CREATE PROCEDURE sp_remove_cart_item(
    IN p_cart_id INT,
    OUT p_status VARCHAR(50)
)
BEGIN
    DELETE FROM cart_items WHERE cart_id = p_cart_id;
    SET p_status = 'Cart item removed';
END;
//
DELIMITER ;

-- d. sp_get_cart_items
DELIMITER //
CREATE PROCEDURE sp_get_cart_items(
    IN p_vendor_id INT
)
BEGIN
    SELECT cart_id, product_id, qty, mode, price
    FROM cart_items
    WHERE vendor_id = p_vendor_id;
END;
//
DELIMITER ;


-- e. sp_place_order
DELIMITER //
CREATE PROCEDURE sp_place_order(
    IN p_vendor_id INT,
    OUT p_order_id INT,
    OUT p_status VARCHAR(50)
)
BEGIN
    DECLARE v_total DECIMAL(10,2) DEFAULT 0;
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_product_id INT;
    DECLARE v_qty INT;
    DECLARE v_mode ENUM('unit','box');
    DECLARE v_price DECIMAL(10,2);

    DECLARE cur CURSOR FOR 
        SELECT product_id, qty, mode, price FROM cart_items WHERE vendor_id = p_vendor_id;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    -- **ADDED: Error handler for automatic rollback**
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_status = 'Error: Failed to place order. Transaction rolled back.';
    END;

    START TRANSACTION;

    INSERT INTO orders (vendor_id, order_date, status, total_amount) 
    VALUES (p_vendor_id, NOW(), 'Pending', 0);
    SET p_order_id = LAST_INSERT_ID();

    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO v_product_id, v_qty, v_mode, v_price;
        IF done THEN
            LEAVE read_loop;
        END IF;

        INSERT INTO order_items (order_id, product_id, qty, mode, price)
        VALUES (p_order_id, v_product_id, v_qty, v_mode, v_price);
        SET v_total = v_total + (v_qty * v_price);
    END LOOP;
    CLOSE cur;

    UPDATE orders SET total_amount = v_total WHERE order_id = p_order_id;
    DELETE FROM cart_items WHERE vendor_id = p_vendor_id;

    COMMIT;
    SET p_status = 'Order placed successfully';
END;
//
DELIMITER ;
-- temporary cart_table
CREATE TABLE cart_items (
    cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_id INT NOT NULL,
    product_id INT NOT NULL,
    qty INT NOT NULL,
    mode ENUM('unit', 'box') NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    added_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
) ENGINE=InnoDB; 


-- 5 Payment and Billing Module

-- 1. Functions
-- a. fn_calculate_due_amount

DELIMITER //
CREATE FUNCTION fn_calculate_due_amount(p_vendor_id INT) RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE v_due DECIMAL(10,2);
    SELECT 
      IFNULL(SUM(o.total_amount),0) - IFNULL((SELECT SUM(p.amount_paid) FROM payments p WHERE p.vendor_id = p_vendor_id),0)
    INTO v_due
    FROM orders o
    WHERE o.vendor_id = p_vendor_id;
    RETURN v_due;
END;
//
DELIMITER ;

-- 2. Stored Procedures
-- a. sp_make_payment
-- Records a payment (partial or full) against a specific vendor order.
-- Updates the vendor’s due amount accordingly.

DELIMITER //
CREATE PROCEDURE sp_make_payment(
    IN p_vendor_id INT,
    IN p_order_id INT,
    IN p_amount_paid DECIMAL(10,2),
    IN p_mode ENUM('Cash','UPI'),
    IN p_payment_date DATETIME,
    OUT p_status VARCHAR(50)
)
BEGIN
    -- Insert payment record. The trigger will handle the due amount update automatically.
    INSERT INTO payments (vendor_id, order_id, amount_paid, mode, paid_on)
    VALUES (p_vendor_id, p_order_id, p_amount_paid, p_mode, p_payment_date);

    SET p_status = 'Payment recorded successfully';
END;
//
DELIMITER ;


-- 3. Triggers
-- a. trg_after_payment_insert
-- Automatically updates vendor due amount after any payment insertion (real-time reconciliation).

DELIMITER //
CREATE TRIGGER trg_after_payment_insert
AFTER INSERT ON payments
FOR EACH ROW
BEGIN
    UPDATE vendors v
    SET v.due_amount = fn_calculate_due_amount(v.vendor_id)
    WHERE v.vendor_id = NEW.vendor_id;
END;
//
DELIMITER ;

-- 4. Voice Billing Integration (Backend Logic)
-- a. sp_add_calculator_entry
-- Stores each calculator (voice or normal) input and result for auditing and replay.

DELIMITER //
CREATE PROCEDURE sp_add_calculator_entry(
    IN p_user_id INT,
    IN p_mode ENUM('Normal','Billing'),
    IN p_input_expression TEXT,
    IN p_result VARCHAR(255)
)
BEGIN
    INSERT INTO calculator_history (user_id, mode, input_expression, result, timestamp)
    VALUES (p_user_id, p_mode, p_input_expression, p_result, NOW());
END;
//
DELIMITER ;

-- 5. Returns Management Module 
-- 1. Functions
 -- a) Calculate total return amount for a given return ID

DELIMITER //
CREATE FUNCTION fn_calculate_return_amount(p_return_id INT) RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE v_total_return DECIMAL(10,2);

    SELECT SUM(ri.qty * oi.price)
    INTO v_total_return
    FROM return_items ri
    JOIN order_items oi ON ri.product_id = oi.product_id AND ri.return_id = p_return_id AND oi.order_id = (
        SELECT order_id FROM returns WHERE return_id = p_return_id
    );

    RETURN IFNULL(v_total_return, 0);
END;
//
DELIMITER ;

-- 2. Stored Procedures
-- a) Raise Return Request
-- Employees can create a return request (partial or full) for an order

DELIMITER //
CREATE PROCEDURE sp_raise_return_request(
    IN p_order_id INT,
    IN p_items_json JSON,  -- array of {product_id, qty, reason}
    IN p_overall_reason TEXT,
    OUT p_return_id INT,
    OUT p_status VARCHAR(100)
)
BEGIN
    DECLARE v_return_id INT;
    DECLARE i INT DEFAULT 0;
    DECLARE n INT;
    DECLARE item JSON;
    DECLARE v_product_id INT;
    DECLARE v_qty INT;
    DECLARE v_reason TEXT;

    -- Insert Return header
    INSERT INTO returns (order_id, return_date, return_status, overall_reason)
    VALUES (p_order_id, NOW(), 'Pending', p_overall_reason);

    SET v_return_id = LAST_INSERT_ID();

    SET n = JSON_LENGTH(p_items_json);

    WHILE i < n DO
        SET item = JSON_EXTRACT(p_items_json, CONCAT('$[', i, ']'));
        SET v_product_id = JSON_UNQUOTE(JSON_EXTRACT(item, '$.product_id'));
        SET v_qty = JSON_EXTRACT(item, '$.qty');
        SET v_reason = JSON_UNQUOTE(JSON_EXTRACT(item, '$.reason'));

        INSERT INTO return_items (return_id, product_id, qty, reason)
        VALUES (v_return_id, v_product_id, v_qty, v_reason);

        SET i = i + 1;
    END WHILE;

    SET p_return_id = v_return_id;
    SET p_status = 'Return request submitted successfully';
END;
//
DELIMITER ;


-- b) Approve Return Request
-- Upon approval, update return status, adjust inventory, and refund dues if applicable.
DELIMITER //
CREATE PROCEDURE sp_approve_return(
    IN p_return_id INT,
    OUT p_status VARCHAR(100)
)
BEGIN
    DECLARE v_order_id INT;
    DECLARE v_vendor_id INT;
    DECLARE v_return_amount DECIMAL(10,2);

    -- Error handler to roll back transaction on any failure
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_status = 'Error: Failed to approve return. Transaction rolled back.';
    END;

    START TRANSACTION;

    UPDATE returns SET return_status = 'Approved' WHERE return_id = p_return_id;

    SELECT order_id INTO v_order_id FROM returns WHERE return_id = p_return_id;
    SELECT vendor_id INTO v_vendor_id FROM orders WHERE order_id = v_order_id;
    
    SET v_return_amount = fn_calculate_return_amount(p_return_id);

    UPDATE products p
    JOIN return_items ri ON p.product_id = ri.product_id
    SET p.stock_quantity = p.stock_quantity + ri.qty
    WHERE ri.return_id = p_return_id;

    UPDATE vendors SET due_amount = due_amount - v_return_amount WHERE vendor_id = v_vendor_id;

    COMMIT;
    SET p_status = 'Return approved, inventory and dues updated.';
END;
//
DELIMITER ;

-- c) Reject Return Request
-- Update return record with rejection status and optional reason.

DELIMITER //
CREATE PROCEDURE sp_reject_return(
    IN p_return_id INT,
    IN p_reject_reason TEXT,
    OUT p_status VARCHAR(100)
)
BEGIN
    UPDATE returns SET return_status = 'Rejected', overall_reason = p_reject_reason WHERE return_id = p_return_id;
    SET p_status = 'Return request rejected';
END;
//
DELIMITER ;


-- 6.Delivery Management Module

-- 1. Functions
-- a) Check Delivery Assignment Status
-- Checks if a given order already has an assigned delivery partner.

DELIMITER //
CREATE FUNCTION fn_is_order_assigned(p_order_id INT) RETURNS BOOLEAN
DETERMINISTIC
BEGIN
    DECLARE assigned BOOLEAN;
    SELECT EXISTS(
        SELECT 1 FROM delivery_log WHERE order_id = p_order_id
    ) INTO assigned;
    RETURN assigned;
END;
//
DELIMITER ;

-- 2. Stored Procedures
-- a) Assign Delivery to Partner
-- Assign an order to a delivery partner, creating an entry in delivery_log with initial status 'Pending'.
DELIMITER //
CREATE PROCEDURE sp_assign_delivery(
    IN p_order_id INT,
    IN p_delivery_partner_id INT,
    OUT p_status VARCHAR(100)
)
BEGIN
    -- Error handler to roll back transaction on any failure
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_status = 'Error: Failed to assign delivery. Transaction rolled back.';
    END;

    IF fn_is_order_assigned(p_order_id) THEN
        SET p_status = 'Error: Order already assigned.';
    ELSE
        START TRANSACTION;

        INSERT INTO delivery_log (order_id, vendor_id, delivery_partner_id, status)
        SELECT o.order_id, o.vendor_id, p_delivery_partner_id, 'Pending'
        FROM orders o WHERE o.order_id = p_order_id;
        
        UPDATE delivery_partners
        SET current_status = 'OnDuty'
        WHERE delivery_partner_id = p_delivery_partner_id;

        COMMIT;
        SET p_status = 'Delivery assigned successfully.';
    END IF;
END;
//
DELIMITER ;

-- b) Update Delivery Status
-- Update the delivery status and delivery timestamp; can also record confirmation by vendor.

DELIMITER //
CREATE PROCEDURE sp_update_delivery_status(
    IN p_delivery_id INT,
    IN p_new_status ENUM('Pending','Delivered','Failed'),
    IN p_delivered_on DATETIME,
    IN p_confirmed_by_vendor BOOLEAN,
    OUT p_status_msg VARCHAR(100)
)
BEGIN
    UPDATE delivery_log
    SET status = p_new_status,
        delivered_on = p_delivered_on,
        confirmed_by_vendor = p_confirmed_by_vendor
    WHERE delivery_id = p_delivery_id;

    SET p_status_msg = CONCAT('Delivery status updated to ', p_new_status);
END;
//
DELIMITER ;

-- c) Get Deliveries for Partner
-- Retrieve list of deliveries assigned to a particular delivery partner.

DELIMITER //
CREATE PROCEDURE sp_get_partner_deliveries(
    IN p_delivery_partner_id INT
)
BEGIN
    SELECT dl.delivery_id, dl.order_id, dl.vendor_id, dl.status, dl.delivered_on, dl.confirmed_by_vendor,
           o.order_date, o.total_amount
    FROM delivery_log dl
    JOIN orders o ON dl.order_id = o.order_id
    WHERE dl.delivery_partner_id = p_delivery_partner_id;
END;
//
DELIMITER ;


-- 3.trigger
 -- trigger will automatically set a partner's status back to 'Available' as soon as their delivery is marked as complete.
DELIMITER //
CREATE TRIGGER trg_on_delivery_complete
AFTER UPDATE ON delivery_log
FOR EACH ROW
BEGIN
    -- Check if the status was changed to a final state ('Delivered' or 'Failed')
    IF NEW.status IN ('Delivered', 'Failed') AND OLD.status != NEW.status THEN
        
        -- **AUTOMATION: Set the partner's status back to 'Available'**
        UPDATE delivery_partners
        SET current_status = 'Available'
        WHERE delivery_partner_id = NEW.delivery_partner_id;
    END IF;
END;
//
DELIMITER ;

-- 7.  Language and Localization Module
-- 1. Functions
-- a) Get User Language Preference

DELIMITER //
CREATE FUNCTION fn_get_user_language(p_user_id INT) RETURNS ENUM('en','hi')
DETERMINISTIC
BEGIN
    DECLARE lang ENUM('en','hi');
    SELECT selected_language INTO lang FROM language_settings WHERE user_id = p_user_id;
    RETURN IFNULL(lang, 'en'); -- default English if not set
END;
//
DELIMITER ;


-- 2. Stored Procedures
-- a) Set or Update User Language Preference

DELIMITER //
CREATE PROCEDURE sp_set_user_language(
    IN p_user_id INT,
    IN p_language ENUM('en','hi'),
    OUT p_status VARCHAR(50)
)
BEGIN
    IF EXISTS (SELECT 1 FROM language_settings WHERE user_id = p_user_id) THEN
        UPDATE language_settings SET selected_language = p_language WHERE user_id = p_user_id;
        SET p_status = 'Language preference updated';
    ELSE
        INSERT INTO language_settings(user_id, selected_language) VALUES (p_user_id, p_language);
        SET p_status = 'Language preference set';
    END IF;
END;
//
DELIMITER ;

-- b) Get User Language Preference Details

DELIMITER //
CREATE PROCEDURE sp_get_user_language(
    IN p_user_id INT,
    OUT p_language ENUM('en','hi')
)
BEGIN
    SELECT selected_language INTO p_language FROM language_settings WHERE user_id = p_user_id;
    IF p_language IS NULL THEN
        SET p_language = 'en';
    END IF;
END;
//
DELIMITER ;

-- 8. Calculator and Voice Billing Module 
-- 2. Stored Procedures
-- a) Log Calculator Entry
-- Stores every calculator usage event, capturing mode, input, result, and timestamp.
DELIMITER //
CREATE PROCEDURE sp_add_calculator_entry(
    IN p_user_id INT,
    IN p_mode ENUM('Normal', 'Billing'),
    IN p_input_expression TEXT,
    IN p_result VARCHAR(255)
)
BEGIN
    INSERT INTO calculator_history (
        user_id, mode, input_expression, result, timestamp
    ) VALUES (
        p_user_id, p_mode, p_input_expression, p_result, NOW()
    );
END;
//
DELIMITER ;


-- b) Fetch Calculator History
-- Retrieves calculator activity logs for a user, useful for UI display or audit.

DELIMITER //
CREATE PROCEDURE sp_get_calculator_history(
    IN p_user_id INT
)
BEGIN
    SELECT 
        calc_id, mode, input_expression, result, timestamp
    FROM 
        calculator_history
    WHERE 
        user_id = p_user_id
    ORDER BY 
        timestamp DESC;
END;
//
DELIMITER ;


-- 9. Admin Dashboard Module
-- 1. Functions
-- a) Aggregate total sales in a date range


DELIMITER //
CREATE FUNCTION fn_total_sales(p_start_date DATETIME, p_end_date DATETIME) RETURNS DECIMAL(15, 2)
DETERMINISTIC
BEGIN
    DECLARE total_sales DECIMAL(15,2);
    SELECT IFNULL(SUM(total_amount), 0) INTO total_sales
    FROM orders
    WHERE order_date BETWEEN p_start_date AND p_end_date
      AND status IN ('Confirmed', 'Delivered');
    RETURN total_sales;
END;
//
DELIMITER ;


-- b) Aggregate total pending dues for all vendors

DELIMITER //
CREATE FUNCTION fn_total_dues() RETURNS DECIMAL(15, 2)
DETERMINISTIC
BEGIN
    DECLARE total_dues DECIMAL(15,2);
    SELECT IFNULL(SUM(due_amount), 0) INTO total_dues FROM vendors;
    RETURN total_dues;
END;
//
DELIMITER ;


-- 2. Stored Procedures
-- ) Dashboard Summary: Sales, Dues, Returns, Top Products
DELIMITER //
CREATE PROCEDURE sp_dashboard_summary_single_result(
    IN p_start_date DATETIME,
    IN p_end_date DATETIME
)
BEGIN
    SELECT 
        -- Metric 1: Total Sales
        fn_total_sales(p_start_date, p_end_date) AS total_sales,
        
        -- Metric 2: Total Dues
        fn_total_dues() AS total_dues,
        
        -- Metric 3: Total Approved Returns Count
        (SELECT COUNT(*) FROM returns r WHERE r.return_date BETWEEN p_start_date AND p_end_date AND r.return_status = 'Approved') AS total_returns_count,
        
        -- Metric 4: Top Selling Product Name
        (SELECT p.name FROM order_items oi JOIN orders o ON oi.order_id = o.order_id JOIN products p ON oi.product_id = p.product_id WHERE o.order_date BETWEEN p_start_date AND p_end_date AND o.status IN ('Confirmed', 'Delivered') GROUP BY p.name ORDER BY SUM(oi.qty) DESC LIMIT 1) AS top_product_name;

    -- You would still run the query for the top 5 products list separately
    -- as it returns multiple rows.
    SELECT oi.product_id, p.name, SUM(oi.qty * (oi.mode = 'box') * p.qty_per_box + oi.qty * (oi.mode = 'unit')) AS total_qty_sold
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.order_id
    JOIN products p ON oi.product_id = p.product_id
    WHERE o.order_date BETWEEN p_start_date AND p_end_date
      AND o.status IN ('Confirmed', 'Delivered')
    GROUP BY oi.product_id, p.name
    ORDER BY total_qty_sold DESC
    LIMIT 5;
END;
//
DELIMITER ;
-- b) Get Pending Return Requests

DELIMITER //
CREATE PROCEDURE sp_get_pending_returns()
BEGIN
    SELECT r.return_id, r.order_id, r.return_date, r.overall_reason
    FROM returns r
    WHERE r.return_status = 'Pending';
END;
//
DELIMITER ;

--  trigger. It will automatically deduct stock for each item as an order is created.
DELIMITER //
CREATE TRIGGER trg_update_stock_on_order
AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
    DECLARE current_stock INT;

    -- Lock the product row to prevent race conditions
    SELECT stock_quantity INTO current_stock FROM products WHERE product_id = NEW.product_id FOR UPDATE;

    -- Check for sufficient stock
    IF current_stock < NEW.qty THEN
        -- Raise an error to cancel the transaction
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Insufficient stock for the product.';
    END IF;

    -- Deduct stock
    UPDATE products 
    SET stock_quantity = stock_quantity - NEW.qty 
    WHERE product_id = NEW.product_id;
END;
//
DELIMITER ;