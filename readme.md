Pour lancer mongo (sous docker)

docker pull mongo
docker run --name some-mongo -p 27017:27017 mongo
docker exec -it some-mongo bash

Pour lancer le process, nodemon start (port 3010);