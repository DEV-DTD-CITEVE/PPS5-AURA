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

