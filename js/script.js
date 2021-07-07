const d = document,
  $main = d.querySelector("main"),
  $links = d.querySelector(".links");

let pokeAPI = "https://pokeapi.co/api/v2/pokemon/";

async function loadPokemons(url) {
  try {
    $main.innerHTML = `<img class="loader" src="/pokemon_fetch/assets/img/bars.svg" alt="Cargando..."  />`;
    let res = await fetch(url),
      json = await res.json(),
      $template = "",
      $prevLink,
      $nextLink;
    console.log(json);

    //caputrando error
    if (!res.ok) throw { status: res.status, statusText: res.statusText };

    for (let i = 0; i < json.results.length; i++) {
      //console.log(json.results[i]);
      try {
        let res = await fetch(json.results[i].url),
          pokemon = await res.json();

        //console.log(res, pokemon);

        if (!res.ok) throw { status: res.status, statusText: res.statusText };
        //Generando el Template HTML
        $template += `
        <figure>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <figcaption>${pokemon.name}</figcaption>
        </figure>
        `;

        //Capturando Error
      } catch (err) {
        console.log(err);
        let message = err.statusText || "Ocurió un Error";
        $templeate += `
        <figure>
        <figcaption>Error ${err.status}: ${message}</figcaption>
        </figure>`;
      }
    }

    //pintando la informacion del Json en el index.html
    $main.innerHTML = $template;

    //agregando los botones de atras y adelante en el index.html
    $prevLink = json.previous ? `<a href="${json.previous}">⏮️</a>` : "";
    $nextLink = json.next ? `<a href="${json.next}">⏭️</a>` : "";

    $links.innerHTML = $prevLink + " " + $nextLink;
  } catch (err) {
    //console.log(err);
    let message = err.statusText || "Ocurió un Error";
    $main.innerHTML = `<p>Error ${err.status}: ${message}</p>`;
  }
}

loadPokemons(pokeAPI);

//cargando la pagina siguiente.
d.addEventListener("click", (e) => {
  if (e.target.matches(".links a")) {
    e.preventDefault();
    loadPokemons(e.target.getAttribute("href"));
  }
});
