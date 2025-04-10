const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY
const API_URL = 'https://api.spoonacular.com/recipes/findByIngredients'

// Helper function to convert HTML to markdown
function htmlToMarkdown(html) {
    // Remove any <p> tags and replace with newlines
    let markdown = html.replace(/<p>/g, '').replace(/<\/p>/g, '\n\n')
    
    // Convert <ol> and <li> to markdown numbered list
    markdown = markdown.replace(/<ol>/g, '').replace(/<\/ol>/g, '')
    markdown = markdown.replace(/<li>/g, '1. ').replace(/<\/li>/g, '\n')
    
    // Remove any remaining HTML tags
    markdown = markdown.replace(/<[^>]*>/g, '')
    
    // Clean up extra whitespace
    markdown = markdown.replace(/\n\s*\n\s*\n/g, '\n\n')
    
    return markdown.trim()
}

export async function getRecipeFromSpoonacular(ingredientsArr) {
    try {
        // First, get recipe IDs that match our ingredients
        const searchParams = new URLSearchParams({
            ingredients: ingredientsArr.join(','),
            number: 1,
            ranking: 1,
            ignorePantry: true,
            apiKey: API_KEY
        })

        const searchResponse = await fetch(`${API_URL}?${searchParams}`)
        if (!searchResponse.ok) {
            throw new Error('Failed to find recipes')
        }

        const recipes = await searchResponse.json()
        if (!recipes.length) {
            throw new Error('No recipes found with these ingredients')
        }

        // Get the recipe details
        const recipeId = recipes[0].id
        const recipeResponse = await fetch(
            `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}`
        )
        
        if (!recipeResponse.ok) {
            throw new Error('Failed to get recipe details')
        }

        const recipeDetails = await recipeResponse.json()

        // Format the recipe in a structured object
        return {
            title: recipeDetails.title,
            ingredients: recipeDetails.extendedIngredients.map(ing => ing.original),
            instructions: recipeDetails.instructions ? htmlToMarkdown(recipeDetails.instructions).split('\n').filter(line => line.trim()) : [],
            sourceUrl: recipeDetails.sourceUrl || '#',
            readyInMinutes: recipeDetails.readyInMinutes,
            servings: recipeDetails.servings
        }
    } catch (err) {
        console.error(err.message)
        throw new Error("Failed to generate recipe. Please try again later.")
    }
}

// Keep the old function for backward compatibility
export async function getRecipeFromMistral(ingredientsArr) {
    try {
        // First, get recipe IDs that match our ingredients
        const searchParams = new URLSearchParams({
            ingredients: ingredientsArr.join(','),
            number: 1,
            ranking: 1,
            ignorePantry: true,
            apiKey: API_KEY
        })

        const searchResponse = await fetch(`${API_URL}?${searchParams}`)
        if (!searchResponse.ok) {
            throw new Error('Failed to find recipes')
        }

        const recipes = await searchResponse.json()
        if (!recipes.length) {
            throw new Error('No recipes found with these ingredients')
        }

        // Get the recipe details
        const recipeId = recipes[0].id
        const recipeResponse = await fetch(
            `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}`
        )
        
        if (!recipeResponse.ok) {
            throw new Error('Failed to get recipe details')
        }

        const recipeDetails = await recipeResponse.json()

        // Format the recipe in markdown
        return `
# ${recipeDetails.title}

## Ingredients
${recipeDetails.extendedIngredients.map(ing => `- ${ing.original}`).join('\n')}

## Instructions
${htmlToMarkdown(recipeDetails.instructions || 'No instructions available.')}

## Additional Information
- Ready in: ${recipeDetails.readyInMinutes} minutes
- Servings: ${recipeDetails.servings}
${recipeDetails.sourceUrl ? `- Source: ${recipeDetails.sourceUrl}` : ''}
`
    } catch (err) {
        console.error(err.message)
        throw new Error("Failed to generate recipe. Please try again later.")
    }
}
