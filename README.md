# Crypto Portfolio Tracker for Google Sheets

A Google Apps Script project that tracks cryptocurrency portfolio values in real-time. This project uses the CoinMarketCap API to fetch current cryptocurrency prices and calculates the total USD value of your holdings in a Google Sheet.

## Features

- Fetches real-time cryptocurrency prices from CoinMarketCap API
- Tracks your cryptocurrency portfolio in a Google Sheet
- Easy-to-use menu integration in Google Sheets
- Updates prices automatically when the sheet is opened

## Prerequisites

Before you begin, ensure you have the following:

1. A Google account with access to Google Sheets
2. Node.js and npm installed on your local machine (for local development)
3. A CoinMarketCap API key (get one from [CoinMarketCap API](https://coinmarketcap.com/api/))
4. Google Cloud Project with Apps Script API enabled

## Setting Up the Portfolio Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Add a new Spreadsheet or using an existing one, then create a new sheet and name it "Crypto"
3. Add the following headers in row 1:
    - Symbol (e.g., BTC, ETH, CRO, USDT)
    - Exchange (e.g., Binance, Coinbase)
    - Amount (your holdings)
    - Rate (current price, auto-filled)
    - USD (total value, auto-calculated when you create the formula `=C2*D2`)

## Installation

### Method 1: Manual Setup (Easiest)

1. On your Google Spreadsheet, Click on "Extensions" > "Apps Script"
2. Delete any code in the editor
3. Copy the contents of `Code.js` and `cryptoQuotes.js` into the editor, but make sure they have a `.gs` extension
4. Save the project

### Method 2: Using clasp (For Development)

1. Install the clasp CLI tool globally:
   ```bash
   npm install -g @google/clasp
   ```

2. Log in to your Google account:
   ```bash
   clasp login
   ```

3. Clone this repository and navigate to the project directory

4. Initialize a new Apps Script project:
   ```bash
   clasp create --type sheets --title "Crypto Portfolio Tracker"
   ```

5. Push the code to your Google Apps Script project:
   ```bash
   clasp push
   ```

## Configuration

### Setting Up API Key

1. After setting up the script, click on the project name in the Apps Script editor
2. Go to "Project Settings" (gear icon)
3. Under "Script Properties", click "Add Script Property"
4. Add a property with:
   - Key: `API_TOKEN`
   - Value: Your CoinMarketCap API key

## Setting Up the On-Open Trigger

1. In the Apps Script editor, click on the clock icon ("Triggers") in the left sidebar
2. Click "+ Add Trigger" in the bottom right corner
3. Set up the trigger with these settings:
   - Choose which function to run: `cryptoQuotesUpdate`
   - Choose which deployment should run: `Head`
   - Select event source: `From spreadsheet`
   - Select event type: `On open`
4. Click "Save"

## Usage

1. Open your Google Sheet
2. The script will automatically fetch the latest prices when the sheet is opened
3. To manually update prices, click on the "Crypto Tools" menu in the toolbar
4. Select "Update Prices" from the dropdown menu

## Troubleshooting

- **Missing 'Crypto' Sheet**: Ensure you've created a sheet named exactly "Crypto" with the correct headers
- **API Key Issues**: Verify your CoinMarketCap API key is correctly set in the script properties with the key `API_TOKEN`
- **Permissions**: Make sure to authorize all required permissions when prompted
- **Execution Logs**: Check the execution logs in the Apps Script editor under "Executions" to see detailed error messages and logs
- **Quota Limits**: Free CoinMarketCap API keys have rate limits. If you hit the limit, there will be errors in the execution logs

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [CoinMarketCap API](https://coinmarketcap.com/api/)
- [Google Apps Script](https://developers.google.com/apps-script)
- [clasp](https://github.com/google/clasp) - Command line tool for Google Apps Script development
