var SITEOption = "Site"
var SITEPENDINGSHEETSTARTCOL = 3;
var SITEPENDINGSHEETSTARTROW = 3; // If Action column in pending is frozen add a -1
var SITESHEET = SpreadsheetApp.getActiveSpreadsheet();
var SITEFORM = SITESHEET.getSheetByName(SITEOption+"EntryForm");
var SITEPENDING = SITESHEET.getSheetByName(SITEOption+"Pending");
var SITEMAINSHEET = SITESHEET.getSheetByName("Site");
var siteInputDataRange=["D12","D14","D16","D18","D20","D22","D24","D26","D28","D30","I14","I19","I21","I23","I25","L15","L17","L19","L21","L23","L25","O18","O20","O22","I16"];
var siteRequiredDataRange=["D12","D14","D16","D18","D20","D22","D24","D26","D28","D30","I14","I19","I21","L15","L17","L19","L21","L23","L25","O18","O20","O22","I16"];
var SITESHEETLINK = "https://docs.google.com/spreadsheets/d/1v1KijjQavIgBgKirtdFkKCaulI9N-0Il1m60oZD162Q/edit#gid=531535300";
var SITESEARCHCELL = "N12"
var SITESEARCHRANGE = ["N12"]

// Column number to search on in the main sheet 
var SITESEARCH_COL_IDX_IN_MAIN=4;

function clearSiteForm(){
   Logger.log("Clearing form")
   clearCell(SITEFORM,siteInputDataRange)
   clearCell(SITEFORM,SITESEARCHRANGE)
}

function AddToSitePendingSheet() {
  var inputValues =[]
   for (var i=0;i<siteRequiredDataRange.length;i++){
      if (SITEFORM.getRange(siteRequiredDataRange[i]).getValue().toString() ==""){
       SpreadsheetApp.getUi().alert("Cell "+siteRequiredDataRange[i]+" cannot be empty")
       return;
      }
      } 
      
      for (var i=0;i<siteInputDataRange.length;i++){
       if (SITEFORM.getRange(siteInputDataRange[i]).getValue().toString()!=""){
          inputValues.push(SITEFORM.getRange(siteInputDataRange[i]).getValue());
        } else{
        inputValues.push("N/A");
      }
      } 
 Logger.log ("Values from form")
 Logger.log(inputValues)
 SITEPENDING.getRange(SITEPENDING.getLastRow()+1,PENDINGSHEETSTARTCOL,1,inputValues.length).setValues([inputValues]);
 Logger.log(SHEETLINK)
 sendForApproval("New",SHEETLINK)
 clearCell(SITEFORM,siteInputDataRange)
 SpreadsheetApp.getUi().alert("New site approval request sent")
}


function SiteSearch(){
  var searchStr = SITEFORM.getRange(SITESEARCHCELL).getValue();
  if (SITEFORM.getRange(SITESEARCHCELL) == " " ) {
    SpreadsheetApp.getUi().alert("Enter site name first!")
    return;
  }

  var values = SITEMAINSHEET.getDataRange().getValues();
  var controllerFound = false
  Logger.log(values)
  for (var i=0;i<values.length;i++){
    var row = values[i]
    Logger.log(row[SITESEARCH_COL_IDX_IN_MAIN-1])
    if(row[SITESEARCH_COL_IDX_IN_MAIN-1] == searchStr){
        Logger.log("Value found!!")
  for (var i=0;i<siteInputDataRange.length;i++){
    SITEFORM.getRange(siteInputDataRange[i]).setValue(row[i])
  }
    controllerFound = true
  } 
 
}
 if(!controllerFound){
    SpreadsheetApp.getUi().alert("No project with that name!")
  }

}

// TODO: Disable multiple inputs for in the pending sheet
function SiteUpdate(){
  var inputValues =[]
  var searchStr = SITEFORM.getRange(SITESEARCHCELL).getValue();
  var values = SITEMAINSHEET.getDataRange().getValues();
  if (searchStr == " "){
      SpreadsheetApp.getUi().alert("Cell "+SITESEARCHCELL+" cannot be empty")
      return;
    }
   Logger.log("Retrieving value to update")
   Logger.log(searchStr)
   Logger.log(values)
   for (var i=0;i<values.length;i++){
     var row = values[i]
     if(row[SITESEARCH_COL_IDX_IN_MAIN-1] == searchStr){
      Logger.log("Value found")
     var INT_ROW = i+1 
      
     for (var i=0;i<siteInputDataRange.length;i++){
          if (SITEFORM.getRange(siteInputDataRange[i]).getValue().toString()!=""){
                    inputValues.push(SITEFORM.getRange(siteInputDataRange[i]).getValue());
                  } else{
                  inputValues.push("N/A");
                }
     }
  
    }
  }
Logger.log(inputValues)
SITEPENDING.getRange(SITEPENDING.getLastRow()+1,SITEPENDINGSHEETSTARTROW,1,inputValues.length).setValues([inputValues]);
sendForApproval("Update")
clearCell(SITEFORM,siteInputDataRange)
SpreadsheetApp.getUi().alert("Update approval request sent")
}


