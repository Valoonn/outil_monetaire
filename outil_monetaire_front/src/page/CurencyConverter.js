import './Home.css';
import React, { useState} from 'react';
import axios from 'axios'
import Select from 'react-select';
import TextField from '@material-ui/core/TextField';
import "../App.css";

function CurencyConverter() {

  const [currencies, setCurrencies] = useState([]);
  const [money, setMoney] = useState("");
  const [baseCurrency, setBaseCurrency] = useState("");
  const [wantCurrency, setWantCurrency] = useState("");
  const [convertionRes, setConvertionRes] = useState("");
  const [convertionInfo, setConvertionInfo] = useState("");

  React.useEffect(() => {
    var options = {
      method: 'GET',
      url: 'https://currency-converter5.p.rapidapi.com/currency/list',
      headers: {
        'x-rapidapi-host': 'currency-converter5.p.rapidapi.com',
        'x-rapidapi-key': '041a10258emshd33fa121218036cp11f35djsn43b4c261d1b6'
      }
    };

    axios.request(options).then(function (response) {
      const tmp_list = [];
      for(var i in response.data.currencies)
        tmp_list.push({label: `${i} - ${response.data.currencies[i]}`, value: i});
      setCurrencies(tmp_list);
    }).catch(function (error) {
      console.error(error);
    });
  }, []);

    function convertionResult() {
      setConvertionRes(`${money} ${baseCurrency} => ...${wantCurrency}`)
      var options = {
        method: 'GET',
        url: 'https://currency-converter5.p.rapidapi.com/currency/convert',
        params: {format: 'json', from: baseCurrency, to: wantCurrency, amount: money},
        headers: {
          'x-rapidapi-host': 'currency-converter5.p.rapidapi.com',
          'x-rapidapi-key': '041a10258emshd33fa121218036cp11f35djsn43b4c261d1b6'
        }
      };

      axios.request(options).then(function (response) {
        const tmpMoney = parseFloat(response.data.rates[wantCurrency].rate_for_amount);
        const changeRate = parseFloat(response.data.rates[wantCurrency].rate);
        setConvertionRes(`${money} ${baseCurrency} => ${tmpMoney.toFixed(2)} ${wantCurrency}`)
        setConvertionInfo(`1 ${baseCurrency} => ${changeRate.toFixed(2)} ${wantCurrency}`)
      }).catch(function (error) {
        console.error(error);
      });
    }

  return (
    <div className="container">
      <div className="currency_converter_form">
        <label>Monnaie de base</label>
        <Select options={currencies} className="react-input" onChange={opt => setBaseCurrency(opt.value)}/>
        <label>Monnaie apres convertion</label>
        <Select options={currencies} className="react-input" onChange={opt => setWantCurrency(opt.value)}/>
        <TextField id="outlined-basic" label="Montant" variant="outlined" className="montant_field" onChange={ (event) => setMoney(event.target.value) }/>
        <button onClick={convertionResult}>Convertir !</button>
        <p>{convertionRes}</p>
        <p>{convertionInfo}</p>
        </div>
    </div>

  );
}

export default CurencyConverter;
