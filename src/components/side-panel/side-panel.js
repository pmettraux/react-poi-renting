import React from 'react';
import PropTypes from 'prop-types';
import { 
  SwipeableDrawer,
  Typography,
  Slider,
  Container,
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
    };

    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.preparePriceFilters = this.preparePriceFilters.bind(this);
    this.filterByPrice = this.filterByPrice.bind(this);
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
    this.filterByPrice(newValue);
  }

  filterByPrice(priceFilter) {
    const newPoisList = [];
    this.state.pois.forEach(poi => {
      if (poi.categories.length) {
        poi.categories.forEach(category => {
          const val = category.name.match(/^price_(\d+)$/);
          if (val !== null && val[1] !== undefined) {
            // check that we are whitin range
            if (val[1] >= priceFilter[0] && val[1] <= priceFilter[1]) {
              newPoisList.push(poi);
            }
          }
        })
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

              <Typography id="price-range-slider" gutterBottom>
                Price range (CHF)
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
