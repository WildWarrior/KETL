import express from 'express';
import mysql from 'mysql2/promise';
import { Client } from 'ssh2';
import { Client as PgClient } from 'pg';
import { MongoClient } from 'mongodb';

const app = express();
app.use(express.json());

// Database query endpoint
app.post('/api/database/query', async (req, res) => {
  const { type, host, port, database, username, password, query } = req.body;

  try {
    let result;
    switch (type) {
      case 'mysql':
        const connection = await mysql.createConnection({
          host,
          port,
          user: username,
          password,
          database
        });
        [result] = await connection.execute(query);
        await connection.end();
        break;

      case 'postgresql':
        const pgClient = new PgClient({
          host,
          port,
          user: username,
          password,
          database
        });
        await pgClient.connect();
        const pgResult = await pgClient.query(query);
        result = pgResult.rows;
        await pgClient.end();
        break;

      case 'mongodb':
        const mongoClient = new MongoClient(`mongodb://${username}:${password}@${host}:${port}/${database}`);
        await mongoClient.connect();
        const db = mongoClient.db(database);
        result = await db.collection(query).find().limit(10).toArray();
        await mongoClient.close();
        break;

      default:
        throw new Error('Unsupported database type');
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// SFTP endpoint
app.post('/api/sftp/list', async (req, res) => {
  const { host, port, username, password, privateKey, rootPath } = req.body;

  const conn = new Client();
  try {
    await new Promise((resolve, reject) => {
      conn.on('ready', resolve)
          .on('error', reject)
          .connect({
            host,
            port,
            username,
            password,
            privateKey
          });
    });

    const result = await new Promise((resolve, reject) => {
      conn.sftp((err, sftp) => {
        if (err) reject(err);
        sftp.readdir(rootPath, (err, list) => {
          if (err) reject(err);
          resolve(list);
        });
      });
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    conn.end();
  }
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
}); 