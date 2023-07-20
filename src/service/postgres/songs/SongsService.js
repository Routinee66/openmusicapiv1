const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../../exceptions/InvariantError');
// const { mapDBToModel } = require('../../utils');
const NotFoundError = require('../../../exceptions/NotFoundError');

// title
// year
// genre
// performer
// duration
// albumId

// title, year, genre, performer, duration, albumId

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, performer, genre, duration, albumId }) {
    const id = nanoid(16);
    // const createdAt = new Date().toISOString();
    // const updatedAt = createdAt;

    if (albumId === '') albumId = null;

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongs() {
    const result = await this._pool.query('SELECT id, title, performer FROM songs');
    return result.rows;

    
    // return result.rows.map(mapDBToModel);
  }

  async getSongsByTitleAndPerformer(valueTitle, valuePerformer) {
    const result = await this._pool.query(`SELECT id, title, performer FROM songs WHERE title ILIKE '%${valueTitle}%' AND performer ILIKE '%${valuePerformer}%'`);
    return result.rows;
  }

  async getSongsByTitle(value) {
    const result = await this._pool.query(`SELECT id, title, performer FROM songs WHERE title ILIKE '%${value}%'`);
    return result.rows;
  }

  async getSongsByPerformer(value) {
    const result = await this._pool.query(`SELECT id, title, performer FROM songs WHERE performer ILIKE '%${value}%'`);
    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    // return result.rows.map(mapDBToModel)[0];
    return result.rows[0];
  }

  async editSongById(id, { title, year, performer, genre, duration, albumId }) {
    // const updatedAt = new Date().toISOString();

    let query = {};

    if (albumId === ''){
        query = {
          text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5 WHERE id = $6 RETURNING id',
          values: [title, year, performer, genre, duration, id],
        };
    }
    else{
        query = {
          text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, albumId = $6 WHERE id = $7 RETURNING id',
          values: [title, year, performer, genre, duration, albumId, id],
        };
    }


    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = SongsService;
