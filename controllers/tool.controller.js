const puppeteer = require('puppeteer')
const NodeCache = require( "node-cache" );

const myCache = new NodeCache();

// module.exports.checkPriceLow = async (req, res, next) => {
//   try {
//     (async () => {

//       const browser = await puppeteer.launch({
//         headless: true,
//         args: [
//           '--no-sandbox',
//         ]
//       });

//       const page = await browser.newPage()
//       await page.setViewport({ width: 0, height: 0 })
//       await page.goto(`https://www.tokencan.com/en_US/trade/HGL_USDT`, {
//         waitUntil: "networkidle2",
//         timeout: 0,
//       });

//       const priceSelector = ".trade-table-list-container .symbol-item .td-symbol .hover_hide"
//       const priceSellSelector = ".trade-table-list-container .asksOPtion .symbol-item .td-symbol .hover_hide"
//       const amountSelector = ".trade-table-list-container .symbol-item .td-price"

//       const listBuySell = await page.evaluate((priceSelector, priceSellSelector, amountSelector) => {
//         const listSell = []
//         const listBuy = []

//         const listPrice = document.querySelectorAll(priceSelector)
//         const listSellNode = document.querySelectorAll(priceSellSelector)
//         listPrice.forEach((item, index) => {
//           if (index + 1 <= listSellNode.length) listSell.push({ price: Number(item.innerText) })
//           else listBuy.push({ price: Number(item.innerText) })
//         })

//         const listAmount = document.querySelectorAll(amountSelector)
//         listAmount.forEach((item, index) => {
//           if (index + 1 <= 24) {
//             listSell[index] ? listSell[index].amount = Number(item.innerText) : console.log('Error');
//           }
//           else {
//             listBuy[index - 24] ? listBuy[index - 24].amount = Number(item.innerText) : console.log('Error');
//           }
//         })
//         return { listSell, listBuy }
//       }, priceSelector, priceSellSelector, amountSelector);

//       await browser.close();

//       let sell = req.body.sell_price ? listBuySell.listSell.filter((item, index) => item.price === req.body.sell_price) : []
//       let buy = req.body.buy_price ? listBuySell.listBuy.filter((item, index) => item.price === req.body.buy_price) : []

//       if (sell[0]) sell = sell[0]
//       else sell = null

//       if (buy[0]) buy = buy[0]
//       else buy = null

//       return res.status(200).json({ status: 1, data: { sell, buy } })
//     })()
//   } catch (err) {
//     return res.status(500).json({ status: 0, data: err })
//   }
// }

module.exports.checkPriceLow = async (req, res, next) => {
  try {
    (async () => {

      const browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--single-process',
        ]
      });

      const page = await browser.newPage()
      await page.setViewport({ width: 0, height: 0 })
      await page.goto(`https://www.dcoin.com/currencyTrading/AGC_USDT`, {
        waitUntil: "networkidle2",
        timeout: 0,
      });

      const priceSelector = ".order-books .list .price"
      const priceSellSelector = ".order-books .list .price.color-sell-en"
      const amountSelector = ".order-books .list .amount"

      const listBuySell = await page.evaluate((priceSelector, priceSellSelector, amountSelector) => {
        const listSell = []
        const listBuy = []

        const listPrice = document.querySelectorAll(priceSelector)
        const listSellNode = document.querySelectorAll(priceSellSelector)
        listPrice.forEach((item, index) => {
          if (index + 1 <= listSellNode.length) listSell.push({ price: Number(item.innerText) })
          else listBuy.push({ price: Number(item.innerText) })
        })

        const listAmount = document.querySelectorAll(amountSelector)
        listAmount.forEach((item, index) => {
          if (index + 1 <= listSellNode.length) {
            listSell[index] ? listSell[index].amount = Number(item.innerText) : console.log('Error');
          }
          else {
            listBuy[index - listSellNode.length] ? listBuy[index - listSellNode.length].amount = Number(item.innerText) : console.log('Error');
          }
        })
        return { listSell, listBuy }
      }, priceSelector, priceSellSelector, amountSelector);

      await browser.close();

      let sell = req.body.sell_price ? listBuySell.listSell.filter((item, index) => item.price === req.body.sell_price) : []
      let buy = req.body.buy_price ? listBuySell.listBuy.filter((item, index) => item.price === req.body.buy_price) : []

      if (sell[0]) sell = sell[0]
      else sell = null

      if (buy[0]) buy = buy[0]
      else buy = null

      return res.status(200).json({ status: 1, data: { sell, buy } })
    })()
  } catch (err) {
    return res.status(500).json({ status: 0, data: err })
  }
}