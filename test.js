

let test = /columnMetadata[^\[]*\[[^\]]*hiddenByUser[^\]]*\]/.test(`"columnMetadata": [
  {
    "hiddenByUser": true,
    "pixelSize": 100
   }
  ]);`);

  console.log(test);