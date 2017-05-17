module.exports = opts => {
  const elasticsearch = require('elasticsearch'),
    client = new elasticsearch.Client({
      host: `${opts['elastic-host'] || 'localhost'}:${opts['elastic-port'] || '9200'}`,
      log: 'error',
      requestTimeout: 60000,
    }),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    url = `mongodb://${opts['mongo-host'] || 'localhost'}:${opts['mongo-port'] || '27017'}/${opts.database}`,
    PQueue = require('p-queue'),
    queue = new PQueue({concurrency: opts.concurrency || 250}),
    ProgressBar = require('progress'),
    counts = [];

  let total = 0;

  queue.onEmpty().then(i => {
    counts[0].then(c => {
      console.log(c + ' documents transferred.');
      process.exit();
    })
  });

  MongoClient.connect(url, function(err, db) {
    db.collections().then(collections => {
      // collection filter
      if (
        Array.isArray(opts.collection) || typeof opts.collection === 'string'
      ) {
        if (Array.isArray(opts.collection)) {
          collections = collections.filter(
            ({collectionName}) => opts.collection.indexOf(collectionName) != -1
          );
        } else {
          collections = collections.filter(
            ({collectionName}) => opts.collection === collectionName
          );
        }
      }

      if (!collections.length) {
        console.error('Collection not found.');
        process.exit();
      }

      // total colletion
      for (let collection of collections) {
        counts.push(db.collection(collection.collectionName).count());
      }

      Promise.all(counts).then(counts => {
        total = counts.reduce((a, b) => a + b);

        const bar = new ProgressBar(':bar :current/:total document', {total});

        collections.map(({collectionName}) => {
          db.collection(collectionName).find().forEach(doc => {
            queue.add(() => {
              bar.tick();
              return client.bulk({
                body: [
                  {
                    index: {
                      _index: collectionName,
                      _type: collectionName,
                      _id: doc._id,
                    },
                  },
                  {
                    doc: JSON.parse(JSON.stringify(doc)),
                  },
                ],
              });
            });
          });
        });
      });
    });
  });
};
