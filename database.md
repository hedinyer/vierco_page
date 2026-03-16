### Tablas Postgres para Vierco

```sql
create table public.products (
  id uuid not null default gen_random_uuid (),
  slug text not null,
  ref text null,
  name text not null,
  description text null,
  price_cents integer not null,
  availability text null,
  image_url text not null,
  alt_text text null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  sizes jsonb null default '[]'::jsonb,
  constraint products_pkey primary key (id),
  constraint products_slug_key unique (slug)
) TABLESPACE pg_default;

CREATE TABLE product_features (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  title       text NOT NULL,
  description text NOT NULL,
  position    integer NOT NULL DEFAULT 0
);

CREATE TABLE product_images (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url   text NOT NULL,
  alt_text    text,
  position    integer NOT NULL DEFAULT 0
);

CREATE TABLE customers (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email              text NOT NULL,
  full_name          text NOT NULL,
  phone_number       text NOT NULL,
  phone_prefix       text NOT NULL DEFAULT '+57',
  legal_id           text NOT NULL,
  legal_id_type      text NOT NULL,
  created_at         timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE shipping_addresses (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id     uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  address_line_1  text NOT NULL,
  city            text NOT NULL,
  region          text NOT NULL,
  country         text NOT NULL DEFAULT 'CO',
  phone_number    text NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE orders (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id         uuid NOT NULL REFERENCES customers(id),
  shipping_address_id uuid NOT NULL REFERENCES shipping_addresses(id),
  payment_method      text NOT NULL,
  subtotal_cents      integer NOT NULL,
  shipping_cents      integer NOT NULL DEFAULT 0,
  total_cents         integer NOT NULL,
  status              text NOT NULL DEFAULT 'PENDING',
  created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE order_items (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id          uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id        uuid NOT NULL REFERENCES products(id),
  product_name      text NOT NULL,
  size              text NOT NULL,
  unit_price_cents  integer NOT NULL,
  quantity          integer NOT NULL DEFAULT 1,
  line_total_cents  integer NOT NULL
);
```

### Políticas RLS (Row Level Security)

Para que la app funcione con la clave pública, habilita RLS y añade políticas en Supabase:

```sql
-- Lectura pública de productos
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);

-- (Opcional) Inserción pública de productos para panel interno sin auth.
-- En producción deberías restringirla a usuarios autenticados.
CREATE POLICY "Allow insert products" ON products FOR INSERT WITH CHECK (true);

ALTER TABLE product_features ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read product_features" ON product_features FOR SELECT USING (true);

CREATE POLICY "Allow insert product_features" ON product_features FOR INSERT WITH CHECK (true);

ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read product_images" ON product_images FOR SELECT USING (true);

CREATE POLICY "Allow insert product_images" ON product_images FOR INSERT WITH CHECK (true);

-- Inserción pública para checkout (o restringir según tu lógica)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow insert customers" ON customers FOR INSERT WITH CHECK (true);

ALTER TABLE shipping_addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow insert shipping_addresses" ON shipping_addresses FOR INSERT WITH CHECK (true);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow insert orders" ON orders FOR INSERT WITH CHECK (true);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow insert order_items" ON order_items FOR INSERT WITH CHECK (true);
```

### Seed de productos

Para cargar los productos estáticos en la base de datos:

```bash
npm run seed
```

