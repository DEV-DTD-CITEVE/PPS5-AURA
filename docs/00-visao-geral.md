# Visão geral

## O que faz
A aplicação mostra uma lista de carrinhos. Cada carrinho tem 3 compartimentos (A/B/C).
O utilizador consegue:
- criar carrinhos novos
- editar quantidades (items) dos compartimentos
- guardar alterações e recalcular percentagens
- ver um gráfico com as percentagens (A/B/C)
- receber feedback por toasts (sucesso/erro/aviso/info)

## Modelo de dados

### Cart
- `id: string`
- `title: string`
- `itemsCount?: number` (pode vir undefined nos carrinhos seed)
- `compartments: Compartment[]`

### Compartment
- `name: string` (ex.: "compartment_A")
- `variant: string`
- `limit: number`
- `items: number`
- `percentage: number` (0..100)

## Regras principais
- `percentage` é calculada a partir de `items/limit` e limitada a 100
- `itemsCount` é a soma de `items` dos compartimentos do carrinho
- Edição é feita localmente no `CartCard` e só “afeta” o estado global quando o user carrega em **Salvar**
