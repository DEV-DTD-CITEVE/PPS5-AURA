# Arquitetura

## Visão geral
O estado global vive em `App.jsx`. A edição de compartimentos acontece dentro de cada `CartCard` e só é persistida quando o utilizador guarda.

## App.jsx (estado global)
### Estados
- `carts`: lista de carrinhos (estado principal)
- `toasts`: lista de notificações (renderizadas por `NotificationToast`)
- `collapsedCards`: estado de UI (colapso por card) — não faz parte da lógica core
- `showAddCartModal`: controla abertura do modal de criação

### Responsabilidades principais
- Criar carrinhos (recebe `newCart` do modal e adiciona a `carts`)
- Atualizar carrinho (recebe `updatedCompartments` e recalcula percentagens e itemsCount)
- Reset/descarregar carrinho (zera items e percentagens)
- Gerir toasts (criar e remover automaticamente)

### Função chave: handleUpdate(cartTitle, updatedCompartments)
Ao salvar um carrinho:
- aplica a lista de `updatedCompartments` ao carrinho correspondente
- recalcula `percentage` por compartimento:
  - `limit` default = 1 (evita divisão por zero)
  - percentagem arredondada (`Math.round`)
  - cap a 100
- recalcula `itemsCount` como soma de `items`
- dispara toast de sucesso

## CartCard (edição e UI do carrinho)
### Estado local
- `isEditing`: controla modo de edição
- `editedCompartments`: cópia “editável” dos compartimentos

### Como funciona a edição
- Ao clicar “Editar”:
  - ativa `isEditing = true`
  - cria uma cópia profunda dos compartimentos (`JSON.parse(JSON.stringify(comps))`)
- Enquanto edita:
  - `CompartmentDetails` altera `items` com +/-, input numérico
  - alterações atualizam `editedCompartments`
- Ao clicar “Salvar”:
  - chama `onUpdate(title, editedCompartments)`
  - volta `isEditing = false`

## Compartment / CompartmentDetails
- `Compartment` lista compartimentos e delega a cada `CompartmentDetails`
- `CompartmentDetails`:
  - mostra name/variant/items
  - em modo edição permite alterar `items`
  - mostra barra de progresso baseada em `percentage` e cor (verde/amarelo/vermelho)

## CardGraph
- Constrói percentagens A/B/C com base no campo `percentage` do compartimento
- A cor base depende do valor:
  - < 50: verde
  - >= 50: amarelo
  - >= 100: vermelho
- Renderiza SVG com “fill” conforme percentagem

## NotificationToast
- Renderiza toasts em dois viewports:
  - `top-center` para `position === "top"`
  - `bottom-right` para o resto
- `variant` controla classe e ícone (success/warning/error/neutralBlue/default)
