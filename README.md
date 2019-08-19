# APIs and Microservices Projects - URL Shortener Microservice

### _User stories_

1. I can POST a URL to `[project_url]/api/shorturl/new` and I will receive a shortened URL in the JSON response. Example : `{"original_url":"www.google.com","short_url":1}`
2. If I pass an invalid URL that doesn't follow the valid `http(s)://www.example.com(/more/routes)` format, the JSON response will contain an error like `{"error":"invalid URL"}`. *HINT*: to be sure that the submitted url points to a valid site you can use the function `dns.lookup(host, cb)` from the `dns` core module.
3. When I visit the shortened URL, it will redirect me to my original link.

  <br>
  <br>
  <br>
  <br>

### _Technology and how it was used_

#### Back-End features (Node + Express)
    - Post and Get endpoints implemented for url lookup.
    - Regex test for valid url formats.

#### Front-End features (HTML + CSS + Form Submission)
    - Front-End > Back-End communication via form action/method attributes.
    - Basic HTML and CSS to render front end.
    - Import fonts from CDN.

#### Database (Mongo + Mongoose)
    - MongoDB managed in the cloud via https://www.mongodb.com/cloud.
    - Mongoose ODM (Object Document Mapper) used to make DB interactions more graceful such as sort and limit.
    
  <br>
  <br>
  <br>
  <br>

#### The following links were used as help/inspiration for this project:
    - FCC Example Project: https://glitch.com/edit/#!/thread-paper?path=server.js:32:0
    - Tutorial by Dylan Israel: https://www.youtube.com/watch?v=5T1YDRWaa3k & https://www.youtube.com/watch?v=nSVzUH9NvSw
    - Tutorial by Brad Traversy: https://www.youtube.com/watch?v=R54neaLznFA&list=PLillGF-RfqbbiTGgA77tGO426V3hRF9iE&index=3
