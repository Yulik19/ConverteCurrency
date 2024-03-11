import axios from 'axios'
import React, { useEffect, useState } from 'react'
const API_URL = 'https://v6.exchangerate-api.com/v6/'
const API_KEY = process.env.REACT_APP_API_KEY_YT
const API_ENDPOINT = `${API_URL}${API_KEY}`
const CurrencyConverter = () => {
  const [currencies, setCurrencies] = useState([])
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('')
  const [exchangeRate, setExchangeRate] = useState(0)
  const [amount, setAmount] = useState(0)
  const [convertedAmount, setConvertedAmount] = useState(0)

  const fetchCurrenciesAndRates = async (from, to) => {
    try {
      const response = await axios.get(`${API_ENDPOINT}/latest/${from}`, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST',
        },
      })
      const data = response.data
      const currencyList = Object.keys(data.conversion_rates)
      setCurrencies(currencyList)
      setToCurrency(currencyList[1])
      setExchangeRate(data.conversion_rates[to])
    } catch (error) {
      console.error('Error fetching currencies and rates:', error)
    }
  }

  useEffect(() => {
    fetchCurrenciesAndRates('USD', 'USD')
  }, [])

  const handleCurrencyChange = (event, setState) => {
    setConvertedAmount(0)
    setAmount(0)
    setState(event.target.value)
  }
  const roundToTwo = (num) => {
    return Math.round(num * 100) / 100
  }
  const handleValueChange = (value, setMainValue, setConvertedValue, exchangeRate) => {
    const parsedValue = parseFloat(value)

    if (!isNaN(parsedValue)) {
      setMainValue(roundToTwo(parsedValue))
      setConvertedValue(roundToTwo(parsedValue * exchangeRate))
    } else {
      setMainValue(0)
      setConvertedValue(0)
    }
  }
  const handleAmountChange = (event) => {
    const value = event.target.value.replace(/[^\d.]/g, '')
    handleValueChange(value, setAmount, setConvertedAmount, exchangeRate)
  }
  const handleConvertedAmountChange = (event) => {
    const value = event.target.value.replace(/[^\d.]/g, '')
    handleValueChange(value, setConvertedAmount, setAmount, 1 / exchangeRate)
  }
  const handleSwapCurrencies = () => {
    const tempFromCurrency = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(tempFromCurrency)
    fetchCurrenciesAndRates(toCurrency, tempFromCurrency)
  }

  useEffect(() => {
    setConvertedAmount(roundToTwo(amount * exchangeRate))
  }, [amount, exchangeRate])
  return (
    <div>
      <h2>Конвертер валют</h2>
      <div>
        <label>Перевод из:</label>
        <select value={fromCurrency} onChange={(event) => handleCurrencyChange(event, setFromCurrency)}>
          {currencies.map((currency) => (
            <option key={currency}>{currency}</option>
          ))}
        </select>
        <input type="contenteditable" value={amount} onChange={handleAmountChange} />
      </div>
      <div>
        <label>Перевод в:</label>
        <select value={toCurrency} onChange={(event) => handleCurrencyChange(event, setToCurrency)}>
          {currencies.map((currency) => (
            <option key={currency}>{currency}</option>
          ))}
        </select>
        <input type="text" value={convertedAmount} onChange={handleConvertedAmountChange} />
      </div>
      <button className='button' onClick={handleSwapCurrencies}>Поменять туда сюда</button>
    </div>
  )
}

export default CurrencyConverter
