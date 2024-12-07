const express = require('express');

// Va permettre de rediriger les requêtes vers les bons microservices
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Proxy pour le service des paniers
app.use('/cart', createProxyMiddleware({
    target: 'http://localhost:3002',
    changeOrigin: true,
    pathRewrite: {
      '^/cart': '', // Rediriger /cart vers le microservice
    },
  }));

// Proxy pour le service des produits
app.use('/products', createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/products': '', // Rediriger /products vers le microservice
  },
}));

// Proxy pour le service des utilisateurs
app.use('/auth', createProxyMiddleware({
  target: 'http://localhost:5000',
  changeOrigin: true,
  pathRewrite: {
    '^/auth': '', // Rediriger /users vers le microservice
  },
}));

// Lancer le serveur API Gateway sur le port 3000
app.listen(3000, () => {
  console.log('API Gateway en fonctionnement sur http://localhost:3000');
});
