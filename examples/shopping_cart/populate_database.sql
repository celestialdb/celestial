CREATE DATABASE shopping_cart;

-- connect to the database

CREATE TABLE inventory (
	id SERIAL NOT NULL PRIMARY KEY,
	name VARCHAR NOT NULL,
	price INT NOT NULL
);

CREATE TABLE cart_lineitem (
	id serial NOT NULL PRIMARY KEY,
	cart_id INT NOT NULL REFERENCES cart(cart_id),
	item_id INT NOT NULL REFERENCES inventory(id),
	quantity INT NOT NULL DEFAULT 1
);

CREATE TABLE cart (
	cart_id serial NOT NULL PRIMARY KEY,
	cart_total INT NOT NULL DEFAULT 0
);

INSERT INTO inventory(name, price) VALUES
('apple', 2),
('milk', 5),
('eggs', 3),
('bread', 3),
('butter', 8);

INSERT INTO cart(cart_total) VALUES(2);

INSERT INTO cart_lineitem(cart_id, item_id, quantity) VALUES(1, 1, 1);
