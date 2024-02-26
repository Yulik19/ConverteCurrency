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
  const [amount, setAmount] = useState('')
  const [convertedAmount, setConvertedAmount] = useState(0)

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get(`${API_ENDPOINT}/latest/USD`, {
          headers: {
            'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
          }
        })
        const data = response.data
        const currencyList = Object.keys(data.conversion_rates)
        setCurrencies(currencyList)
        setFromCurrency(currencyList[0])
        setToCurrency(currencyList[1])
        setExchangeRate(data.conversion_rates[currencyList[1]])
      } catch (error) {
        console.error('Error fetching currencies:', error)
      }
    }

    fetchCurrencies()
  }, [])

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await axios.get(`${API_ENDPOINT}/latest/${fromCurrency}`, {
          headers: {
            'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Methods": "GET,PUT,POST"

          }
        })
        const data = response.data
        setExchangeRate(data.conversion_rates[toCurrency])
      } catch (error) {
        console.error('Error fetching exchange rate:', error)
      }
    }

    fetchExchangeRate()
  }, [fromCurrency, toCurrency])

  const handleFromCurrencyChange = (event) => {
    setConvertedAmount('')
    setAmount('')
    setFromCurrency(event.target.value)
  }

  const handleToCurrencyChange = (event) => {
    setConvertedAmount('')
    setAmount('')
    setToCurrency(event.target.value)
  }

  const handleAmountChange = (event) => {
    const value = event.target.value.replace(/\D/g, '')
    setAmount(value)
    setConvertedAmount(((parseFloat(value) * exchangeRate) || '').toFixed(2))
  }
  const handleConvertedAmountChange = (event) => {
    const value = event.target.value.replace(/\D/g, '')
    setConvertedAmount(value)
    setAmount(((parseFloat(value) / exchangeRate).toFixed(2) || ''))
  }
  const handleSwapCurrencies = () => {
    const tempFromCurrency = fromCurrency
    const tempToCurrency = toCurrency
    setFromCurrency(tempToCurrency)
    setToCurrency(tempFromCurrency)
  }

  useEffect(() => {
    setConvertedAmount((amount * exchangeRate).toFixed(2) || '')
  }, [amount, exchangeRate, fromCurrency, toCurrency])

  return (
    <div>
      <h2>Конвертер валют</h2>
      <div>
        <label>Перевод из:</label>
        <select value={fromCurrency} onChange={handleFromCurrencyChange}>
          {currencies.map((currency) => (
            <option key={currency}>{currency}</option>
          ))}
        </select>
        <input type="contenteditable" value={amount} onChange={handleAmountChange} />
      </div>
      <div>
        <label>Перевод в:   </label>
        <select value={toCurrency} onChange={handleToCurrencyChange}>
          {currencies.map((currency) => (
            <option key={currency}>{currency}</option>
          ))}
        </select>
        <input type="text" value={convertedAmount} onChange={handleConvertedAmountChange} />
      </div>
      <button className='button' onClick={handleSwapCurrencies}>Поменять туда сюда

      </button>
    </div>
  )
}

export default CurrencyConverter
