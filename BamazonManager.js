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
    displayMenu();
})


var viewProducts = function(){
    var query = 'SELECT * FROM bamazon.products';
    connection.query(query, function(err, res) {
        console.log("-------ITEMS ON SALE-------")
        for (var i = 0; i < res.length; i++) {
            console.log("[" + res[i].ItemID + "] " + res[i].ProductName + " ($" + res[i].Price + " w/ " + res[i].StockQuantity + " left)");
        }
        console.log("---------------------------")
        displayMenu();
    })
}

var viewLowInventory = function(){
    var query = 'SELECT * FROM bamazon.products WHERE StockQuantity < 5';
    connection.query(query, function(err, res) {
        console.log("-------ITEMS WITH LOW INVENTORY-------")
        for (var i = 0; i < res.length; i++) {
            console.log("[" + res[i].ItemID + "] " + res[i].ProductName + " ($" + res[i].Price + " w/ " + res[i].StockQuantity + " left)");
        }
        console.log("--------------------------------------")
        displayMenu();
    })
}

var addInventory = function(){
    var query = 'SELECT * FROM bamazon.products';
    connection.query(query, function(err, res) {
        inquirer.prompt({
        name: "add",
        type: "list",
        message: "Which item would you like to add inventory?",
        choices: function(){
            var inventory = [];
            for (var i = 0; i < res.length; i++) {
                inventory.push(res[i].ProductName);
            }
            return inventory;
        }
        }).then(function(answer){
            for (var i = 0; i < res.length; i++) {
                if (res[i].ProductName == answer.add) {
                    var chosenProduct = res[i];
                    inquirer.prompt({
                        name: "amount",
                        type: "input",
                        message: "How much would you like to add of " + res[i].ProductName + "(s)?"
                    }).then(function(ans) {
                        var newAmount = chosenProduct.StockQuantity + parseInt(ans.amount);
                        connection.query("UPDATE bamazon.products SET ? WHERE ?", [{StockQuantity: newAmount}, {ItemID: chosenProduct.ItemID}], 
                            function(err, res){
                            console.log("--------------------------------------");
                            console.log("Successful inventory added! You know have " + newAmount + " " + chosenProduct.ProductName + "(s)!");
                            console.log("--------------------------------------");
                            displayMenu();
                        });
                    })
                }
            }
        })
    
    })
}

var addProduct = function(){
    
    inquirer.prompt([{
        name: "name",
        type: "input",
        message: "What is the name of the product?"
    }, {
        name: "department",
        type: "input",
        message: "What department does this item fall under?"
    }, {
        name: "cost",
        type: "input",
        message: "How much does this product cost?"
    }, {
        name: "quantity",
        type: "input",
        message: "How many would you like to add?"
    }]).then(function(answer){
        var query = 'SELECT * FROM bamazon.products';
        connection.query('INSERT INTO products SET ?', {
            ProductName: answer.name,
            DepartmentName: answer.department,
            Price: answer.cost,
            StockQuantity: answer.quantity
        } , function(err, res) {
            console.log("--------------------------------------");
            console.log("Your item was successfully added!");
            console.log("--------------------------------------");
            displayMenu();
        })
    })
   
}

var displayMenu = function(){
	inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View products for sale", 
            "View Low Inventory", 
            "Add to Inventory", 
            "Add new product"
        ]
    }).then(function(answer) {
        switch(answer.action) {
            case 'View products for sale':
                viewProducts();
            break;

            case 'View Low Inventory':
                viewLowInventory();
            break;

            case 'Add to Inventory':
                addInventory();
            break;

            case 'Add new product':
                addProduct();
            break;
        }
    })
}
