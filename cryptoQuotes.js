/**
 * Fetches cryptocurrency symbols from the first column of the specified sheet.
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - The sheet to read symbols from
 * @returns {string} Comma-separated string of symbols
 */
function fetchSymbolsFromSheet(sheet) {
  const values = sheet.getRange("A:A").getValues();
  
  // Filter out empty cells and skip header row
  return values
    .filter((row, index) => index > 0 && row[0]) // Skip header and empty cells
    .map(row => row[0].toString().trim().toUpperCase()) // Normalize symbol format
    .filter((symbol, index, self) => self.indexOf(symbol) === index) // Remove duplicates
    .join(',');
}

/**
 * Parses the API response into a Map of symbols to their prices.
 * @param {Object} apiResponse - The raw API response from CoinMarketCap
 * @returns {Map<string, number>} Map where keys are symbols and values are prices
 */
function parseCryptoData(apiResponse) {
  const priceMap = new Map();
  
  if (!apiResponse?.data) {
    Logger.log('No data in API response');
    return priceMap;
  }
  
  Object.entries(apiResponse.data).forEach(([symbol, coinData]) => {
    const coin = Array.isArray(coinData) ? coinData[0] : null;
    const price = coin?.quote?.USD?.price;
    
    if (price !== undefined) {
      priceMap.set(symbol, price);
    }
  });
  
  return priceMap;
}

/**
 * Fetches cryptocurrency data from the CoinMarketCap API.
 * @param {string} symbols - Comma-separated string of cryptocurrency symbols
 * @returns {Map<string, number>} Map of symbols to their prices
 */
function fetchDataFromAPI(symbols) {
  const baseUrl = 'https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest';
  const params = `symbol=${encodeURIComponent(symbols)}&skip_invalid=false&aux=num_market_pairs`;
  
  const options = {
    method: 'GET',
    headers: {
      'X-CMC_PRO_API_KEY': PropertiesService.getScriptProperties().getProperty('API_TOKEN'),
      'Accept': 'application/json',
    },
    muteHttpExceptions: true // To handle API errors gracefully
  };
  
  try {
    const response = UrlFetchApp.fetch(`${baseUrl}?${params}`, options);
    const data = JSON.parse(response.getContentText());
    
    if (response.getResponseCode() !== 200) {
      Logger.log(`API Error: ${data.status?.error_message || 'Unknown error'}`);
      return new Map();
    }
    
    return parseCryptoData(data);
  } catch (error) {
    Logger.log(`API Request Failed: ${error.message}`);
    return new Map();
  }
}

/**
 * Updates the specified sheet with the latest cryptocurrency prices.
 * Prices are written to column D, next to corresponding symbols in column A.
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - The sheet to update with prices
 * @returns {string} Status message indicating success or failure
 */
function updateSheetWithPrices(sheet) {
  if (!sheet) {
    throw new Error('No sheet provided');
  }
  
  try {
    // Get and validate symbols
    const symbols = fetchSymbolsFromSheet(sheet);
    if (!symbols) {
      const message = 'No valid symbols found in column A';
      Logger.log(message);
      return message;
    }
    
    // Fetch and process data
    const priceMap = fetchDataFromAPI(symbols);
    if (priceMap.size === 0) {
      return 'No price data available for the given symbols';
    }
    
    // Prepare data for writing to sheet
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) return 'No data rows found';
    
    const symbolRange = sheet.getRange(2, 1, lastRow - 1, 1);
    const symbolValues = symbolRange.getValues();
    
    const priceUpdates = symbolValues.map(([symbol]) => {
      const normalizedSymbol = symbol?.toString().trim().toUpperCase();
      return [priceMap.get(normalizedSymbol) || ''];
    });
    
    // Write updates to the sheet
    sheet.getRange(2, 4, priceUpdates.length, 1).setValues(priceUpdates);
    
    return `Updated ${priceMap.size} cryptocurrency prices successfully`;
    
  } catch (error) {
    const errorMessage = `Error updating prices: ${error.message}`;
    Logger.log(errorMessage);
    return errorMessage;
  }
}
