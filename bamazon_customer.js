var mysql = require('mysql');
var prompt = require('prompt');
var colors = require('colors/safe');
var Table = require('cli-table');
var connection = mysql.createConnection({
	host: 'localhost',
	port: '3306',
	user: 'root',
	password: 'root',
	database: 'bamazon_db',
});



connection.connect(function (err) {
	if (err) throw err;

	//connect to the mysql database and pull the information;
	connection.query('SELECT Item_ID, Product_Name, Price FROM Products', function (error, result) {
		if (error) throw error;


		//creates a table for the information from the mysql database table;
		var table = new Table({
			head: [colors.magenta('Item_Id'), colors.magenta('Product_Name'), colors.magenta('Price')],
			style: {
				//: 'green', //['rgba(255, 0, 255, 0)'],
				compact: false,
				colAligns: ['center'],
			}
		});


		//loops through each item in the mysql database and pushes to new row in the table
		for (var i = 0; i < result.length; i++) {
			table.push(
				[result[i].Item_ID, result[i].Product_Name, result[i].Price]
			);
		}
		console.log(table.toString());

		purchase();
	});

	//the purchase function so the customer can purchase one of the products
	var purchase = function () {

		//questions to be prompted to the user
		var product_detailes = {
			properties: {
				item_ID: {
					description: colors.magenta('Please enter the ID # of the item you wish to purchase!')
				},
				Quantity: {
					description: colors.magenta('How many items would you like to purchase?')
				}
			},
		};

		prompt.start(); // setting a prompt function to call the proprties

		// console.log("the sql schema is call back function is start working!")
		var productsToPurchase = [];

		//gets the responses to the prompts above
		prompt.get(product_detailes, function (error, result) {

			//places these responses in the variable custPurchase
			var customer_Purchase = {
				itemID: result.item_ID,
				Quantity: result.Quantity
			};

			//the variable established above is pushed to the productToPurchase array
			productsToPurchase.push(customer_Purchase);
			// console.log(productsToPurchase);

			//connects to the mysql database and selects the item using item id
			connection.query('SELECT * FROM Products WHERE item_ID = ?', [productsToPurchase[0].itemID], function (error, result) {
				if (error) console.log(error, 'This item ID doesn\'t exist, please re-enter the id # of an Item');
				// console.log(result)

				//if the stock quantity is zero, then the customer has to be infromaed that the product is out of stock
				if (productsToPurchase[0].Quantity - result[0].Stock_Quantity == productsToPurchase[0].Quantity) {
					console.log('That product is out of stock!');
					connection.end();

				} //otherwiseif the stock quantity available is less than the customer's intreset, the insufficency of product availability had to be communicated
				else if (result[0].Stock_Quantity < productsToPurchase[0].Quantity) {
					console.log('This product quantity is insuffient to your request, please reconsider your quantity to purchase!');
					connection.end();

					// if the stock amount available is more than or equal to the amount to be purchased, the purchase is processed 
				} else if (result[0].Stock_Quantity >= productsToPurchase[0].Quantity) {

					console.log('');

					console.log(productsToPurchase[0].Quantity + ' items purchased');

					console.log('The Unit Price of ' + result[0].Product_Name + ':' + ' ' + result[0].Price);

					//this creates the variable SaleTotal that contains the total amount the user is paying for this total puchase
					var sale_Total = result[0].Price * productsToPurchase[0].Quantity;

					// console.log('The sale total value of' + ' ' + result[0].Product_Name + ' ' + 'is' + ' ' + sale_Total)

					//connect to the mysql database Departments and updates the saleTotal for the id of the item purchased
					connection.query("UPDATE Departments SET Total_Sales = ? WHERE Department_Name = ?;", [sale_Total, result[0].Department_Name], function (error, resultOne) {
						if (error) {
							console.log('error: ' + error);
							return resultOne
						};
					})

					console.log('Total: ' + sale_Total);

					//this variable contains the newly updated stock quantity of the item purchased
					new_Quantity = result[0].Stock_Quantity - productsToPurchase[0].Quantity;
					// console.log(new_Quantity);

					// connects to the mysql database products and updates the stock quantity for the item puchased
					connection.query("UPDATE Products SET Stock_Quantity = " + new_Quantity + " WHERE Item_ID = " + productsToPurchase[0].itemID, function (error, result) {
						if (error) throw error;
						// console.log('Problem ', error);
						console.log('');
						console.log(colors.magenta('If you have any question about the product, please contact us: PHONE (_ _ _) (_ _ _) (_ _ _ _)'));
						console.log('');
						console.log(colors.magenta('Your order has been processed.  Thank you for your bussiness!'));
						console.log('');
						console.log(colors.magenta('!...bamazon online shoping...!'));
						console.log('');

						connection.end();
					})

				};

			})
		})

	};

});