require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5001;

const cors = require('cors');

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://book-catalog:Xti9Bk7pDt0o7hQD@atlascluster.zznsycg.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
  try {
    const db = client.db('bookCatalog');
    const bookCatalog = db.collection('books');
    app.get('/book', async (req, res) => {
      const cursor = bookCatalog.find({}).sort({ createdAt: -1 });
      const book = await cursor.toArray();
      res.send({ status: true, data: book });
    });

    app.post('/book', async (req, res) => {
      const book = req.body;
      book.createdAt = new Date();
      try {
        const result = await bookCatalog.insertOne(book);
        res.send(result);
      } catch (error) {
        res.status(500).send('Error occurred while saving the book');
      }
    });

    app.get('/book/:id', async (req, res) => {
      const id = req.params.id;
      const result = await bookCatalog.findOne({ _id: ObjectId(id) });
      console.log(result);
      res.send(result);
    });

    app.delete('/book/:id', async (req, res) => {
      const id = req.params.id;
      const result = await bookCatalog.deleteOne({ _id: ObjectId(id) });
      console.log(result);
      res.send(result);
    });

    app.patch('/book/:id', async (req, res) => {
      const id = req.params.id;
      const updatedBook = req.body;
      const quary = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          title: updatedBook.title,
          author: updatedBook.author,
          genre: updatedBook.genre,
          publicationDate: updatedBook.publicationDate
        },
      };
      const result = await bookCatalog.updateOne(quary, updateDoc, options);
      res.send(result);
    })

    app.post('/user', async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

  } finally {
  }
};

run().catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
