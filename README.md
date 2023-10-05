# Il nostro primo API - Strive Blog - Capitolo 2

- Se non lo hai fatto, implementa le funzionalità di PUT e DELETE per gli autori

- Sviluppa le operazioni CRUD per i blog post

- La persistenza dei dati dev'essere garantita dall'uso di MongoDB

- Le query e i body dovranno essere validati

- Ricorda di installare il pacchetto [cors] con 'npm i cors', e di usarlo con 'server.use(cors())' se vuoi collegare il backend al frontend

# Strive Blog - Struttura BLOG POST

    _id                         // generato dal server
    category                    // categoria del post
    title                       // titolo del post
    cover                       // link dell'immagine
    readTime: {
        value                   // numero
        unit                    // unità di misura
    },
    author: {
        name                    // nome dell'autore
        avatar                  // immagine dell'autore
    },
    content                     // HTML dell'articolo

# Strive Blog - Rotte

- GET/blogPosts => ritorna una lista di blog post

- GET/blogPosts/123 => ritorna un singolo blog post

- POST/blogPosts => crea un nuovo blog post

- PUT/blogPosts/123 => modifica il blog post con l'id associato

- DELETE/blogPosts/123 => cancella il blog post con l'id associato

# EXTRA (facoltativi, per ora)

- Fare la POST di un articolo dal form di aggiunta articolo

- Fare la fetch degli articoli presenti nel database e visualizzarli nella homepage

- GET/authors/:id/blogPosts/ => ricevi tutti i blog post di uno specifico autore dal corrispondente ID

- GET/blogPOsts?title=whatever => filtra i blog post e ricevi l'unico che corrisponda alla condizione di ricerca (esempio: il titolo contiene "whatever")

- Aggiungi la funzionalità di ricerca dei post nel frontend