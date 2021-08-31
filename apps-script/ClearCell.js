//.gs
function clearCell(formSheet, rangeToClear){
  var sheet = SpreadsheetApp.getActiveSpreadsheet()
  for (var i=0;i<rangeToClear.length;i++){
    formSheet.getRange(rangeToClear[i]).clearContent();
  }
}

function clearCellForRange(row, form, colLength){
  
  form.getRange(row,1,1,colLength).clearContent()
 
}
