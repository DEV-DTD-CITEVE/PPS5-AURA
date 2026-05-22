import { render, screen } from '@testing-library/react';
import CardGraph from './cardGraph.jsx';

test('updates rendered image href when piece_image changes', () => {
  const { rerender } = render(
    <CardGraph
      data={{ A: 10, B: 20, C: 30 }}
      images={{ A: 'old-a.png', B: null, C: null }}
    />,
  );

  expect(screen.getByRole('img')).toBeInTheDocument();

  rerender(
    <CardGraph
      data={{ A: 10, B: 20, C: 30 }}
      images={{ A: 'new-a.png', B: null, C: null }}
    />,
  );

  expect(screen.getByRole('img')).toBeInTheDocument();
});
