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


//PRINT RECEIPT
function printReceipt(orderedItemName, orderedItemQuant, orderedItemUnitPrice) {
  // show the customer the item name, item quantity, unit price
  console.log("Your Order Details: " +
  "\n" + orderedItemName +
  "\nUnit Price: " + orderedItemUnitPrice.toLocaleString("en-US", {style: "currency", currency: "USD", minimumFractionDigits: 2}) + 
  "Quantity: " + orderedItemQuant
  );

  // calculate total cost of purchase
  var totalPurchase = orderedItemUnitPrice * orderedItemQuant;

  // then show customer total cost of their purchase
  console.log("Total Cost: " + totalPurchase.toLocaleString("en-US", {style: "currency", currency: "USD", minimumFractionDigits: 2}));
};

//END PRINT RECEIPT


//INQUIRER FUNCTION
function userPrompt() {
  inquirer
    .prompt([
        // Pick item to buy
        {
            type: "input",
            message: "\nTo place an order, please enter the item's ID number from above.",
            name: "UserItemID"
        },
        // Quantity
        {
            type: "input",
            message: "How many would you like?",
            name: "userItemQuantity"
        }])
        .then(function(inquirerResponse){ //process user's responses, matching against database
          connection.query("SELECT * FROM products WHERE ?", [
            {
              item_id: inquirerResponse.UserItemID
            }
          ], function(err, res) {
              if (err) throw err;
              console.log("TESTING - response entries that match id selected only: ");
              console.log(res);

              //Check if query returned a response with no matches- would be an empty array, call error message function
              if(res == [] || res == 0){
                var errorStringID = "no item with an ID of " + inquirerResponse.UserItemID + " is";
                notAvailableErrorMessage(errorStringID);
              }
              else if(res[0].stock_quantity < inquirerResponse.userItemQuantity){
                var errorStringQuant = "insufficient quantity";
                notAvailableErrorMessage(errorStringQuant);
              }
              else{
                console.log("TESTING- fulfill order function about to run");

                //converting strings to integers
                var idInteger = parseInt(res[0].item_id);

                // run fulfillOrder function with res.product_name, inquirerResponse.stock_quantity (number user ordered), and res.price as parameters
                fulfillOrder(idInteger, res[0].product_name, res[0].stock_quantity, inquirerResponse.userItemQuantity, res[0].price);
              }


          });

        });
}
//END INQUIRER FUNCTION


//FULFILL ORDER FUNCTION
function fulfillOrder(fulfillID, fulfillName, originalQuant, fulfillQuant, fulfillUnitPrice) {
  // update the SQL database to reflect the remaining quantity.- this can be packaged as separate function or not depending on time
  var newQuant = parseInt(originalQuant) - parseInt(fulfillQuant);
  newQuant = parseInt(newQuant);

  connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: newQuant
      },
      {
        item_id: fulfillID
      }
    ],
    function(err, res) {
      console.log("TEST- AFTER ERROR FUNCTION BEGINS");
      if (err) throw err;
      console.log("TEST- AFTER THROW ERROR PART OF FUNCTION, ABOUT TO LOG RESPONSE");
      // console.log(res);
      // show the customer the item name, item quantity, unit price- their receipt basically
      var printUnitPrice = fulfillUnitPrice;
      printReceipt(fulfillName, fulfillQuant, printUnitPrice);
      console.log("Thank you for your purchase! Please come again.\n");
    }
  );
  

// ADVANCED PROMPT TREE- ADD LATER, NOT IN BASIC REQUIREMENTS
  //start prompt here
    //confirm order
      /*if NO, 
      prompt (two choices)
        1- empty my cart and return to storefront? 
              result:
              return to storefront function

        2- proceed with my purchase
              result:
              call fulfillOrder function again
              functionally this means re-orint order details and ask customer again to confirm */
      
      //if YES
      //call update db function- update the SQL database to reflect the remaining quantity.
      //log thank you message 
      //"back to store front" single-option prompt
          // runs return to storefront function  
}




    // update the SQL database to reflect the remaining quantity.- this can be packaged as separate function


    // re-set for next order

// END FULFILL ORDER FUNCTION


//ERROR FUNCTION WHEN AN ITEM OR QUANTITY IS NOT AVAILABLE
function notAvailableErrorMessage(stringWhatIsntAvailable) { //can enter any string in the specifics such as "insufficient quantity" or "no item with an ID of (user entry for itemID) is"
  console.log("We're sorry, " + stringWhatIsntAvailable + " in stock.");
  userPrompt(); //re-initializes user prompt
}
//END ERROR FUNCTION WHEN AN ITEM OR QUANTITY IS NOT AVAILABLE


//RESET TO STOREFRONT FUNCTION
function resetStorefront() {
  console.clear();
  console.log("\nWelcome to the Tiny Storefront!\nAn online boutique specializing in equipment for your outdoor hobbies.");
  printItems(userPrompt); 
}

//END RESET TO STOREFRONT FUNCTION


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