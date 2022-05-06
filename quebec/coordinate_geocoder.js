const fs = require('fs');
const { geocode } = require('opencage-api-client');

const infile = 'Quebec_Girls_Hockey_-_Sample_Arena_list.csv';

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
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
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