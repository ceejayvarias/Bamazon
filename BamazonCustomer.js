var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username
    password: "nove2892", //Your password
    database: "bamazon"
})

connection.connect(function(err) {
    if (err) throw err;
    displayItems();
})

var displayItems = function(){
	var query = 'SELECT * FROM bamazon.products';
    connection.query(query, function(err, res) {
    	console.log("-------ITEMS ON SALE-------")
        for (var i = 0; i < res.length; i++) {
            console.log("[" + res[i].ItemID + "] " + res[i].ProductName + " ($" + res[i].Price + ")");
        }
        console.log("---------------------------")
        buyRequest();
    })
}

var buyRequest = function() {
    inquirer.prompt([
	    {
	        name: "id",
	        type: "input",
	        message: "Type the [id] of the item you would like to buy: "
	    },
	    {
	    	name: "quantity",
	    	type: "input",
	    	message: "How many of this item would you like to buy? (Type 0 to cancel order) "
	    }
    ]).then(function(answer) {
        var query = 'SELECT * FROM bamazon.products WHERE ItemID = ?';

    	connection.query(query, [answer.id], function(err, res) {
    		if (answer.quantity == 0) {
    			console.log("--------------------------------------");
    			console.log("Your order was cancelled!");
    			console.log("--------------------------------------");
    		}
    		else if (answer.quantity < res[0].StockQuantity) {
    			console.log("--------------------------------------");
    			console.log("Your order went through at the price of: $" + res[0].Price);
    			var newQuantity = res[0].StockQuantity - answer.quantity;
    			connection.query("UPDATE bamazon.products SET ? WHERE ?", [{StockQuantity: newQuantity}, {ItemID: answer.id}], function(err, res) {
    				console.log("There are " + newQuantity + " left of this item.");
    				console.log("--------------------------------------");
                });
    		}
    		else{
    			console.log("--------------------------------------");
    			console.log("Insufficient quantity!");
    			console.log("--------------------------------------");
    			displayItems();
    		}
    })
    })
}