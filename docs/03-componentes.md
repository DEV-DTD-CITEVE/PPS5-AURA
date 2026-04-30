# Componentes

## App (`src/App.jsx`)
- Estado global: `carts`, `toasts`
- Regras: recalcular percentagens e itemsCount ao guardar
- Composição: Header, Footer, lista de CartCards, AddCartModal, NotificationToast

## CartCard (`components/CartCard/cartCard.jsx`)
Props:
- `title`
- `itemsCount`
- `compartments`
- `onUpdate(title, updatedCompartments)`
- `isCollapsed` (UI)
- `onToggleCollapse(isCollapsed)` (UI)

Responsabilidade:
- mostrar carrinho (título, badge total items)
- modo edição (alterar items) e guardar/cancelar
- mostrar gráfico (CardGraph) + lista de compartimentos (Compartment)

## AddCartModal (`components/others/addCartModal.jsx`)
Props:
- `isOpen`
- `onClose`
- `onAddCart(newCart)`

Responsabilidade:
- criar carrinho com 3 compartimentos base
- definir `variant` e `limit`
- inicializar `items=0` e `percentage=0`

## Compartment (`components/compartmentDetails.jsx/compartment.jsx`)
- lista compartimentos e liga `onItemsChange` ao callback do pai

## CompartmentDetails (`components/compartmentDetails.jsx/compartmentDetails.jsx`)
- mostra UI do compartimento e barra de percentagem
- em edição permite alterar `items`

## CardGraph (`components/cardGraph/cardGraph.jsx`)
- renderiza gráfico SVG com percentagens A/B/C

## NotificationToast (`components/others/notificationToast.jsx`)
- mostra toasts e permite fechar manualmente
