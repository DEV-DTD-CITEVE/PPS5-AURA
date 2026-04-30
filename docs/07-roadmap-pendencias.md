# Roadmap / Pendências

## 1) Remover `alert` do modal
Trocar `alert()` por um toast de erro para ficar consistente com o resto do UX.

## 2) Normalização do seed data
Alguns carrinhos iniciais não têm `itemsCount`. Duas opções:
- calcular ao criar o estado inicial
- ou remover `itemsCount` do modelo e sempre calcular (depende do objetivo)

## 3) Validação de inputs
- garantir que `limit >= 1`
- garantir que `items >= 0`
- garantir que `variant` pode ser vazio (ou exigir)

## 4) Acessibilidade extra
- no modo edição, garantir que botões e input têm labels/aria apropriadas (parcialmente já tem)
