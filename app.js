//npm install cors


const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

// add this to read the queries from url
const url = require('url')

const records = require('./records');

app.use(express.json());

// Send a GET request to /items to READ a list of items
app.get('/items', async (req, res) => {

    // code to read queries in the url
    const url_parts = url.parse(req.url, true)
    const query = url_parts.query;

    // your query strings are in the query variable now
    // you can console.log and see them

//    console.log(query.id)
//    console.log(query.option)

    // the rest of the program is like before
    const items = await records.getItems();
    res.json(items);
});

// Send a GET request to /items/:id to READ(view) a quote
app.get('/items/:id', async (req, res) => {
    try {
        const item = await records.getItem(req.params.id);
        if (item) {
            res.json(item);
        } else {
            res.status(404).json({ message: "Item not found." });
        }

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Search an item
app.get('/search', async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    const items = await records.searchItem(query);
    res.json(items);
});

//Send a POST request to /item to  CREATE a new item 
app.post('/items', async (req, res) => {
    try {
        if (req.body.imageUrl && req.body.description && req.body.minBidPrice) {
            const item = await records.createItem({
                imageUrl: req.body.imageUrl,
                description: req.body.description,
                minBidPrice: req.body.minBidPrice,
                bidList : req.body.bidList
            });
            res.status(201).json(item);
        } else {
            res.status(400).json({ message: "Image URL, description and min bid price required." });
        }

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Send a PUT request to /quotes/:id to UPDATE (edit) a quote
app.put('/items/:id', async (req, res) => {
    try {
        const item = await records.getItem(req.params.id);
        if (item) {
            item.imageUrl = req.body.imageUrl;
            item.description = req.body.description;
            item.minBidPrice = req.body.minBidPrice;
            item.bidList = req.body.bidList;

            await records.updateItem(item);
            res.json({ message: "Item successfully updated." });
            res.status(204).end();
        } else {
            res.status(404).json({ message: "Item Not Found" });
        }

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Send a DELETE request to /quotes/:id DELETE a quote 
app.delete("/items/:id", async (req, res, next) => {
    try {
        const item = await records.getItem(req.params.id);
        await records.deleteItem(item);
        res.json({ message: "Item successfully deleted." });
        res.status(204).end();
    } catch (err) {
            next(err);
    }
});
// Send a GET request to /quotes/quote/random to READ (view) a random quote

app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    })
});
app.listen(3000, () => console.log('Auction API listening on port 3000!'));

