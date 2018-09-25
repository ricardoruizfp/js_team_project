const PubSub = require('../helpers/pub_sub');

const scoreData = [
    500, 1000, 2000, 5000, 10000, 20000, 50000, 75000, 150000, 250000, 500000, 1000000
    ];

const Score = function() {
    this.cryptoConversionFactors = null;
    this.scoreArrayPosition = -1;  
    this.currentScore = scoreData[this.scoreArrayPosition];
}

Score.prototype.bindEvents = function () {
    PubSub.subscribe('Game:start-new-game', () => {
        this.resetScore();
    });

    PubSub.subscribe('Game:correct-answer-submitted', () => {
        this.incrementScore();
    });

    PubSub.subscribe('CryptoCurrency:crypto-conversion-data-ready', (event)=>{
        this.cryptoConversionFactors = event.detail;        
        console.log('score conversion factor:', this.cryptoConversionFactors);
    })

}

Score.prototype.incrementScore = function(){
    this.scoreArrayPosition ++;
    this.currentScore = scoreData[this.scoreArrayPosition];
    this.createScoreOptions();
    console.log('Score increased');
    console.log('Score is now:', this.currentScore);
    PubSub.publish('Score:score-updated', this.currentScore);
}

Score.prototype.createScoreOptions = function(){
    const bitcoinObject = this.createScoreOption('Bitcoin', 'BTC');
    const etheriumObject = this.createScoreOption('Etherium', 'ETH');
    const dogecoinObject = this.createScoreOption('Dogecoin', 'DOGE');
    const rippleObject = this.createScoreOption('Ripple', 'XRP')
    console.log(bitcoinObject);
    const scoreOptions = [bitcoinObject, etheriumObject, dogecoinObject, rippleObject];
    PubSub.publish('Score:score-options-for-question', scoreOptions);

}

Score.prototype.resetScore = function () {
    this.currentScore = 0;
    this.scoreArrayPosition = -1;
    console.log('score reset');
    console.log('Score is now:', this.currentScore);
    PubSub.publish('Score:score-updated', this.currentScore);
}

Score.prototype.createScoreOption = function(currency, symbol){
    const score = this.currentScore;
    const value = this.convertCryptoScoreIntoGBP(symbol, score);
    const optionObject = {
        value: value,
        currency: currency,
        symbol: symbol
    }
    return optionObject;
}

Score.prototype.convertCryptoScoreIntoGBP = function(currency, score){
    const cryptoConversionFactor = this.cryptoConversionFactors[currency].GBP;
    return this.convertedBTCScore = (score / cryptoConversionFactor);
}

module.exports = Score;