create database bamazon;

use bamazon;

create table products(
	item_id int auto_increment not null,
    product_name varchar(100),
    department_name varchar(100),
    price decimal(6,2),
    stock_quantity integer(6),
    primary key(item_id)
);