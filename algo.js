import fs from 'fs'
import products from './data.json' with { type: 'json' };

function processInventory(data) {
  const availableItems = data.filter(item => item.inStock > 0);
  
  const processed = availableItems.map(item => ({
    name: item.name,
    inventoryValue: item.price * item.inStock
  }));

  const totalMarketValue = processed.reduce((sum, item) => sum + item.inventoryValue, 0);

  return {
    timestamp: new Date().toISOString(),
    results: processed,
    grandTotal: totalMarketValue.toFixed(2)
  };
}

function main() {
    const date = new Date().toISOString().split('T')[0];
    const fileName = `results-${date}.json`;

    const output = processInventory(products);

    fs.writeFile(fileName, JSON.stringify(output, null, 2), (err) => {
        if (err) {
            console.error("Error writing file:", err);
        } else {
            console.log(`Successfully saved results to ${fileName}`);
        }
    });
}

main()
