// Fixed positions keep the night identical in SSR and hydration.
const stars = [
  [72, 104, 1],
  [192, 254, 1.4],
  [340, 82, 0.8],
  [464, 312, 1],
  [576, 146, 1.2],
  [752, 66, 0.8],
  [904, 224, 1.4],
  [1104, 124, 1],
  [104, 416, 0.8],
  [288, 534, 1],
  [818, 434, 0.8],
  [1082, 528, 1.2],
  [54, 706, 1.4],
  [404, 664, 0.8],
  [684, 612, 1],
  [956, 744, 0.8],
  [178, 848, 1],
  [536, 924, 1.2],
  [768, 836, 0.8],
  [1140, 908, 1],
  [80, 1080, 0.8],
  [318, 1018, 1.2],
  [624, 1138, 0.8],
  [1026, 1064, 1],
  [210, 1220, 1.4],
  [462, 1326, 0.8],
  [794, 1224, 1],
  [1128, 1340, 1.2],
  [118, 1448, 0.8],
  [370, 1520, 1],
  [716, 1434, 0.8],
  [966, 1514, 1],
] as const;

export function OpeningSky() {
  return (
    <div className="story-player__sky" aria-hidden="true">
      <div className="story-player__sky-depth" data-atmosphere-layer />
      <svg
        viewBox="0 0 1200 1600"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
      >
        {stars.map(([cx, cy, r], index) => (
          <circle
            key={index}
            cx={cx}
            cy={cy}
            r={r}
            opacity={index % 3 === 0 ? 0.6 : 0.28}
          />
        ))}
        <path d="M144 338v10m-5-5h10M1008 620v12m-6-6h12M886 1390v8m-4-4h8" />
      </svg>
    </div>
  );
}