function onSiteApprove() {
   var ui = SpreadsheetApp.getUi()
   var input = ui.prompt("Enter site name..", ui.ButtonSet.OK_CANCEL);
  
   if(input.getSelectedButton() == ui.Button.OK){
    
    var rows = SITEPENDING.getDataRange().getNumRows()
    var cols = SITEPENDING.getDataRange().getNumColumns();
    var inputValues =[]

    // Get range in sites sheet - used for updating if already exists
    var values = SITEMAINSHEET.getDataRange().getValues();
    // Get data from row 2 and col 3 (starting index in excel is 0)
    var newValues = SITEPENDING.getRange(2,3,rows,cols).getValues();
 
   Logger.log(newValues)

  // Row number to search on in values starting form field after Approve - since newValues array is already collected with an offset
  var SITESEARCH_COL_IDX_IN_PENDING = 4
  
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
    Logger.log(row[SITESEARCH_COL_IDX_IN_MAIN-1])
    if(row[SITESEARCH_COL_IDX_IN_MAIN-1] == response){
      Logger.log("Column found in main.. Updating")
      INT_ROW = i+1
      // Updating...
      // Find new values from the pending option sheet
     
      for (var i=0;i<newValues.length;i++){
        
        // Offset by 2 since loop count starts from 0 and first row is header names
        var newRow = newValues[i]
        if(newRow[SITESEARCH_COL_IDX_IN_PENDING-1] == response){
           ROW_NUM_PENDING_SHEET = i+2
           Logger.log(newValues.length)
           Logger.log("Column found in pending sheet.. Adding new values")
              for (var i=0;i<newRow.length;i++){
                if (newRow[i] !=""){
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
       MAINSHEET.getRange(INT_ROW,1,1,inputValues.length).setValues([inputValues]); 
       clearCellForRange(ROW_NUM_PENDING_SHEET,SITEPENDING,inputValues.length) 
     } else {
      // Completely new field 
     Logger.log("Adding a new row in the main sheet")
     for (var i=0;i<newValues.length;i++){
        var newRow = newValues[i]
        Logger.log(newRow[SITESEARCH_COL_IDX_IN_PENDING-1])
      if(newRow[SITESEARCH_COL_IDX_IN_PENDING-1] == response ){
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
      inputValues.push(SITEMAINSHEET.getDataRange().getNumRows())
      }
     Logger.log(inputValues) 
     SITEMAINSHEET.getRange(SITEMAINSHEET.getLastRow()+1,1,1,inputValues.length).setValues([inputValues]); 
     Logger.log(ROW_NUM_PENDING_SHEET) 
     clearCellForRange(ROW_NUM_PENDING_SHEET,SITEPENDING,inputValues.length) 
   }
    } else if(input.getSelectedButton == ui.Button.CANCEL){
      
  } 



  }
   
function onSiteDeny() {
  // Row number to search on in values starting form field after Approve - since newValues array is already collected with an offset
  var SITESEARCH_COL_IDX_IN_PENDING = 4
  var rows = SITEPENDING.getDataRange().getNumRows()
  var cols = SITEPENDING.getDataRange().getNumColumns();

  Logger.log("Denying approval")
  // Used for clearing denied row
   var ROW_NUM_PENDING_SHEET 
   var ui = SpreadsheetApp.getUi()
   var inputValues=[]
   var input = ui.prompt("Enter site name to deny!..", ui.ButtonSet.OK_CANCEL);
  
  if(input.getSelectedButton() == ui.Button.OK){
  // Read input name from denier
  var response = input.getResponseText()
  Logger.log("Input name")
  Logger.log(response)
  var newValues = SITEPENDING.getRange(2,3,rows,cols).getValues();
  Logger.log("Pending sheet data read..")
  Logger.log(newValues)
  
  for (var i=0;i<newValues.length;i++){
      var newRow = newValues[i]
      
      if(newRow[SITESEARCH_COL_IDX_IN_PENDING-1] == response){
          Logger.log("Matching row found in pending sheet..")
          // Offset by 2 since loop count starts from 0 and first row is header names
          ROW_NUM_PENDING_SHEET = i+2
          for (var i=0;i<newRow.length;i++){
                inputValues.push(newRow[i]);   
              }
    } else {
       SpreadsheetApp.getUi().prompt("No matching name!!")
        Logger.log("No matching name!!")
        return
    }
  }
  clearCellForRange(ROW_NUM_PENDING_SHEET,SITEPENDING,inputValues.length) 
      }
} 
  

