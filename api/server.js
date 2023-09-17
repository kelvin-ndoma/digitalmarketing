const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json'); // Replace 'db.json' with your data file
const middlewares = jsonServer.defaults();

// Enable CORS for specific origin(s)
server.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:3000']; // Add the origins you want to allow here
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom route for adding a new user to the /subscribers endpoint
server.post('/subscribers', (req, res) => {
  const { name, email, id } = req.body;
  if (!name || !email || !id) {
    res.status(400).json({ error: 'Name, email, and ID are required' });
  } else {
    const db = router.db;
    db.get('subscribers')
      .push({ name, email, id })
      .write();
    res.status(201).json({ message: 'User added successfully' });
  }
});

server.use(router);

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
