# Convenções

## Estado
- Global (dados): `App.jsx` (carts/toasts)
- Local (edição/UI): dentro do componente (ex.: `CartCard`)

## Atualização imutável
- `setCarts(prev => prev.map(...))`
- `setToasts(prev => [...prev, toast])`
- evitar mutações diretas (nunca alterar `prev`)

## Estrutura e CSS
- CSS por componente (ficheiro `.css` ao lado do `.jsx`)
- Componentes com múltiplos ficheiros em pasta dedicada

## Padrões de dados
- Compartimentos seguem `compartment_A/B/C`
- Percentagens sempre em 0..100
