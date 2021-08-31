prefix ="MANUFACTURER_"
formName ="ManufacturerEntryForm"
pendingSheetName = "ManufacturerPending"
mainSheetName="Manufacturer"

thisSheetVariables[(prefix+"PENDINGSHEETSTARTCOL")] = 3;
thisSheetVariables[(prefix+"PENDINGSHEETSTARTROW")] = 3;
thisSheetVariables[(prefix+"SHEET")] = SpreadsheetApp.getActiveSpreadsheet();
thisSheetVariables[(prefix+"FORM")] = thisSheetVariables[(prefix+"SHEET")].getSheetByName(formName);
thisSheetVariables[(prefix+"PENDING")] = thisSheetVariables[(prefix+"SHEET")].getSheetByName(pendingSheetName);
thisSheetVariables[(prefix+"MAINSHEET")] = thisSheetVariables[(prefix+"SHEET")].getSheetByName(mainSheetName);
thisSheetVariables[(prefix+"inputDataRange")]= ["E11","E13","E15","E17"];
thisSheetVariables[(prefix+"requiredDataRange")]=["E11","E13"];
thisSheetVariables[(prefix+"SHEETLINK")]="https://docs.google.com/spreadsheets/d/1v1KijjQavIgBgKirtdFkKCaulI9N-0Il1m60oZD162Q/edit#gid=2106853584";
thisSheetVariables[(prefix+"SEARCHCELL")]="D7";
thisSheetVariables[(prefix+"SEARCHCELLRANGE")]=["D7"];
thisSheetVariables[(prefix+"SEARCH_COL_IDX_IN_MAIN")]=1;


// TODO: Create prefix+var across the script for sheets
function TestVar(){
  Logger.log( thisSheetVariables[ prefix+"PENDINGSHEETSTARTCOL"] ); //Loggs 5
}


function clearManufacturerForm(){
   Logger.log("Clearing form")
   clearCell(thisSheetVariables[(prefix+"FORM")],thisSheetVariables[(prefix+"inputDataRange")])
   clearCell(thisSheetVariables[(prefix+"FORM")],thisSheetVariables[(prefix+"SEARCHCELLRANGE")])
}

function AddToManufacturerPendingSheet() {
  var inputValues =[]
   for (var i=0;i<thisSheetVariables[(prefix+"requiredDataRange")].length;i++){
      if (thisSheetVariables[(prefix+"FORM")].getRange(thisSheetVariables[(prefix+"requiredDataRange")][i]).getValue().toString() ==""){
       SpreadsheetApp.getUi().alert("Cell "+thisSheetVariables[(prefix+"requiredDataRange")][i]+" cannot be empty")
       return;
      }
      } 
      
      for (var i=0;i<thisSheetVariables[(prefix+"inputDataRange")].length;i++){
       if (thisSheetVariables[(prefix+"FORM")].getRange(hisSheetVariables[(prefix+"inputDataRange")][i]).getValue().toString()!=""){
          inputValues.push(thisSheetVariables[(prefix+"FORM")].getRange(hisSheetVariables[(prefix+"inputDataRange")][i]).getValue());
        } else{
        inputValues.push("N/A");
      }
      } 
      
   Logger.log ("Values from form")
   Logger.log(inputValues)

  thisSheetVariables[(prefix+"PENDING")].getRange(thisSheetVariables[(prefix+"PENDING")].getLastRow()+1,thisSheetVariables[(prefix+"PENDINGSHEETSTARTCOL")],1,inputValues.length).setValues([inputValues]);
  Logger.log(thisSheetVariables[(prefix+"SHEETLINK")])
  sendForApproval("New",thisSheetVariables[(prefix+"SHEETLINK")])
  clearCell(thisSheetVariables[(prefix+"FORM")],thisSheetVariables[(prefix+"inputDataRange")])
  SpreadsheetApp.getUi().alert("New controller approval request sent")
}


