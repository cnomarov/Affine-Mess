import { Mat3 } from '../src';
import { expect, test } from '@jest/globals';

test('Mat3 method identity', () => {
  const mat = Mat3.identity();

  // prettier-ignore
  expect(mat).toEqual(new Mat3(
    1, 0, 0, 
    0, 1, 0, 
    0, 0, 1
));
});
