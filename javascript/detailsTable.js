function populateDetailsTable() {
  var options = {
    valueNames: [ 'name', 'people_per_address', 'people_per_venue',
      'addresses_per_person', 'venues_per_person', 'population', 'total_records' ]
  };

  var userList = new List('details', options);

  userList.clear();
  Object.keys(getAllCountryData()).forEach(function (iso3) {
    var country = getAllCountryData()[iso3];

    if (country.population > 0) {
      country.people_per_address = (country.records.address > 0) ? (country.population / country.records.address).toFixed(2) : 'none';
      country.addresses_per_person = (country.records.address / country.population).toFixed(2);
      country.people_per_venue = (country.records.venue > 0) ? (country.population / country.records.venue).toFixed(2) : 'none';
      country.venues_per_person = (country.records.venue / country.population).toFixed(2);
    } else {
      country.people_per_address = 'unknown';
      country.addresses_per_person = 'unknown';
      country.people_per_venue = 'unknown';
      country.venues_per_person = 'unknown';
    }

    userList.add({
      name: (country.name ? country.name + ' (' + iso3 + ')' : iso3),
      people_per_address: country.people_per_address || 'none',
      addresses_per_person: country.addresses_per_person || 'none',
      venues_per_person: country.venues_per_person || 'none',
      people_per_venue: country.people_per_venue || 'none',
      population: country.population || 'unknown',
      total_records: country.records.total || 0
    });
  });

  userList.sort('name');

  window.detailsTable = userList;
}