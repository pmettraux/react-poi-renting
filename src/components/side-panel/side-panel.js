import React from 'react';
import PropTypes from 'prop-types';
import { 
  SwipeableDrawer,
  Typography,
  Slider,
  Container,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Switch,
} from '@material-ui/core';

import { 
  NavigateNext,
} from '@material-ui/icons';

import './side-panel.scss';

class SidePanelComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      isOpen: false,
      prices: [0, 0],
      limitsPrice: [0, 0],
      categories: props.categories,
      pois: props.pois,
      setFilteredPois: props.setFilteredPois,
      selectedHomeType: {
        appartment: true,
        house: true,
      },
      selectedShareType: {
        shared: true,
        notShared: true,
      },
      hideUnavailable: false,
      onlyWithImages: false,
      onlyWithGPX: false,
    };

    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.preparePriceFilters = this.preparePriceFilters.bind(this);
    this.filterPois = this.filterPois.bind(this);
    this.checkBoxHandleChange = this.checkBoxHandleChange.bind(this);
    this.toggleChange = this.toggleChange.bind(this);
  }

  preparePriceFilters(categories) {
    const prices = [];
    categories.forEach(category => {
      const val = category.name.match(/^price_(\d+)$/);
      if (val !== null && val[1] !== undefined) {
        prices.push(parseInt(val[1]))
      }
    });

    // sort prices
    prices.sort((a, b) => a - b);

    // set values to full range as stuff has changed
    this.setState({ 
      limitsPrice: [prices[0], prices[prices.length - 1]],
      prices: [prices[0], prices[prices.length - 1]],
    });
  }

  toggleDrawer() {
    this.setState((state) => ({
      isOpen: !state.isOpen,
    }));
  }

  handleChange(e, newValue) {
    this.setState({ prices: newValue });
    const currentToggleValues = {
      hideUnavailable: this.state.hideUnavailable,
      onlyWithImages: this.state.onlyWithImages,
      onlyWithGPX: this.state.onlyWithGPX,
    };
    this.filterPois(newValue, this.state.selectedHomeType, this.state.selectedShareType, currentToggleValues);
  }

  toggleChange(e) {
    let {id, checked} = e.target;
    this.setState({ [id]: checked });

    const currentToggleValues = {
      hideUnavailable: this.state.hideUnavailable,
      onlyWithImages: this.state.onlyWithImages,
      onlyWithGPX: this.state.onlyWithGPX,
    };
    currentToggleValues[id] = checked;
    this.filterPois(
      this.state.prices,
      this.state.selectedHomeType,
      this.state.selectedShareType,
      currentToggleValues);
  }

  checkBoxHandleChange(e) {
    const newValues = this.state[e.target.id];
    newValues[e.target.name] = e.target.checked;
    this.setState({ [e.target.id]: newValues });
    const currentToggleValues = {
      hideUnavailable: this.state.hideUnavailable,
      onlyWithImages: this.state.onlyWithImages,
      onlyWithGPX: this.state.onlyWithGPX,
    };
    if (e.target.id === 'selectedHomeType') {
      this.filterPois(this.state.prices, newValues, this.state.selectedShareType, currentToggleValues);
    } else {
      this.filterPois(this.state.prices, this.state.selectedHomeType, newValues, currentToggleValues);
    }
  }

  filterPois(priceFilter, homeTypeFilter, shareTypeFilter, toggleValues) {
    const newPoisList = [];
    this.state.pois.forEach(poi => {
      if (poi.categories.length) {
        let passesFilters = true;

        /***********
         * WARNING, because the DB was populated with data missing status
         * we remove all POI without a status by default
         ***********/
        if (poi.status === null) {
          passesFilters = false;
        }

        // check the status first
        if (passesFilters && 
          toggleValues.hideUnavailable && 
          poi.status.name === 'status_unavailable') {
          passesFilters = false;
        }

        // if need images
        if (passesFilters && 
          toggleValues.onlyWithImages && 
          poi.image === '') {
          passesFilters = false;
        }

        if (passesFilters && 
          toggleValues.onlyWithGPX && 
          poi.file === null) {
          passesFilters = false;
        }

        // price filtering
        if (passesFilters && 
          (poi.price < priceFilter[0] ||
            poi.price > priceFilter[1])) {
          passesFilters = false;
        }

        // homeType filtering
        if (passesFilters && 
          !homeTypeFilter[poi.homeType]) {
          passesFilters = false;
        }

        // shareType filtering
        if (passesFilters && 
          !shareTypeFilter[poi.shareType]) {
          passesFilters = false;
        }
        
        // if passes all filter
        if (passesFilters) {
          newPoisList.push(poi);
        }
      }
    });
    this.state.setFilteredPois(newPoisList);
  }

  componentDidUpdate(prevProps) {
    if (this.props.categories !== prevProps.categories) {
      this.setState({ categories: this.props.categories });
      this.preparePriceFilters(this.props.categories);
    }
    if (this.props.pois !== prevProps.pois) {
      this.setState({ pois: this.props.pois });
      // this.filterByPrice(this.state.prices);
    }
  }

  render() {
    return (
      <div className="side-panel">

        <div className={`button-toggle${this.state.isOpen ? ' open' : ''}`} onClick={this.toggleDrawer}>
          <NavigateNext className="toggle-text" />
        </div>

        <SwipeableDrawer
          anchor="left"
          open={this.state.isOpen}
          onClose={this.toggleDrawer}
          onOpen={this.toggleDrawer}
        >
          <div className="side-panel-content">
            <Container fixed>

              <h2>Filter rentable places</h2>

              <Container maxWidth="sm">
                <Typography id="price-range-slider" gutterBottom>
                  Price range:
                </Typography>
                <Slider
                  value={this.state.prices}
                  onChange={this.handleChange}
                  min={this.state.limitsPrice[0]}
                  max={this.state.limitsPrice[this.state.limitsPrice.length - 1]}
                  valueLabelDisplay="auto"
                  aria-labelledby="price-range-slider"
                  getAriaValueText={this.valuetext}
                />
                <Typography id="price-range-slider-values" gutterBottom>
                  min: <strong>{this.state.prices[0].toLocaleString()} CHF</strong><br/>
                  max: <strong>{this.state.prices[1].toLocaleString()} CHF</strong>
                </Typography>
              </Container>

              <Container maxWidth="sm" className="margin-top-20">
                <Typography id="home-type" gutterBottom>
                  Home type:
                </Typography>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.selectedHomeType.house}
                        onChange={this.checkBoxHandleChange}
                        name="house"
                        id="selectedHomeType"
                        color="primary"
                      />
                    }
                    label="House"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.selectedHomeType.appartment}
                        onChange={this.checkBoxHandleChange}
                        id="selectedHomeType"
                        name="appartment"
                        color="primary"
                      />
                    }
                    label="Appartment"
                  />
                </FormGroup>
              </Container>

              <Container maxWidth="sm" className="margin-top-20">
                <Typography id="share-type" gutterBottom>
                  Share type:
                </Typography>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.selectedShareType.shared}
                        onChange={this.checkBoxHandleChange}
                        id="selectedShareType"
                        name="shared"
                        color="primary"
                      />
                    }
                    label="Shared"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.selectedShareType.notShared}
                        onChange={this.checkBoxHandleChange}
                        id="selectedShareType"
                        name="notShared"
                        color="primary"
                      />
                    }
                    label="Not shared"
                  />
                </FormGroup>
              </Container>

              <Container maxWidth="sm" className="margin-top-20">
                <FormControlLabel
                  control={
                    <Switch
                      checked={this.state.hideUnavailable}
                      onChange={this.toggleChange}
                      name="hideUnavailable"
                      id="hideUnavailable"
                      color="primary"
                    />
                  }
                  label="Hide unavailable places"
                />
              </Container>

              <Container maxWidth="sm" className="margin-top-20">
                <FormControlLabel
                  control={
                    <Switch
                      checked={this.state.onlyWithImages}
                      onChange={this.toggleChange}
                      name="onlyWithImages"
                      id="onlyWithImages"
                      color="primary"
                    />
                  }
                  label="Only place with images"
                />
              </Container>

              <Container maxWidth="sm" className="margin-top-20">
                <FormControlLabel
                  control={
                    <Switch
                      checked={this.state.onlyWithGPX}
                      onChange={this.toggleChange}
                      name="onlyWithGPX"
                      id="onlyWithGPX"
                      color="primary"
                    />
                  }
                  label="Only place with GPX"
                />
              </Container>

            </Container>
          </div>
        </SwipeableDrawer>
      </div>
    );
  }
}

SidePanelComponent.propTypes = {
  categories: PropTypes.array.isRequired,
  pois: PropTypes.array.isRequired,
  setFilteredPois: PropTypes.func.isRequired,
}

export default SidePanelComponent;
