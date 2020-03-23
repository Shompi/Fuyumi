let p = new Promise((resolve, reject) => {
  reject('No reason');
});




(async () => {
  const value = await p.then(msg => console.log("Promise resolved.")).catch(msg => {
    console.log(msg);
    return "FetchError";
  });

  console.log(`Valor retornado por la promesa: ${value}`);
})();