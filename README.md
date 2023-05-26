
# Koombea test - Camilo Sanchez

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

Para esto se utilizo el manejo de sessiones con express-session.
Para la base de datos se utilizo mongoDB en la nube y mongoose como ORM.

En cuanto al manejo del scrapping se utilizaron workers, cuando se realiza la peticion al endpoint (POST 'scraper/scrape') se dispara un worker que ejecuta el script de scraping y al macena la informacion en la DB al finalizar. Se penso implementar colas de mensajes para poder notificar al Main thread de la finalizacion y que este realizara la actualizacion. Ademas se sale un poco del scope hacer algo tan complejo, una implementacion sencilla podria bastar pero no se alcanzaria apreciar el estado. de 'En ejecucion' o se quedaria asi hasta que el usuario refrescara la pagina.

# DEMO:
### REGISTER:
![alt text](https://i.imgur.com/DymchLW.png)

### LOGIN:
![alt text](https://imgur.com/8UvNaX1)

### TRY TO ACCESS WITHOUT LOGIN:
![alt text](https://i.imgur.com/nDFh2At.png)

### LIST OF URLS SCRAPED:
![alt text](https://i.imgur.com/13lUuq1.png)

### DETAIL OF JAVA WIKIPEDIA PAGE:
![alt text](https://i.imgur.com/OQSQfrF.png))
