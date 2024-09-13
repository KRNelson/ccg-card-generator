const ROCK = 'ROCK';
const PAPER = 'PAPER';
const SCISSORS = 'SCISSORS';

const WIN = 1;
const TIE = 0;
const LOSE = -1;

class Player {
    constructor(hand_limit) {
        this.games = [];
        this.hand = Array(hand_limit).fill(undefined);
        this.hand_limit = hand_limit;
        this.current_played = '';
        this.current_result = WIN;
    }

    addCard(card) {
        this.hand.push(card);
    }

    fullHand() {
        return this.hand.filter(card => card !== undefined).length >= this.hand_limit;
    }

    emptyHand() {
        return this.hand.filter(card => card !== undefined).length === 0;
    }

    play() {
        this.current_played = this.hand.pop();
        return this.current_played;
    }

    compare(opponent) {
        if(this.current_played === opponent.current_played) return TIE;
        switch(this.current_played) {
            case 'ROCK':
                return (opponent.current_played==='SCISSORS')?WIN:LOSE;
            case 'PAPER':
                return (opponent.current_played==='ROCK')?WIN:LOSE;
            case 'SCISSORS':
                return (opponent.current_played==='PAPER')?WIN:LOSE;
            default:
                return TIE;
        }
    }
}

class Deck {
    constructor(deck_size) {
        this.deck = Array(deck_size).fill(0).map(this.#hand);
    }

    shuffle() {
        this.deck = this.deck
                        .map(card => ({card, sort: Math.random()}))
                        .sort((a, b) => a.sort - b.sort)
                        .map(({card}) => card)
    }

    draw() {
        return this.deck.pop();
    }

    empty() {
        return this.deck.length === 0;
    }

    #hand(_, i) {
        const h = i % 3;
        switch(h) {
            case 0: return 'ROCK';
            case 1: return 'PAPER';
            case 2: return 'SCISSORS';
            default: return '';
        }
    }
}

class Game {
    constructor(players, deck_size, hand_limit) {
        this.players = Array(players).fill(0).map(() => new Player(hand_limit));
        this.deck = new Deck(deck_size);
    }

    start(shuffles) {
        Array.from({length: shuffles}, () => this.deck.shuffle());
        this.play();
    }

    deal() {
        this.players.forEach(player => {
            while(!player.fullHand() && !this.deck.empty()) {
                player.addCard(this.deck.draw());
            }
        })
    }

    round() {

        for(let index=0; index<this.players.length; index++) {
            this.players[index].current_result = WIN;
            this.players[index].current_played = '';
            this.players[index].current_played = this.players[index].play();
        }

        for(let index=0; index<this.players.length; index++) {
            const player = this.players[index];
            const nextIndex = (this.players.length-1===index)?0:index+1;
            const nextPlayer = this.players[nextIndex];
            player.current_result = player.compare(nextPlayer);
            player.games.push(player.current_result);
            this.players[index] = player;
        }
    }

    play() {
        while(!this.deck.empty()) {
            this.deal();
            this.round();
        }

        while(this.players.filter(player => !player.emptyHand()).length>1) {
            this.round();
        }
    }

    results() {
        return this.players.map(player => ({
            wins: player.games.filter(game => game===WIN).length
            , lose: player.games.filter(game => game===LOSE).length
            , tie: player.games.filter(game => game===TIE).length
        }))
    }
}

const game = new Game(5, 60, 6);
game.start(50);

console.log("Game Results", game.results());
