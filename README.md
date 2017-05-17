# mongo-to-elastic
Elasticsearch transfer tool for MongoDB database. It is safer because every transaction is kept in a [promise queue].

## Install
```
npm install mongo-to-elastic -g
```

All collections are transferred unless the collection is defined. To define more than one collection;

```
mongo-to-elastic -db app -c user -c post
```

## Usage

```
Usage: mongo-to-elastic [options]

Options:
  --mongo-host, --mh    MongoDB host        (default localhost)
  --mongo-port, --mp    MongoDB port        (default 27017)
  --database, --db      MongoDB database      
  --collection, -c      MongoDB collection
  --elastic-host, --eh  ElasticSearch host  (default localhost)
  --elastic-port, --ep  ElasticSearch port  (default 9300)
  --concurrency, --con  Promise concurrency (default 250)
  --help                Show help          
```

[promise queue]: https://github.com/sindresorhus/p-queue
