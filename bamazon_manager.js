var mysql = require('mysql');
var prompt = require('prompt');
var colors = require('colors/safe');
var Table = require('cli-table');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'bamazon_db',
});




connection.connect();

// * List a set of menu options: 1) View Products for Sale 2) View Low Inventory 3) Add to Inventory 4) Add New Product

//creates the prompt that will be loaded when the app loads
var manager_options = {
    properties: {
        mOptions: {
            description: colors.magenta('select what you want to do on the options: 1) View Products for Sale 2) View Low Inventory 3) Add to Inventory 4) Add New Product')
        },
    },
};

//start the prompt
prompt.start();

//this prompts the above question and below it states what will be done based on what number the user types
prompt.get(manager_options, function (err, res) {
    if (res.mOptions == 1) {
        view_products();
    } else if (res.mOptions == 2) {
        view_inventory();
    } else if (res.mOptions == 3) {
        add_inventory();
    } else if (res.mOptions == 4) {
        add_newProduct();
    } else {
        console.log('You picked an invalid choice.');
        connection.end();
    }
});

//function for option 1 to view products
var view_products = function () {
    //connects to the mysql database and returning infromation
    connection.query('SELECT * FROM Products', function (err, res) {
        console.log('');
        console.log('Products for Sale')
        console.log('');

        //create new table in the node app
        var table = new Table({
            head: [colors.magenta('Item_Id'), colors.magenta('Product_Name'), colors.magenta('Department_Name'), colors.magenta('Price'), colors.magenta('Stock_Quantity')],
            style: {
                compact: false,
                colAligns: ['center'],
            }
        });

        // loops through each item and pushing to the node table
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].Item_ID, res[i].Product_Name, res[i].Department_Name, res[i].Price, res[i].Stock_Quantity]
            );
        }

        //this console.logs the table and then ends the mysql query connection
        console.log(table.toString());
        connection.end();
    })
};

//function for option 2 to view_inventory
var view_inventory = function () {

    //starts the connection to the mysql database and return items
    connection.query('SELECT * FROM Products WHERE Stock_Quantity < 5', function (err, res) {
        console.log('');
        console.log('Items With Low Inventory');
        console.log('');

        var table = new Table({
            head: [colors.magenta('Item_Id'), colors.magenta('Product_Name'), colors.magenta('Department_Name'), colors.magenta('Price'), colors.magenta('Stock_Quantity')],
            style: {
                // head: ['blue'],
                compact: false,
                colAligns: ['center'],
            }
        });

        //looping through and pushes the items into the node tables
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].Item_ID, res[i].Product_Name, res[i].Department_Name, res[i].Price, res[i].Stock_Quantity]
            );
        }

        //this console.logs the table and then ends the mysql query connection
        console.log(table.toString());
        connection.end();
    })
};

//Function for option 3 to add item in the inventory
var add_inventory = function () {
    var inventory_update = [];
    //this adds the variable that will prompt the information
    var addInvt = {
        properties: {
            inventoryID: {
                description: colors.magenta('What is the ID number of the product you want to add inventory for?')
            },
            inventoryAmount: {
                description: colors.magenta('How many items do you want to add to the inventory?')
            }
        },
    };

    prompt.start();

    //get the information entered in response to the prompt
    prompt.get(addInvt, function (err, res) {

        //creates a variable for the answers to the prompt questions
        var invtAdded = {
            inventoryAmount: res.inventoryAmount,
            inventoryID: res.inventoryID,
        }

        //pushes the responses to the inventoryUpdate array
        inventory_update.push(invtAdded);

        //connect to the mysql database and sets stock quanitity 
        connection.query("UPDATE Products SET Stock_Quantity = (Stock_Quantity + ?) WHERE Item_ID = ?;", [inventory_update[0].inventoryAmount, inventory_update[0].inventoryID], function (err, result) {

            if (err) console.log('error ' + err);

            //Selecting the newly updated information from the database and then console.log a confirmation with the added inventory and/or updated stock amont
            connection.query("SELECT * FROM Products WHERE Item_ID = ?", inventory_update[0].inventoryID, function (error, resOne) {
                console.log('');
                console.log('The new updated stock quantity for id# ' + inventory_update[0].inventoryID + ' is ' + resOne[0].Stock_Quantity);
                console.log('');
                connection.end();
            })

        })
    })
};

//Function for option 4 to add new inventory in the database 
var add_newProduct = function () {

    var added_product = [];
    //creates the variable newProduct which contains the questions that are to be prompted to the user
    var new_product = {
        properties: {
            new_idNum: {
                description: colors.magenta('Please enter a unique 6 digit item Id #')
            },
            new_itemName: {
                description: colors.magenta('Please enter the name of the product you wish to add')
            },
            new_itemDepartment: {
                description: colors.magenta('What department does this item belong in?')
            },
            new_itemPrice: {
                description: colors.magenta('Please enter the price of the item in the format of 00.00')
            },
            new_stockQuantity: {
                description: colors.magenta('Please enter a stock quantity for this item')
            },
        }
    }

    prompt.start();

    //gets the responses for the prompt above
    prompt.get(new_product, function (err, res) {

        //creates a variable for the responses to be logged to
        var newItem = {
            newIdNum: res.new_idNum,
            newItemName: res.new_itemName,
            newItemDepartment: res.new_itemDepartment,
            newItemPrice: res.new_itemPrice,
            newStockQuantity: res.new_stockQuantity,

        };

        //pushes the variable and the response data to the addedProduct array
        added_product.push(newItem);

        //connects to the database and inserts the responses to the prompt to create a new product
        connection.query('INSERT INTO Products (Item_ID, Product_Name, Department_Name, Price, Stock_Quantity) VALUES (?, ?, ?, ?, ?);', [added_product[0].newIdNum, added_product[0].newItemName, added_product[0].newItemDepartment, added_product[0].newItemPrice, added_product[0].newStockQuantity], function (err, result) {

            if (err) console.log('Error: ' + err);

            console.log('New item successfully added to the inventory!');
            console.log(' ');
            console.log('ItemId: ' + added_product[0].newIdNum);
            console.log('ProductName: ' + added_product[0].newItemName);
            console.log('DepartmentName: ' + added_product[0].newItemDepartment);
            console.log('Price: $' + added_product[0].newItemPrice);
            console.log('StockQuantity: ' + added_product[0].newStockQuantity);

            connection.end();
        })
    })
};