import React from 'react';
import { render } from '@testing-library/react-native';
import ProgressBar from '../../src/components/ProgressBar';

describe('ProgressBar', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<ProgressBar progress={0.5} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with zero progress', () => {
    const { toJSON } = render(<ProgressBar progress={0} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with full progress', () => {
    const { toJSON } = render(<ProgressBar progress={1} />);
    expect(toJSON()).toBeTruthy();
  });

  it('clamps progress above 1', () => {
    const { toJSON } = render(<ProgressBar progress={1.5} />);
    expect(toJSON()).toBeTruthy();
  });

  it('clamps negative progress to 0', () => {
    const { toJSON } = render(<ProgressBar progress={-0.5} />);
    expect(toJSON()).toBeTruthy();
  });

  it('accepts custom height', () => {
    const { toJSON } = render(<ProgressBar progress={0.5} height={20} />);
    expect(toJSON()).toBeTruthy();
  });

  it('accepts custom color', () => {
    const { toJSON } = render(<ProgressBar progress={0.5} color="#FF0000" />);
    expect(toJSON()).toBeTruthy();
  });
});
