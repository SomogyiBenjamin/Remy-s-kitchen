import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import LoadingScreen from "./components/LoadingScreen";
import Home from "./components/Home.jsx";
import Upload from "./pages/Upload.jsx";
import ViewAll from "./components/viewAll.jsx";
import RecipeDetails from "./components/RecipeDetails.jsx";
import Fridge from "./components/WhatsInYourFridge.jsx";
import PendingRecipes from "./components/PendingRecipes.jsx";
import AdminRecipeDetails from "./components/AdminRecipeDetails.jsx";
import Log from './components/login/login.jsx';
import Reg from './components/Reg/Reg.jsx';
import Allergen from './components/allergy/allergy.jsx';
import Profile from './components/Profile';
import TasteProfile from './components/tasteProfile.jsx';
// import Test from './components/FloatingWindow'

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<LoadingScreenWrapper />} />
          <Route path="/home" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/viewAll" element={<ViewAll />} />
          <Route path="/fridge" element={<Fridge />} />
          <Route path="/recipeDetails/:id" element={<RecipeDetails />} />
          <Route path="/pendingRecipes" element={<PendingRecipes />} />
          <Route path="/adminRecipeDetails/:id" element={<AdminRecipeDetails />} />
          <Route path="/log" element={<Log />} />
          <Route path="/reg" element={<Reg />} />
          <Route path="/allergen" element={<Allergen />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/taste-profile" element={<TasteProfile />} />
          {/* <Route path="/test" elem={<Test></Test>}></Route> */}
          
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function LoadingScreenWrapper() {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "/home";
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return <LoadingScreen />;
}

export default App;