/**
 * Example of using the MCP server's refactor-code prompt
 * 
 * First start the MCP server using:
 * npm run dev
 * 
 * Then in Cursor, connect to the MCP server with:
 * /mcp connect npx ts-node --esm path/to/mcp-cursor-server/src/index.ts
 * 
 * Then you can use this example:
 * /mcp refactor-code "function badCode(x) { if(x>10) { return true } else { return false } }" "javascript" "Improve readability and simplify logic"
 */

// Sample poorly written code that could benefit from refactoring
const badlyWrittenCode = `
function calculateTotal(items, discountCode, userType) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    let price = item.price;
    let quantity = item.quantity;
    if (userType == "premium") {
      price = price * 0.9;
    }
    total = total + (price * quantity);
  }
  
  if (discountCode == "SAVE10") {
    total = total * 0.9;
  } else if (discountCode == "SAVE20") {
    total = total * 0.8;
  } else if (discountCode == "HALF") {
    total = total * 0.5;
  }
  
  if (total > 100) {
    total = total - 10;
  }
  
  return total;
}

function validateUser(user) {
  if (user.name != null && user.name != undefined && user.name != "") {
    if (user.email != null && user.email != undefined && user.email != "") {
      if (user.password != null && user.password != undefined && user.password != "") {
        if (user.password.length >= 8) {
          if (user.email.includes("@")) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
}
`;

// How to use this with Cursor and MCP:
// 
// 1. Start your MCP server using 'npm run dev'
// 2. In Cursor chat, connect to your MCP server:
//    /mcp connect npx ts-node --esm path/to/your/server
// 3. Use the refactor-code prompt:
//    /mcp refactor-code codeToRefactor="<PASTE YOUR CODE HERE>" language="javascript" context="This is an e-commerce calculation and validation function"
//
// Below is what you could copy-paste into Cursor:
/*
/mcp refactor-code codeToRefactor="function calculateTotal(items, discountCode, userType) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    let price = item.price;
    let quantity = item.quantity;
    if (userType == 'premium') {
      price = price * 0.9;
    }
    total = total + (price * quantity);
  }
  
  if (discountCode == 'SAVE10') {
    total = total * 0.9;
  } else if (discountCode == 'SAVE20') {
    total = total * 0.8;
  } else if (discountCode == 'HALF') {
    total = total * 0.5;
  }
  
  if (total > 100) {
    total = total - 10;
  }
  
  return total;
}" language="javascript" context="This is from an e-commerce calculation module"
*/ 