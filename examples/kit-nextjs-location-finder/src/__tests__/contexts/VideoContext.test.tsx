import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { VideoProvider, useVideo } from '@/contexts/VideoContext';

// Test component that uses the VideoContext
function TestVideoConsumer() {
  const { playingVideoId, setPlayingVideoId } = useVideo();

  return (
    <div>
      <div data-testid="current-video">{playingVideoId || 'none'}</div>
      <button data-testid="set-video-1" onClick={() => setPlayingVideoId('video-1')}>
        Play Video 1
      </button>
      <button data-testid="set-video-2" onClick={() => setPlayingVideoId('video-2')}>
        Play Video 2
      </button>
      <button data-testid="stop-video" onClick={() => setPlayingVideoId(null)}>
        Stop Video
      </button>
    </div>
  );
}

describe('VideoContext', () => {
  it('provides initial state with no playing video', () => {
    render(
      <VideoProvider>
        <TestVideoConsumer />
      </VideoProvider>
    );

    expect(screen.getByTestId('current-video')).toHaveTextContent('none');
  });

  it('updates playing video ID when setPlayingVideoId is called', () => {
    render(
      <VideoProvider>
        <TestVideoConsumer />
      </VideoProvider>
    );

    const setVideo1Button = screen.getByTestId('set-video-1');
    fireEvent.click(setVideo1Button);

    expect(screen.getByTestId('current-video')).toHaveTextContent('video-1');
  });

  it('allows switching between different video IDs', () => {
    render(
      <VideoProvider>
        <TestVideoConsumer />
      </VideoProvider>
    );

    // Set first video
    fireEvent.click(screen.getByTestId('set-video-1'));
    expect(screen.getByTestId('current-video')).toHaveTextContent('video-1');

    // Switch to second video
    fireEvent.click(screen.getByTestId('set-video-2'));
    expect(screen.getByTestId('current-video')).toHaveTextContent('video-2');
  });

  it('allows stopping video by setting to null', () => {
    render(
      <VideoProvider>
        <TestVideoConsumer />
      </VideoProvider>
    );

    // Start a video
    fireEvent.click(screen.getByTestId('set-video-1'));
    expect(screen.getByTestId('current-video')).toHaveTextContent('video-1');

    // Stop the video
    fireEvent.click(screen.getByTestId('stop-video'));
    expect(screen.getByTestId('current-video')).toHaveTextContent('none');
  });

  it('throws error when useVideo is used outside VideoProvider', () => {
    // Mock console.error to prevent error output during test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    function ComponentWithoutProvider() {
      useVideo();
      return <div>Test</div>;
    }

    expect(() => render(<ComponentWithoutProvider />)).toThrow(
      'useVideo must be used within a VideoProvider'
    );

    consoleSpy.mockRestore();
  });
});
