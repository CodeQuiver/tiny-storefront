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
        // console.log(res); //this should log the result as json array
        
        console.log("\nItems for Sale:")
        
        for (let i = 0; i < res.length; i++) {
          const thisItem = res[i];

          if (thisItem.stock_quantity < 1) {
            continue; //if item not in stock, skip and continue to next item on list
          }

          console.log(
            "\n" + thisItem.item_id + ") " + thisItem.product_name + 
            "\n    Department: " + thisItem.department_name + 
            "\n    Price: " + thisItem.price.toLocaleString("en-US", {style: "currency", currency: "USD", minimumFractionDigits: 2})
          );
          //note-toLocaleString adjusts numbers to display in correct currency format, fixes dropping of 0s etc.
          
          if (thisItem.item_comments) {
            console.log("    More Details: " + thisItem.item_comments);
          }

          //TODO- optional- split all parts into separate lines so each part of entry is only printed if not null
        }
        callback();
    });
    
    
};
//END PRINT ITEMS IN STOCK


//INQUIRER FUNCTION
function userPrompt() {
  inquirer
    .prompt([
        // Pick item to buy
        {
            type: "input",
            message: "\nTo place an order, please enter the item's ID number from above.",
            name: "itemID"
        },
        // Quantity
        {
            type: "input",
            message: "How many would you like?",
            name: "itemQuantity"
        }])
        .then(function(inquirerResponse){ //process user's responses


          //match item id (inquirerResponse.itemID) to database item id- check if it exists and has a quantity
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
function notAvailableErrorMessage(stringWhatIsntAvailable) { //can enter any string in the specifics such as "insufficient quantity" or "no item with an ID of (user entry for itemID) is"
  console.log("We're sorry, " + stringWhatIsntAvailable + " in stock.");
  userPrompt(); //re-initializes user prompt
}
//END ERROR FUNCTION WHEN AN ITEM OR QUANTITY IS NOT AVAILABLE

//================== END FUNCTIONS =======================//


//================== MAIN PROGRAM FLOW =======================//

// Start Connection
connection.connect(function(err) {
  if (err) throw err;
  // console.log("connected as id " + connection.threadId);
  console.log("\nWelcome to the Tiny Storefront!\nAn online boutique specializing in equipment for your outdoor hobbies.");

});

//print items for sale to console, then use callback to prompt user for selection
printItems(userPrompt);


//================== END MAIN PROGRAM FLOW =======================//

//=========== COMMENTS ============//
  /* 1- Lots of console-logging in this app, so using \n character before new entries rather than after entries as my convention
  so that I won't end up doubling line spacing, and before makes more sense because extra line spaces
  are for visual separation of the new entry- if I add to end more likely to have unnecessary trailing line spacing */

  



//=========== END COMMENTS =========//