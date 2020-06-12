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
    const pois = results.data.filter(poi => {
        /*******
         * As many test were done and some data were already populated
         * this is here to filter POIS that have the right data in the database
         ******/
        return poi.Status !== null
      }).map(poi => {
        // get the price
        const price = parseInt(poi.Categories.map(category => {
          const match = category.name.match(/^price_(\d+)$/);
          return {
            match,
          };
        }).filter(category => {
          return category.match !== null;
        })[0].match[1]);
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
          price,
        }
    })
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
