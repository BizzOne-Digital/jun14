import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function loadEnvLocal() {
  const path = join(root, '.env.local');
  if (!existsSync(path)) return;
  const text = readFileSync(path, 'utf8');
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'food_store';

if (!uri) {
  console.error('MONGODB_URI is missing in .env.local');
  process.exit(1);
}

const menuPath = join(root, 'src/data/menu.json');
const menu = JSON.parse(readFileSync(menuPath, 'utf8'));

const withImage = menu.categories.reduce(
  (n, c) => n + c.products.filter((p) => p.image).length,
  0
);
const total = menu.categories.reduce((n, c) => n + c.products.length, 0);

console.log(`Menu: ${menu.categories.length} categories, ${total} products, ${withImage} with images`);

const client = new MongoClient(uri);

try {
  await client.connect();
  const db = client.db(dbName);

  await db.collection('store_config').updateOne(
    { key: 'menu' },
    {
      $set: {
        key: 'menu',
        data: menu,
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );

  await db.collection('categories').deleteMany({});
  await db.collection('products').deleteMany({});

  const categoryDocs = menu.categories.map((cat, index) => ({
    _id: cat.id,
    name: cat.name,
    image: cat.image,
    sortOrder: index,
  }));

  if (categoryDocs.length) {
    await db.collection('categories').insertMany(categoryDocs);
  }

  const productDocs = [];
  for (const cat of menu.categories) {
    for (const [index, product] of cat.products.entries()) {
      productDocs.push({
        _id: product.id,
        categoryId: cat.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        sortOrder: index,
      });
    }
  }

  if (productDocs.length) {
    await db.collection('products').insertMany(productDocs);
  }

  console.log('Seed complete:', dbName);
  console.log('  store_config.menu — full menu JSON');
  console.log('  categories —', categoryDocs.length);
  console.log('  products —', productDocs.length);
} finally {
  await client.close();
}