function ManufacturerSearch(){
  var searchStr = thisSheetVariables[(prefix+"FORM")].getRange(thisSheetVariables[(prefix+"SEARCHCELL")]).getValue();
  if (thisSheetVariables[(prefix+"FORM")].getRange(thisSheetVariables[(prefix+"SEARCHCELL")]) == " " ) {
    SpreadsheetApp.getUi().alert("Enter controller name first!")
    return;
  }

  var values = thisSheetVariables[(prefix+"MAINSHEET")].getDataRange().getValues();
  var controllerFound = false
  Logger.log(values)
  for (var i=0;i<values.length;i++){
    var row = values[i]
    Logger.log(row[thisSheetVariables[(prefix+"SEARCH_COL_IDX_IN_MAIN")]-1])
    if(row[thisSheetVariables[(prefix+"SEARCH_COL_IDX_IN_MAIN")]-1] == searchStr){
        Logger.log("Value found!!")
        for (var i=0;i<thisSheetVariables[(prefix+"inputDataRange")].length;i++){
          thisSheetVariables[(prefix+"FORM")].getRange(thisSheetVariables[(prefix+"inputDataRange")][i]).setValue(row[i])
        }
    controllerFound = true
  } 
 
}

 if(!controllerFound){
    SpreadsheetApp.getUi().alert("No controller with that name!")
  }
 
}


// TODO: Disable multiple inputs for in the pending sheet
function ManufacturerUpdate(){
  var inputValues =[]
  var searchStr = thisSheetVariables[(prefix+"FORM")].getRange(thisSheetVariables[(prefix+"SEARCHCELL")]).getValue();
  var values = thisSheetVariables[(prefix+"MAINSHEET")].getDataRange().getValues();
  if (searchStr == " "){
      SpreadsheetApp.getUi().alert("Cell "+thisSheetVariables[(prefix+"SEARCHCELL")]+" cannot be empty")
      return;
    }
   
  for (var i=1;i<values.length;i++){
     var row = values[i]
     Logger.log(row)
     if(row[thisSheetVariables[(prefix+"SEARCH_COL_IDX_IN_MAIN")]-1] == searchStr){
     var INT_ROW = i+1 
     for (var i=0;i<thisSheetVariables[(prefix+"inputDataRange")].length;i++){
        inputValues.push(thisSheetVariables[(prefix+"FORM")].getRange(thisSheetVariables[(prefix+"inputDataRange")][i]).getValue());
     }
  
  }

}
Logger.log(inputValues)
thisSheetVariables[(prefix+"PENDING")].getRange(thisSheetVariables[(prefix+"PENDING")].getLastRow()+1,thisSheetVariables[(prefix+"PENDINGSHEETSTARTCOL")],1,inputValues.length).setValues([inputValues]);
sendForApproval("Update")
clearCell(thisSheetVariables[(prefix+"FORM")],thisSheetVariables[(prefix+"inputDataRange")])
 clearCell(thisSheetVariables[(prefix+"FORM")],thisSheetVariables[(prefix+"SEARCHCELLRANGE")])
SpreadsheetApp.getUi().alert("Update approval request sent")
}


