# Fluxos principais

## 1) Criar um carrinho (modal)
Componentes: `App` → `AddCartModal`

1. User clica "Novo Carrinho"
2. `App` abre modal (`showAddCartModal = true`)
3. User preenche:
   - nome do carrinho
   - variante e limite de cada compartimento (A/B/C)
4. Ao confirmar:
   - `AddCartModal` cria `newCart` com:
     - `id = Date.now().toString()`
     - `itemsCount = 0`
     - compartments com `items=0` e `percentage=0`
   - chama `onAddCart(newCart)`
   - fecha modal (`onClose()`)

## 2) Editar items de um carrinho (modo edição local)
Componentes: `CartCard` → `Compartment` → `CompartmentDetails`

1. User clica "Editar" num cart
2. `CartCard` ativa `isEditing = true` e faz cópia dos compartimentos
3. User altera `items` por compartimento:
   - botões +/-
   - input numérico
4. Enquanto edita, as mudanças ficam só em `editedCompartments` (local)

## 3) Salvar alterações (persistir no estado global)
Componentes: `CartCard` → `App`

1. User clica "Salvar"
2. `CartCard` chama `onUpdate(title, editedCompartments)`
3. `App` aplica a atualização:
   - recalcula `percentage` com base em `items/limit`
   - recalcula `itemsCount`
4. `App` mostra toast de sucesso

## 4) Cancelar edição
Componentes: `CartCard`

1. User clica "Cancelar"
2. `CartCard` descarta `editedCompartments` e sai de edição
3. Nada muda no estado global

## 5) Visualização do gráfico
Componentes: `CartCard` → `CardGraph`

1. `CartCard` constrói `graphData` com A/B/C baseado no `percentage` dos compartimentos
2. `CardGraph` renderiza o SVG e cores conforme percentagem
