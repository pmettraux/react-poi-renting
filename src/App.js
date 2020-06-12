import React, { useEffect, useState } from 'react';
import './App.css';
import MainHeader from './components/main-header/main-header';
import SidePanelComponent from './components/side-panel/side-panel';
import LeafletMapComponent from './components/map-component/map';
import AboutContent from './components/about/about';
import Loading from './components/loading/loading';
import { useAuth0 } from './shared/react-auth0-spa';
import { getPois, getCategories } from './shared/api.service';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";


function App() {
  const [pois, setPois] = useState([]);
  const [filteredPois, setFilteredPois] = useState([]);
  const [categories, setCategories] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const {
    loading,
    logout,
    getTokenSilently,
    loginWithRedirect,
    isAuthenticated,
    user,
  } = useAuth0();

  const getListPois = async() => {
    const results = await getPois(getTokenSilently, loginWithRedirect);
    let minPrice = null;
    let maxPrice = 0;
    const pois = results.data.filter(poi => {
        /*******
         * As many test were done and some data were already populated
         * this is here to filter POIS that have the right data in the database
         ******/
        return poi.Status !== null
      }).map(poi => {
        const matches = poi.Categories.map(category => {
          const price = category.name.match(/^price_(\d+)$/);
          const homeType = category.name.match(/^homeType_(\w+)$/);
          const shareType = category.name.match(/^shareType_(\w+)$/);
          return {
            price,
            homeType,
            shareType,
          };
        });

        let price, homeType, shareType;
        matches.forEach(match => {
          if (match.price !== null) {
            price = parseInt(match.price[1]);
          }
          if (match.homeType !== null) {
            homeType = match.homeType[1];
          }
          if (match.shareType !== null) {
            shareType = match.shareType[1];
          }
        });

        if (price > maxPrice) {
          maxPrice = price;
        }

        if (price < minPrice || minPrice === null) {
          minPrice = price;
        }

        return {
          key: poi.id,
          position: {
            lat: poi.lat,
            lng: poi.lng,
          },
          name: poi.name,
          description: poi.description,
          creatorId:  poi.Creator.id,
          categories: poi.Categories,
          file: poi.File,
          status: poi.Status,
          image: poi.image,
          likes: poi.likes,
          liked: poi.liked,
          price,
          homeType,
          shareType,
        }
    })
    setMinPrice(minPrice);
    setMaxPrice(maxPrice);
    setPois(pois);
    setFilteredPois(pois);
  }

  const getListCategories = async() => {
    const results = await getCategories(getTokenSilently, loginWithRedirect);
    setCategories(results.data);
  }

  useEffect(() => {
    (async() => {
      if (!loading) {
        await Promise.all([
          getListPois(),
          getListCategories(),
        ]);
      }
    })()
  }, [loading])

  if (loading) {
    return (
      <div className="App">
        <Loading />
      </div>
    );
  }

  return (
    <div className="App">
      <Router>
        <MainHeader 
          logout={logout} 
          isAuthenticated={isAuthenticated} 
          loginWithRedirect={loginWithRedirect}
        />
        <Switch>
          <Route path="/about" component={About} />
          <Route path="/">
            <LeafletMapComponent 
              pois={filteredPois}
              userId={user ? user.sub : undefined}
              loginWithRedirect={loginWithRedirect} 
              getTokenSilently={getTokenSilently}
              updatePoiList={getListPois}
              updateCategoryList={getListCategories}
              minPrice={minPrice}
              maxPrice={maxPrice}
            />
            <SidePanelComponent 
              categories={categories}
              setFilteredPois={setFilteredPois}
              pois={pois}
            />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

function About() {
  return <AboutContent />
}

export default App;
