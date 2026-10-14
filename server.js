const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API da academia rodando em http://localhost:${PORT}`);
});
