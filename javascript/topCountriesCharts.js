function prepCountriesDataForCharts() {
  window.data = {labels: [], data: []};
  window.sortable = [];

  Object.keys(countryData).forEach(function (iso3) {
    var country = countryData[iso3];

    country.people_per_address = (country.population > 0 && country.records.address > 0) ? (country.population / country.records.address) : 9999999;
    country.address_per_person = (country.population > 0 && country.records.address > 0) ? (country.records.address / country.population) : 0;
    country.people_per_venue = (country.population > 0 && country.records.venue > 0) ? (country.population / country.records.venue) : 9999999;
    country.venue_per_person = (country.population > 0 && country.records.venue > 0) ? (country.records.venue / country.population) : 0;

    if (country.address_per_person > 0.02) {
      sortable.push({label: country.name, value: country.address_per_person, country: country});
    }
  });

  sortable.sort(function (a, b) {
    return (a.value < b.value) ? 1 : -1;
  });
}

/**
 * Create the top countries chart
 */
function populateTopCoverageChart() {
  window.data.labels = sortable.map(function (item) {
    return item.label;
  });
  window.data.addrData = sortable.map(function (item) {
    return item.value;
  });

  window.data.venueData = sortable.map(function (item) {
    return item.country.venue_per_person;
  });

  var ctx = document.getElementById("top-countries").getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: [
        {
          label: 'venues/person',
          data: window.data.venueData,
          pointBackgroundColor: "#6ea0a4",
          backgroundColor: 'rgba(110, 160, 164, 0.8)',
          fill: true,
          type: 'line'
        },
        {
          label: 'addresses/person',
          data: window.data.addrData,
          backgroundColor: "#d4645c"
        }
      ]
    },
    options: {
      scales: {
        xAxes: [{
          ticks: {
            autoSkip: false
          }
        }]
      }
    }
  });
}

/**
 * Create the top countries by layer chart
 */
function populateTopByLayerChart() {
  var layers = ['address', 'venue', 'neighbourhood', 'localadmin', 'locality', 'county', 'region', 'macroregion'];
  var layers_colors = {
    'address':  "#d4645c",
    'venue': '#6ea0a4',
    'neighbourhood': '#e6ead2',
    'localadmin': '#d3c756',
    'locality': '#385d5c',
    'county': '#993434',
    'region': '#666666',
    'macroregion': '#563630'
  };

  layers.forEach(function (layer) {
    window.data[layer] = window.sortable.map(function (item) {
      return item.country.records[layer] / item.country.records.total * 100;
    });
  });

  var datasets = [];
  layers.forEach(function (layer) {
    datasets.push({
      label: layer,
      data: window.data[layer],
      backgroundColor: layers_colors[layer]
    })
  });

  var ctx2 = document.getElementById("top-countries-by-layer").getContext('2d');
  new Chart(ctx2, {
    type: 'bar',
    options: {
      scales: {
        xAxes: [{
          stacked: true,
          ticks: {
            autoSkip: false
          }
        }],
        yAxes: [{
          stacked: true,
          ticks: {
            max: 100
          }
        }]
      }
    },
    data: {
      labels: window.data.labels,
      datasets: datasets
    }
  });
}

/**
 * Create the top countries by source chart
 */
function populateTopBySourceChart() {
  var sources = ['openaddresses', 'openstreetmap', 'whosonfirst', 'geonames'];
  var sources_colors = {
    'openaddresses': '#d4645c',
    'openstreetmap': '#6ea0a4',
    'whosonfirst':   '#e6ead2',
    'geonames':      '#d3c756'
  };

  sources.forEach(function (source) {
    data[source] = window.sortable.map(function (item) {
      return item.country.records[source] / item.country.records.total * 100;
    });
  });
  var datasets = [];
  sources.forEach(function (source) {
    datasets.push({
      label: source,
      data: window.data[source],
      backgroundColor: sources_colors[source]
    })
  });

  var ctx2 = document.getElementById("top-countries-by-source").getContext('2d');
  new Chart(ctx2, {
    type: 'bar',
    options: {
      scales: {
        xAxes: [{
          stacked: true,
          ticks: {
            autoSkip: false
          }
        }],
        yAxes: [{
          stacked: true,
          ticks: {
            max: 100
          }
        }]
      }
    },
    data: {
      labels: window.data.labels,
      datasets: datasets
    }
  });
}