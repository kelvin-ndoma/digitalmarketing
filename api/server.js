const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.rewriter({
  '/api/*': '/$1',
  '/blog/:resource/:id/show': '/:resource/:id',
}));

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
