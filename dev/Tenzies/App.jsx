import { useState } from "react"
import Die from "./Die"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"

export default function App() {
    const [dice, setDice] = useState(() => generateAllNewDice())
    
    /**
     * Challenge:
     * Make it so when the game is over, the "New Game" button
     * automatically receives keyboard focus so keyboard users
     * can easily trigger that button without having to tab
     * through all the dice first.
     * 
     * Hints:
     * 1. Focusing a DOM element with the DOMNode.focus() method
     *    requires accessing the native DOM node. What tool have
     *    we learned about that allows us to do that?
     * 
     * 2. Automatically calling the .focus() on a DOM element when
     *    the game is won requires us to synchronize the local
     *    `gameWon` variable with an external system (the DOM). What
     *    tool have we learned about that allows us to do that?
     */

    const gameWon = dice.every(die => die.isHeld) &&
        dice.every(die => die.value === dice[0].value)

    function generateAllNewDice() {
        return new Array(10)
            .fill(0)
            .map(() => ({
                // value: Math.ceil(Math.random() * 6),
                value: 5,
                isHeld: false,
                id: nanoid()
            }))
    }
    
    function rollDice() {
        if (!gameWon) {
            setDice(oldDice => oldDice.map(die =>
                die.isHeld ?
                    die :
                    { ...die, value: Math.ceil(Math.random() * 6) }
            ))
        } else {
            setDice(generateAllNewDice())
        }
    }

    function hold(id) {
        setDice(oldDice => oldDice.map(die =>
            die.id === id ?
                { ...die, isHeld: !die.isHeld } :
                die
        ))
    }

    const diceElements = dice.map(dieObj => (
        <Die
            key={dieObj.id}
            value={dieObj.value}
            isHeld={dieObj.isHeld}
            hold={() => hold(dieObj.id)}
        />
    ))

    return (
        <main>
            {gameWon && <Confetti />}
            <div aria-live="polite" className="sr-only">
                {gameWon && <p>Congratulations! You won! Press "New Game" to start again.</p>}
            </div>
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button className="roll-dice" onClick={rollDice}>
                {gameWon ? "New Game" : "Roll"}
            </button>
        </main>
    )
}