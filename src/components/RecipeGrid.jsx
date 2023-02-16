import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Recipe.css'

function RecipeGrid() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [searchVal, setSearchVal] = useState('')

  useEffect(() => {
    axios
      .get('https://api.spoonacular.com/recipes/complexSearch', {
        params: {
          apiKey: 'a7df015c20504522a918b642192b9db6', // replace with your own API key
        },
      })
      .then((response) => {
        console.log(response.data.results)
        if(searchVal===''){
          setRecipes(response.data.results);
        }
        else{
          let fildata = response.data.results.filter((item)=>{
            if(item.title.toLowerCase().includes(searchVal.toLocaleLowerCase())){
              return item
            }
          })
          setRecipes(fildata)
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [searchVal]);

  const handleViewDetails = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleGoBack = () => {
    setSelectedRecipe(null);
  };

  const handleAddToFavorites = (recipe) => {
    setFavorites([...favorites, recipe]);
  };

  const displayRecipeCard = (recipe) => {
    return (
      <div className="recipe-card" key={recipe.id}>
        <img src={recipe.image} alt={recipe.title} />
        <h3>{recipe.title}</h3>
        <div className="button-group">
          <button onClick={() => handleViewDetails(recipe)} className='details'>View Details</button>
          <button onClick={() => handleAddToFavorites(recipe)} className='favs'>Add to Favorites</button>
        </div>
      </div>
    );
  };

  const displayRecipeDetails = () => {
    return (
      <div className="recipe-details">
        <img src={selectedRecipe.image} alt={selectedRecipe.title} />
        <h3>{selectedRecipe.title}</h3>
        <p>{selectedRecipe.summary}</p>
        <button onClick={handleGoBack} className='go-back'>Go Back</button>
      </div>
    );
  };

  const displayRecipeGrid = () => {
    return <div className="recipe-grid">{recipes.map(displayRecipeCard)}</div>;
  };

  const displayFavorites = () => {
    return (
      <div className="favorites-grid">
        {favorites.map((recipe) => (
          <div className="recipe-card" key={recipe.id}>
            <img src={recipe.image} alt={recipe.title} />
            <h3>{recipe.title}</h3>
            <div className="button-group">
              <button onClick={() => handleViewDetails(recipe)} className='details'>View Details</button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <nav>
        <ul>
          <li>Home</li>
          <li>Favorites ({favorites.length})</li>
        </ul>
      </nav>
      <div className='main-heading'>
        <h1>Recipe App</h1>
        <input value={searchVal} placeholder='search here...' onChange={(e) => setSearchVal(e.target.value)} />
      </div>
      {selectedRecipe ? displayRecipeDetails() : displayRecipeGrid()}
      <div className='fav-block'>
        <h1 className='fav-head'>Favorites</h1>
        {favorites.length > 0 ? displayFavorites() : <p>No items are added to favourites</p>}
      </div>
    </div>
  );
}

export default RecipeGrid;
