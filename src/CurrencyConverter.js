import axios from 'axios'
import React, { useEffect, useState } from 'react'

const CurrencyConverter = () => {
  const [currencies, setCurrencies] = useState([])
  const [fromCurrency, setFromCurrency] = useState('')
  const [toCurrency, setToCurrency] = useState('')
  const [exchangeRate, setExchangeRate] = useState(0)
  const [amount, setAmount] = useState(0)
  const [convertedAmount, setConvertedAmount] = useState(0)

  // Загрузка списка доступных валют из API
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD')
        const data = response.data
        const currencyList = Object.keys(data.rates)
        setCurrencies(currencyList)
        setFromCurrency(currencyList[0])
        setToCurrency(currencyList[1])
        setExchangeRate(data.rates[currencyList[1]])
      } catch (error) {
        console.error('Error fetching currencies:', error)
      }
    }

    fetchCurrencies()
  }, [])

  // Обновление курса обмена при изменении выбранных валют
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
        const data = response.data
        setExchangeRate(data.rates[toCurrency])
      } catch (error) {
        console.error('Error fetching exchange rate:', error)
      }
    }

    fetchExchangeRate()
  }, [fromCurrency, toCurrency])

  // Обработчик изменения выбранной валюты "из"
  const handleFromCurrencyChange = (event) => {
    setFromCurrency(event.target.value)
  }

  // Обработчик изменения выбранной валюты "в"
  const handleToCurrencyChange = (event) => {
    setToCurrency(event.target.value)
  }

  // Обработчик изменения суммы
  const handleAmountChange = (event) => {
    setAmount(event.target.value)
  }

  // Обработчик нажатия на кнопку "Поменять местами"
  const handleSwapCurrencies = () => {
    const temp = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(temp)
  }

  // Выполнение конвертации валют
  useEffect(() => {
    setConvertedAmount((amount * exchangeRate).toFixed(2))
  }, [amount, exchangeRate])

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
        <input type="text" value={convertedAmount} readOnly />
      </div>
      <button className='button' onClick={handleSwapCurrencies}>Поменять туда сюда

      </button>
    </div>
  )
}

export default CurrencyConverter
