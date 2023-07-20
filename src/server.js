require('dotenv').config();

const Hapi = require('@hapi/hapi');

const albums = require('./api/albums');
const songs = require('./api/songs');
const AlbumsServices = require('./service/postgres/albums/AlbumsService');
const AlbumsValidator = require('./validator/albums');

const SongsServices = require('./service/postgres/songs/SongsService');
const SongsValidator = require('./validator/songs');

const init = async () => {
  const albumsServices = new AlbumsServices();
  const songsServices = new SongsServices();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
        cors: {
            origin: ['*'],
        }
    }
  });

  await server.register([
    {
        plugin: albums,
        options: {
            service: albumsServices,
            validator: AlbumsValidator
        }
    },
    {
        plugin: songs,
        options: {
            service: songsServices,
            validator: SongsValidator
        }
    }
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
