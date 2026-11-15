import type { StoryImage } from '../schemas/media';
import { OpeningSky } from './OpeningSky';

export function SceneAtmosphere({
  kind,
  image,
}: {
  kind: 'memories' | 'discovery' | 'letter' | 'epilogue';
  image?: StoryImage;
}) {
  return (
    <div
      className={`story-player__atmosphere story-player__atmosphere--${kind}`}
      data-atmosphere
      aria-hidden="true"
    >
      <div className="story-player__atmosphere-light" data-atmosphere-layer />
      {kind === 'memories' && image && (
        <div
          className="story-player__atmosphere-photo"
          style={{ backgroundImage: `url(${JSON.stringify(image.src)})` }}
        />
      )}
      {kind === 'discovery' && (
        <div className="story-player__album-leaves">
          <span />
          <span />
        </div>
      )}
      {kind === 'epilogue' && <OpeningSky />}
    </div>
  );
}
