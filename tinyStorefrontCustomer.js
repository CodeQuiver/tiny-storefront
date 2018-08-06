var mysql = require("mysql");
var inquirer = require("inquirer");

//================== configure connection =================//
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password", //need to re-set my password on mysql database to nothing
  database: "tiny_storefront_db"
});
//================== end configure connection =================//

//================== FUNCTIONS =======================//

//PRINT ITEMS IN STOCK
function printItems(callback) {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log(res); //this should log the result as json
        //place a loop here that logs an entry for each item not in JSON format
        //include "if(quantity<1) continue;" so the loop will skip logging items that are out of stock
        callback();
    });
    
    
};
//END PRINT ITEMS IN STOCK


//INQUIRER FUNCTION
function userPrompt() {
  inquirer
    .prompt([
        // Here we create a basic text prompt.
        {
            type: "input",
            message: "To place an order, please enter the item's ID.",
            name: "itemID"
        },
        // Quest
        {
            type: "input",
            message: "How many would you like?",
            name: "itemQuantity"
        }])
        .then(function(inquirerResponse){ //response back to user here

          //match item id (inquirerResponse.itemID) to database item id- check if it exists
            //if no, return to error prompt -> notAvailableErrorMessage("no item with an ID of BLANK is");

            //if yes, new logic tree to check if item is available
              //if quantity in database < quantity requested (inquirerResponse.itemQuantity), call error prompt function -> notAvailableErrorMessage("insufficient quantity");
              //if quantity in database > quantity requested (inquirerResponse.itemQuantity), run fulfillOrder function
        });
}
//END INQUIRER FUNCTION


//FULFILL ORDER FUNCTION
    // show the customer the total cost of their purchase, item name, and item quantity
    // Ask to confirm
    // update the SQL database to reflect the remaining quantity.
    // display thank you message

    // re-set for next order
    // call printItems(); 
    // call userPrompt();
// END FULFILL ORDER FUNCTION


//ERROR FUNCTION WHEN AN ITEM OR QUANTITY IS NOT AVAILABLE
// function notAvailableErrorMessage(stringWhatIsntAvailable) { //can enter any string in the specifics such as "insufficient quantity" or "no item with an ID of (user entry for itemID) is"
//   console.log("We're sorry, " + stringWhatIsntAvailable + " in stock.");
//   userPrompt(); //re-initializes user prompt
// }
//END ERROR FUNCTION WHEN AN ITEM OR QUANTITY IS NOT AVAILABLE

//================== END FUNCTIONS =======================//


//================== MAIN PROGRAM FLOW =======================//

// Start Connection
connection.connect(function(err) {
  if (err) throw err;
  // console.log("connected as id " + connection.threadId);
  console.log("Welcome to the Tiny Storefront!\nAn online boutique specializing in equipment for your outdoor hobbies.\n");

  //print items for sale to console
  printItems(userPrompt()); //trying to set it up so list prints, *then* the prompt starts, but having trouble.
  // .then(
  //   // console.log("testing- this is running inside '.then' promise after 'printItems' ")
  //   //set this up in .then statement so these will happen in order in case reading from the database causes a delay.
  //   //prompt customer for selection
  
  // );


});

//================== END MAIN PROGRAM FLOW =======================//