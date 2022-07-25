const tetriminos = ["I", "O", "T", "J", "L", "S", "Z"]

/**
 * 
 * @param {tetriminos} minos 
 */
const randomizer = (minos, numberOfBags) => {
  const bags = []


  for (let j = 0; j < numberOfBags; j++) {
    let minosAux = minos
    const bag = []

    for (let i = 0; i < 7; i++) {

      const selectedMinoIndex = Math.floor(Math.random() * minosAux.length)


      bag.push(minosAux[selectedMinoIndex]);


      minosAux = minosAux.filter(mino => mino !== minosAux[selectedMinoIndex]);
    }
    bags.push(`${j + 1} bag -> ${bag.join(" - ")}`)
  }
  return bags.join("\n")
}

console.log(randomizer(tetriminos, 4));