function onManufacturerApprove() {
   var ui = SpreadsheetApp.getUi()
   var input = ui.prompt("Enter controller name..", ui.ButtonSet.OK_CANCEL);
  
   if(input.getSelectedButton() == ui.Button.OK){
    // Read row and column numbers 
    var rows = thisSheetVariables[(prefix+"PENDING")].getDataRange().getNumRows()
    var cols = thisSheetVariables[(prefix+"PENDING")].getDataRange().getNumColumns();
    var inputValues =[]

    // Get range in sites sheet - used for updating if already exists
    var values = thisSheetVariables[(prefix+"MAINSHEET")].getDataRange().getValues();
    // Get data from row 2 and col 3 (starting index in excel is 0)
    var newValues = thisSheetVariables[(prefix+"PENDING")].getRange(2,3,rows,cols).getValues();
 
   Logger.log(newValues)

  // Row number to search on in values starting form field after Approve - since newValues array is already collected with an offset
  var SEARCH_COL_IDX_IN_PENDING = 1
  
  var INT_ROW 
  // Used for clearing approved row
  var ROW_NUM_PENDING_SHEET
  // Read input name from approver
  var response = input.getResponseText()
  Logger.log(response)
  // Iterate over the values in the main sheet
  for (var i=1;i<values.length;i++){
    var row = values[i]
    // -1 because row is zero based
    Logger.log(row[thisSheetVariables[(prefix+"SEARCH_COL_IDX_IN_MAIN")]-1])
    if(row[thisSheetVariables[(prefix+"SEARCH_COL_IDX_IN_MAIN")]-1] == response){
      Logger.log("Column found in main.. Updating")
      INT_ROW = i+1
      // Updating...
      // Find new values from the pending option sheet
     
      for (var i=0;i<newValues.length;i++){
        
        // Offset by 2 since loop count starts from 0 and first row is header names
        var newRow = newValues[i]
        if(newRow[SEARCH_COL_IDX_IN_PENDING-1] == response){
           ROW_NUM_PENDING_SHEET = i+2
           Logger.log("New values in pending below:")
           Logger.log(newRow)
          
           Logger.log("Column found in pending sheet.. Adding new values")
              for (var i=0;i<newRow.length;i++){
                 Logger.log(newRow[i] != " ")
                if (newRow[i] != " "){
                inputValues.push(newRow[i]);   
                }
              }
    }
      }
    if (INT_ROW != null){
      break;
    }
    
  }
  } 
      
   Logger.log(INT_ROW)
   Logger.log(inputValues)
   
   // Update action
   if(INT_ROW != null ){
       Logger.log("Updating row in the main sheet")
       Logger.log(ROW_NUM_PENDING_SHEET)
       thisSheetVariables[(prefix+"MAINSHEET")].getRange(INT_ROW,1,1,inputValues.length).setValues([inputValues]); 
       clearCellForRange(ROW_NUM_PENDING_SHEET,thisSheetVariables[(prefix+"PENDING")],inputValues.length) 
     } else {
      // Completely new field 
     Logger.log("Adding a new row in the main sheet")
     for (var i=0;i<newValues.length;i++){
        var newRow = newValues[i]
        Logger.log(newRow[SEARCH_COL_IDX_IN_PENDING-1])
      if(newRow[SEARCH_COL_IDX_IN_PENDING-1] == response ){
        Logger.log("Matching column found in pending sheet")
        ROW_NUM_PENDING_SHEET = i + 2
       for (var i=0;i<newRow.length;i++){
         if (newRow[i] !=""){
         inputValues.push(newRow[i]);
         }
      }
    }
      }
      if (inputValues.length!=0){
      inputValues.push(thisSheetVariables[(prefix+"MAINSHEET")].getDataRange().getNumRows())
      }
     Logger.log(inputValues) 
     thisSheetVariables[(prefix+"MAINSHEET")].getRange(thisSheetVariables[(prefix+"MAINSHEET")].getLastRow()+1,1,1,inputValues.length).setValues([inputValues]); 
     
     Logger.log("Clearing pending column")
     Logger.log(ROW_NUM_PENDING_SHEET) 
     clearCellForRange(ROW_NUM_PENDING_SHEET,thisSheetVariables[(prefix+"PENDING")],inputValues.length) 
   }
    } else if(input.getSelectedButton == ui.Button.CANCEL){
      
  }
}
   


function onManufacturerDeny() {
  // Row number to search on in values starting form field after Approve - since newValues array is already collected with an offset
  var SEARCH_COL_IDX_IN_PENDING = 1
  var rows = thisSheetVariables[(prefix+"PENDING")].getDataRange().getNumRows()
  var cols = thisSheetVariables[(prefix+"PENDING")].getDataRange().getNumColumns();

  Logger.log("Denying approval")
  // Used for clearing denied row
   var ROW_NUM_PENDING_SHEET 
   var ui = SpreadsheetApp.getUi()
   var inputValues=[]
   var input = ui.prompt("Enter controller name to deny!..", ui.ButtonSet.OK_CANCEL);
  
  if(input.getSelectedButton() == ui.Button.OK){
  // Read input name from denier
  var response = input.getResponseText()
  Logger.log("Input name")
  Logger.log(response)
  var newValues = thisSheetVariables[(prefix+"PENDING")].getRange(2,3,rows,cols).getValues();
  Logger.log("Pending sheet data read..")
  Logger.log(newValues)
  
  for (var i=0;i<newValues.length;i++){
      var newRow = newValues[i]
      
      if(newRow[SEARCH_COL_IDX_IN_PENDING-1] == response){
          Logger.log("Matching row found in pending sheet..")
          Logger.log(ROW_NUM_PENDING_SHEET)
          // Offset by 2 since loop count starts from 0 and first row is header names
          ROW_NUM_PENDING_SHEET = i+2
          for (var i=0;i<newRow.length;i++){
                inputValues.push(newRow[i]);   
              }
    } else {
        Logger.log("No matching name!!")
    }
  }
  clearCellForRange(ROW_NUM_PENDING_SHEET,thisSheetVariables[(prefix+"PENDING")],inputValues.length) 
      }
} 
  
