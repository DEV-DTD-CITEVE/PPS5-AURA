# Troubleshooting

## Percentagens não batem certo
- As percentagens são recalculadas no `App.jsx` em `handleUpdate`
- `limit` default = 1 se vier vazio/0
- percentagem é arredondada e limitada a 100

## `itemsCount` aparece undefined
- Se o cart inicial não tiver `itemsCount`, o `CartCard` calcula fallback:
  - `itemsCountFinal = itemsCount ?? totalItems`
- Se quiseres consistência total: inicializar `itemsCount` em todos os carrinhos seed.

## Modal não cria carrinho
- `AddCartModal` bloqueia se o título estiver vazio (`alert`)
- Confirma que `onAddCart` e `onClose` estão a ser passados no `App`

## Toasts aparecem no sítio errado
- `position === "top"` → viewport topo centro
- outros → viewport bottom right
