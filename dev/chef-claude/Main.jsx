import React from "react"
import { getRecipeFromSpoonacular } from "./ai"

export default function Main() {
    const [ingredients, setIngredients] = React.useState([])
    const [newIngredient, setNewIngredient] = React.useState("")
    const [error, setError] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)
    const [suggestedRecipe, setSuggestedRecipe] = React.useState(null)
    const [showNotification, setShowNotification] = React.useState(true)

    function handleSubmit(e) {
        e.preventDefault()
        const trimmedIngredient = newIngredient.trim().toLowerCase()
        
        if (trimmedIngredient) {
            // Check if ingredient already exists
            if (ingredients.some(ing => ing.toLowerCase() === trimmedIngredient)) {
                setError("This ingredient is already in your list!")
                return
            }
            setIngredients(prevIngredients => [...prevIngredients, trimmedIngredient])
            setNewIngredient("")
            setError("")
            setShowNotification(false)
        }
    }

    function removeIngredient(index) {
        setIngredients(prevIngredients => prevIngredients.filter((_, i) => i !== index))
    }

    async function handleGetRecipe() {
        if (ingredients.length < 4) {
            setError("Please add at least 4 ingredients to generate a recipe")
            return
        }

        setIsLoading(true)
        setError("")
        setSuggestedRecipe(null)

        try {
            const recipe = await getRecipeFromSpoonacular(ingredients)
            if (recipe) {
                setSuggestedRecipe({
                    title: recipe.title,
                    ingredients: recipe.ingredients || [],
                    instructions: recipe.instructions || [],
                    sourceUrl: recipe.sourceUrl || "#",
                    readyInMinutes: recipe.readyInMinutes,
                    servings: recipe.servings
                })
            } else {
                setError("Failed to generate recipe. Please try again later.")
            }
        } catch (error) {
            console.error("Error generating recipe:", error)
            setError("Failed to generate recipe. Please try again later.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main>
            <div className="container">
                <form className="add-ingredient-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={newIngredient}
                        onChange={(e) => setNewIngredient(e.target.value)}
                        placeholder="Add an ingredient..."
                        required
                    />
                    <button type="submit">Add</button>
                </form>

                {showNotification && (
                    <div className="notification">
                        <p>Start by adding at least 4 ingredients to generate a recipe!</p>
                    </div>
                )}

                {error && <p className="error-message">{error}</p>}

                <div className="ingredients-section">
                    <h3>Your Ingredients ({ingredients.length})</h3>
                    <ul className="ingredients-list">
                        {ingredients.map((ingredient, index) => (
                            <li key={index}>
                                {ingredient}
                                <button 
                                    className="remove-ingredient"
                                    onClick={() => removeIngredient(index)}
                                    aria-label="Remove ingredient"
                                >
                                    ×
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="container">
                <div className="get-recipe-container">
                    <h3>Ready to Cook?</h3>
                    <p>Click the button below to generate a recipe using your ingredients!</p>
                    <button 
                        onClick={handleGetRecipe} 
                        disabled={ingredients.length < 4 || isLoading}
                        className={ingredients.length >= 4 ? "active" : ""}
                    >
                        {isLoading ? (
                            <span className="loading-spinner">Generating Recipe...</span>
                        ) : (
                            "Generate Recipe"
                        )}
                    </button>
                    {ingredients.length > 0 && ingredients.length < 4 && (
                        <p className="ingredient-requirement">
                            Add {4 - ingredients.length} more ingredient{4 - ingredients.length !== 1 ? 's' : ''} to generate a recipe
                        </p>
                    )}
                </div>
            </div>

            {suggestedRecipe && (
                <div className="container">
                    <div className="suggested-recipe-container">
                        <h2>{suggestedRecipe.title}</h2>
                        <div className="recipe-meta">
                            <span>⏱️ {suggestedRecipe.readyInMinutes} minutes</span>
                            <span>👥 {suggestedRecipe.servings} servings</span>
                        </div>
                        <h3>Ingredients:</h3>
                        <ul>
                            {suggestedRecipe.ingredients.map((ingredient, index) => (
                                <li key={index}>{ingredient}</li>
                            ))}
                        </ul>
                        <h3>Instructions:</h3>
                        <ol>
                            {suggestedRecipe.instructions.map((instruction, index) => (
                                <li key={index}>{instruction}</li>
                            ))}
                        </ol>
                        <p className="recipe-source">
                            Recipe source: <a href={suggestedRecipe.sourceUrl} target="_blank" rel="noopener noreferrer">{suggestedRecipe.sourceUrl}</a>
                        </p>
                    </div>
                </div>
            )}
        </main>
    )
}