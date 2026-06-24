const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ---------------------------------------------------------------------------
// In-memory data: categories + product catalogue
// ---------------------------------------------------------------------------
const categories = [
  'Clothes',
  'Accessories',
  'Electronic appliances',
  'Grocery',
  'Home Decor'
];

const products = [
  {
    id: 1,
    name: 'Cotton Casual T-Shirt',
    category: 'Clothes',
    price: 499,
    image: 'https://picsum.photos/seed/tshirt/400/300',
    description: 'Soft, breathable cotton t-shirt perfect for everyday wear.'
  },
  {
    id: 2,
    name: 'Leather Wrist Watch',
    category: 'Accessories',
    price: 1999,
    image: 'https://picsum.photos/seed/watch/400/300',
    description: 'Elegant analog watch with genuine leather strap.'
  },
  {
    id: 3,
    name: 'Microwave Oven 20L',
    category: 'Electronic appliances',
    price: 6499,
    image: 'https://picsum.photos/seed/microwave/400/300',
    description: 'Compact 20L microwave oven with auto-cook menu.'
  },
  {
    id: 4,
    name: 'Organic Basmati Rice 5kg',
    category: 'Grocery',
    price: 749,
    image: 'https://picsum.photos/seed/rice/400/300',
    description: 'Premium long-grain organic basmati rice, 5kg pack.'
  },
  {
    id: 5,
    name: 'Decorative Table Lamp',
    category: 'Home Decor',
    price: 1299,
    image: 'https://picsum.photos/seed/lamp/400/300',
    description: 'Warm-light decorative lamp to brighten up any room.'
  },
  {
    id: 6,
    name: 'Slim Fit Denim Jeans',
    category: 'Clothes',
    price: 1399,
    image: 'https://picsum.photos/seed/jeans/400/300',
    description: 'Stretchable slim-fit denim jeans for a sharp look.'
  },
  {
    id: 7,
    name: 'Wireless Bluetooth Earbuds',
    category: 'Electronic appliances',
    price: 2499,
    image: 'https://picsum.photos/seed/earbuds/400/300',
    description: 'Noise-isolating wireless earbuds with charging case.'
  },
  {
    id: 8,
    name: 'Handcrafted Wall Clock',
    category: 'Home Decor',
    price: 899,
    image: 'https://picsum.photos/seed/clock/400/300',
    description: 'Vintage-style handcrafted wall clock for living rooms.'
  }
];

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

// Home page
app.get('/', (req, res) => {
  res.render('index', { categories, products });
});

// Category filtered listing (reuses the home view)
app.get('/category/:name', (req, res) => {
  const name = req.params.name;
  const filtered = products.filter(
    (p) => p.category.toLowerCase() === name.toLowerCase()
  );
  res.render('index', {
    categories,
    products: filtered.length ? filtered : products,
    activeCategory: name
  });
});

// Login page
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// Login form submission (server-side validation mirrors client-side rules)
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const emailValid = typeof username === 'string' && username.includes('@');
  const passwordValid =
    typeof password === 'string' &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>_\-\[\]\\/+=;'`~]/.test(password);

  if (!emailValid) {
    return res.render('login', {
      error: 'Username must be a valid email id (must contain @).'
    });
  }
  if (!passwordValid) {
    return res.render('login', {
      error:
        'Password must contain at least one uppercase letter, one lowercase letter and one special character.'
    });
  }

  // Demo: on success, send back to home
  return res.redirect('/');
});

// Product detail page (opened in a new tab from the home page)
app.get('/product/:id', (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id, 10));
  if (!product) {
    return res.status(404).render('product', { product: null });
  }
  res.render('product', { product });
});

// Simple health check endpoint (handy for Docker / CI/CD probes)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Only start listening when run directly (so tests can import the app safely).
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`OneCart server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
