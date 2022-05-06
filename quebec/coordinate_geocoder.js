const fs = require('fs');
const { geocode } = require('opencage-api-client');

const infile = 'Quebec_Girls_Hockey_-_M13AA_Arena_list.csv';
const outfile = 'Quebec_Girls_Hockey_-_M13AA_with_coordinates.csv';


let data = `address, latitude, longitude
`;

const batch = async (lines) => {
  for (let index = 0; index < lines.length; index++) {
    const address = lines[index];
    if (address.trim() !== '') {
      try {
        const apiResult = await geocode({ q: address });
        // NodeJS<14 use : if(apiResult && apiResult.results && apiResult.results.length > 0)
        if (apiResult?.results?.length > 0) {
          const geocoded = apiResult.results[0];
          const latitude = geocoded.geometry.lat;
          const longitude = geocoded.geometry.lng;
          console.log(`${address}, ${latitude}, ${longitude}`);
          data = data.concat(address, ", ", latitude, ", ", longitude, "\n");
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  fs.writeFile(outfile, data, "utf-8", (err) => {
    if (err) console.log(err);
    else console.log("Data saved to csv: ", outfile);
  });
};

fs.readFile(infile, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const lines = data.split(/\r?\n/);

  batch(lines);

});



// ... prints
// Madrid,Spain, 40.4167047, -3.7035825
// Milan,Italy, 45.4668, 9.1905
// Berlin,Germany, 52.5170365, 13.3888599