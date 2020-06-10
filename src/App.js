import React, { useEffect, useState } from 'react';
import './App.css';
import MainHeader from './components/main-header/main-header';
import SidePanelComponent from './components/side-panel/side-panel';
import LeafletMapComponent from './components/map-component/map';
import Loading from './components/loading/loading';
import { useAuth0 } from './shared/react-auth0-spa';
import { getPois, getCategories } from './shared/api.service';


function App() {
  const [pois, setPois] = useState([]);
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
    const pois = results.data.map(poi => {
      return {
        key: poi.id,
        position: {
          lat: poi.lat,
          lng: poi.lng,
        },
        name: poi.name,
        description: poi.description,
        creatorId:  poi.Creator.id
      }
    });
    setPois(pois);
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
    return <Loading />;
  }

  return (
    <div className="App">
      <MainHeader 
        logout={logout} 
        isAuthenticated={isAuthenticated} 
        loginWithRedirect={loginWithRedirect} 
      />
      <LeafletMapComponent 
        pois={pois}
        userId={user ? user.sub : undefined}
        loginWithRedirect={loginWithRedirect} 
        getTokenSilently={getTokenSilently}
        updatePoiList={getListPois}
        updateCategoryList={getListCategories}
      />
      <SidePanelComponent 
        categories={categories}
      />
    </div>
  );
}

export default App;
