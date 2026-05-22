import {
  mapCompartmentsFromObject,
  mergeCartStateFromRealtime,
  normalizeRealtimeCart,
} from './App';

describe('realtime cart merge', () => {
  test('uses realtime piece_image when present', () => {
    const currentCarts = [
      {
        id: 'cart-1',
        title: 'cart-1',
        compartments: [
          { name: 'compartment_A', piece_image: 'old-a.png', piece_count: 1, max_pieces: 10 },
        ],
        itemsCount: 1,
      },
    ];

    const result = normalizeRealtimeCart(
      {
        cart: {
          id: 'cart-1',
          compartments: [
            { name: 'compartment_A', piece_count: 2, max_pieces: 10, piece_image: 'new-a.png' },
          ],
        },
      },
      currentCarts,
    );

    expect(result).toMatchObject({
      id: 'cart-1',
      compartments: [
        { name: 'compartment_A', piece_image: 'new-a.png', piece_count: 2, max_pieces: 10 },
      ],
      itemsCount: 2,
    });
  });

  test('keeps prior piece_image when realtime payload omits it', () => {
    const currentCarts = [
      {
        id: 'cart-1',
        title: 'cart-1',
        compartments: [
          { name: 'compartment_A', piece_image: 'old-a.png', piece_count: 1, max_pieces: 10 },
        ],
        itemsCount: 1,
      },
    ];

    const result = normalizeRealtimeCart(
      {
        cart: {
          id: 'cart-1',
          compartments: [
            { name: 'compartment_A', piece_count: 2, max_pieces: 10 },
          ],
        },
      },
      currentCarts,
    );

    expect(result.compartments[0].piece_image).toBe('old-a.png');
  });

  test('mergeCartStateFromRealtime replaces matching cart', () => {
    const currentCarts = [
      {
        id: 'cart-1',
        title: 'cart-1',
        compartments: [
          { name: 'compartment_A', piece_image: 'old-a.png', piece_count: 1, max_pieces: 10 },
        ],
        itemsCount: 1,
      },
    ];

    const merged = mergeCartStateFromRealtime(currentCarts, {
      cart: {
        id: 'cart-1',
        compartments: [
          { name: 'compartment_A', piece_count: 2, max_pieces: 10, piece_image: 'new-a.png' },
        ],
      },
    });

    expect(merged.didMerge).toBe(true);
    expect(merged.carts[0].compartments[0].piece_image).toBe('new-a.png');
    expect(merged.carts[0].itemsCount).toBe(2);
  });

  test('mapCompartmentsFromObject keeps piece_image fields', () => {
    expect(
      mapCompartmentsFromObject({
        compartment_A: { piece_image: 'image-a.png', piece_count: 3, max_pieces: 10 },
      }),
    ).toEqual([
      {
        name: 'compartment_A',
        piece_image: 'image-a.png',
        piece_count: 3,
        max_pieces: 10,
      },
    ]);
  });
});
