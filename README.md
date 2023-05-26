
## Koombea test - Camilo Sanchez

En general se desarrollo una aplicacion en Nodejs usando Nestjs como framework
Las rutas principales son:

* /signup
* /login
* /home
* /detail/:id

El home y el detail estan protegidas al igual que los endpoints del 'Backend' que son principalmente tres:

* POST http://localhost:3000/scraper/scrape
{
    "url": "https://es.wikipedia.org/wiki/Invasi%C3%B3n_rusa_de_Ucrania_(2022-presente)"
}

* GET http://localhost:3000/scraper?page=1&limit=25

* GET http://localhost:3000/scraper/64704d050db7be868c4a0796?page=5&limit=5

Para esto se utilizo el manejo de sessiones con express-session
para la base de datos se utilizo mongoDB en la nube y mongoose como ORM

