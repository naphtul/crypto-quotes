function cryptoQuotesUpdate() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Crypto');
  if (!sheet) {
    SpreadsheetApp.getUi().alert('Error: Could not find sheet named "Crypto"');
    return;
  }
  updateSheetWithPrices(sheet);
}

/**
 * Creates a custom menu in Google Sheets to run the price update.
 * This function is automatically called by Google Apps Script when the sheet is opened.
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Crypto Tools')
    .addItem('Update Prices', 'cryptoQuotesUpdate')
    .addToUi();
}
