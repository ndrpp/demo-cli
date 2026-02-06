const fs = require('fs');
const path = require('path');

function findDataFile() {
  const possiblePaths = [
    '/data/inputs/0/data.json',
    '/data/inputs/0/0',
    '/data/inputs/0',
  ];

  for (const filePath of possiblePaths.slice(0, 2)) {
    if (fs.existsSync(filePath)) {
      console.log(`✅ Found data at: ${filePath}`);
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  }

  const inputDir = '/data/inputs/0';
  if (fs.existsSync(inputDir)) {
    const files = fs.readdirSync(inputDir);
    console.log(`📁 Files in ${inputDir}:`, files);

    if (files.length > 0) {
      const firstFile = path.join(inputDir, files[0]);
      console.log(`📖 Reading: ${firstFile}`);
      return JSON.parse(fs.readFileSync(firstFile, 'utf8'));
    }
  }

  throw new Error('Could not find data file in /data/inputs/0/');
}

const rockData = findDataFile();

function analyzeRockBands(data) {
  const legendary = data.bands.filter(band => band.rating >= 9);

  const totalAlbums = legendary.reduce((sum, band) => sum + band.albums, 0);
  const avgRating = (legendary.reduce((sum, band) => sum + band.rating, 0) / legendary.length).toFixed(2);

  const mostProlific = legendary.reduce((max, band) =>
    band.albums > max.albums ? band : max
  , legendary[0]);

  return {
    timestamp: new Date().toISOString(),
    message: "🎸 IN ROCK WE TRUST! 🤘",
    legendaryBands: legendary.map(b => ({
      name: b.name,
      genre: b.genre,
      albums: b.albums,
      rating: `${b.rating}/10`
    })),
    statistics: {
      totalLegendaryBands: legendary.length,
      totalAlbums: totalAlbums,
      averageRating: avgRating,
      mostProlificBand: `${mostProlific.name} with ${mostProlific.albums} albums`
    }
  };
}

async function main() {
  const today = new Date().toISOString().split('T')[0];
  const outputFileName = `rock-analysis-${today}.json`;

  const output = analyzeRockBands(rockData);

  try {
    await fs.promises.writeFile(outputFileName, JSON.stringify(output, null, 2));
    console.log('🎸 Rock analysis complete!');
    console.log(`📝 Report: ${outputFileName}`);
    console.log(`🤘 ${output.statistics.totalLegendaryBands} legendary bands analyzed!`);
  } catch (error) {
    console.error('❌ Error writing output:', error);
  }
}

main();
