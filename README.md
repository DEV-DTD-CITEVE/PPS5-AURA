# AURA

Frontend em React para gerir carrinhos (cards) com 3 compartimentos (A/B/C).
Cada compartimento tem:

- variante (texto)
- limite (capacidade)
- items (quantidade atual)
- percentagem (calculada)

A UI permite:

- criar carrinhos (modal)
- editar items por compartimento e guardar alterações
- visualizar percentagens num gráfico (CardGraph)
- receber feedback via notificações (toasts)

## Stack

- React (Create React App)
- CSS por componente
- Estado com hooks (`useState`)
- Assets em `public/images`

## Como correr

```bash
npm install
npm start
```

## Executando com Docker Compose

Para subir o frontend em ambiente de desenvolvimento:

```bash
docker compose up
```

A aplicação ficará disponível em `http://localhost:3847`. O hot-reload está ativo — alterações no código refletem-se automaticamente no browser.

Para rodar em background:

```bash
docker compose up -d
```

Para parar:

```bash
docker compose down
```

Para remover também o volume de `node_modules` e forçar reinstalação das dependências (útil após mudanças no `package.json`):

```bash
docker compose down -v
docker compose up
```

## Produção com NGINX

O build de produção usa same-origin por padrão. Se `REACT_APP_API_BASE_URL` e
`REACT_APP_REALTIME_BASE_URL` estiverem vazias, o frontend chama `/carts`,
`/api/` e `/api/realtime/events` no mesmo host da página.

```bash
docker compose -f docker-compose.prod.yml up --build
```

Para override explícito no build:

```bash
REACT_APP_API_BASE_URL=https://api.exemplo.com \
REACT_APP_REALTIME_BASE_URL=https://api.exemplo.com \
docker compose -f docker-compose.prod.yml up --build
```

NGINX serve o build estático e faz proxy de `/carts`, `/api/` e
`/api/realtime/events` para o backend em `:8055`.

## Referências

- [PPS5-AURA](../PPS5-AURA/package.json) — React + react-scripts, porta 3847
- [docker-compose.yml](docker-compose.yml) — serviços backend e frontend
