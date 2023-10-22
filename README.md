# Il nostro primo API - Strive Blog - Capitolo 5

Il backend include queste nuove routes:

- PATCH /authors/:authorId/avatar, carica un'immagine per l'autore specificato e salva
  l'URL creata da Cloudinary nel database

- PATCH /blogPosts/:blogPostId/cover, carica un'immagine per il post specificato dall'Id.
  Salva l'URL creato da Cloudinary nel post corrispondente

- EXTRA: Invia e-mail all'autore quando pubblica un nuovo BlogPost e quando un nuovo
  autore si registra sulla piattaforma