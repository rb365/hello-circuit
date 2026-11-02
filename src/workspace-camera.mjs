// World coordinates can extend in every direction. The camera stays in screen
// pixels, so SVG layers only need a viewport-sized window into that world.
function finite(value, name) {
  if (!Number.isFinite(value)) throw new RangeError(`${name} must be finite.`);
  return value;
}
function positive(value, name) {
  finite(value, name);
  if (value <= 0) throw new RangeError(`${name} must be positive.`);
  return value;
}
function cameraValues(camera) {
  finite(camera.x, 'Camera x');finite(camera.y, 'Camera y');positive(camera.scale, 'Camera scale');
}
const modulo = (value, step) => ((value % step) + step) % step;

/** World rectangle whose screen projection covers the viewport and margin. */
export function viewportWorldBounds(camera, width, height, margin = 64) {
  cameraValues(camera);positive(width, 'Viewport width');positive(height, 'Viewport height');
  finite(margin, 'Margin');if (margin < 0) throw new RangeError('Margin cannot be negative.');
  return {
    x: finite((-camera.x - margin) / camera.scale, 'World x'),
    y: finite((-camera.y - margin) / camera.scale, 'World y'),
    width: positive((width + 2 * margin) / camera.scale, 'World width'),
    height: positive((height + 2 * margin) / camera.scale, 'World height'),
  };
}

/** CSS radial-gradient tile geometry, with a dot at the projected world origin. */
export function gridGeometry(camera, baseSpacing = 18) {
  cameraValues(camera);positive(baseSpacing, 'Grid spacing');
  const logarithm = Math.log2(camera.scale), octave = -Math.round(logarithm);
  // Keep visible spacing near baseSpacing, using powers of two in world units.
  const spacing = positive(baseSpacing * 2 ** (logarithm + octave), 'Grid pixel spacing');
  const worldStep = positive(spacing / camera.scale, 'Grid world spacing');
  return {
    spacing,
    x: modulo(camera.x - spacing / 2, spacing),
    y: modulo(camera.y - spacing / 2, spacing),
    worldStep,
  };
}

/** Fit all supplied world bounds without imposing an artificial zoom-out floor. */
export function fitCamera(bounds, width, height, {padding = 40, maxScale = 1.5} = {}) {
  positive(width, 'Viewport width');positive(height, 'Viewport height');
  finite(bounds.x, 'Bounds x');finite(bounds.y, 'Bounds y');finite(bounds.width, 'Bounds width');finite(bounds.height, 'Bounds height');
  if (bounds.width < 0 || bounds.height < 0) throw new RangeError('Bounds dimensions cannot be negative.');
  finite(padding, 'Padding');if (padding < 0) throw new RangeError('Padding cannot be negative.');positive(maxScale, 'Maximum scale');
  const availableWidth = Math.max(1, width - 2 * padding), availableHeight = Math.max(1, height - 2 * padding);
  const scale = positive(Math.min(maxScale, bounds.width ? availableWidth / bounds.width : Infinity, bounds.height ? availableHeight / bounds.height : Infinity), 'Fit scale');
  return {
    x: finite(width / 2 - bounds.x * scale - bounds.width * scale / 2, 'Camera x'),
    y: finite(height / 2 - bounds.y * scale - bounds.height * scale / 2, 'Camera y'),
    scale,
  };
}

/** Zoom around a screen point. A very wide Fit can recover gradually toward the
 * ordinary zoom range, without zooming in when the user requests zoom out. */
export function zoomCamera(camera, factor, anchor, {minScale = .02, maxScale = 2.5} = {}) {
  cameraValues(camera);positive(factor, 'Zoom factor');finite(anchor.x, 'Anchor x');finite(anchor.y, 'Anchor y');
  positive(minScale, 'Minimum scale');positive(maxScale, 'Maximum scale');
  if (minScale > maxScale) throw new RangeError('Minimum scale cannot exceed maximum scale.');
  const lower = Math.min(minScale, camera.scale), upper = Math.max(maxScale, camera.scale);
  const scale = Math.max(lower, Math.min(upper, camera.scale * factor)), ratio = scale / camera.scale;
  return {
    x: finite(anchor.x + (camera.x - anchor.x) * ratio, 'Camera x'),
    y: finite(anchor.y + (camera.y - anchor.y) * ratio, 'Camera y'),
    scale,
  };
}
