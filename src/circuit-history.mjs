// Apply one circuit edit without rewinding unrelated sensor or property changes.
// Undo passes (current, entry.after, entry.before); Redo reverses the last two.
const own = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const copy = value => Array.isArray(value) ? value.map(copy) : record(value)
  ? Object.fromEntries(Object.entries(value).map(([key, item]) => [key, copy(item)])) : value;

function equal(a, b) {
  if (Object.is(a, b)) return true;
  if (Array.isArray(a) || Array.isArray(b)) {
    return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((item, i) => equal(item, b[i]));
  }
  if (!record(a) || !record(b)) return false;
  const keys = Object.keys(a);
  return keys.length === Object.keys(b).length && keys.every(key => own(b, key) && equal(a[key], b[key]));
}

function applyFields(current, from, to) {
  if (equal(from, to)) return copy(current);
  if (!record(from) || !record(to)) return copy(to);
  const result = record(current) ? copy(current) : {};
  for (const key of new Set([...Object.keys(from), ...Object.keys(to)])) {
    if (!own(to, key)) delete result[key];
    else if (!own(from, key) || !equal(from[key], to[key])) {
      // Define an own property, including for imported keys such as __proto__.
      Object.defineProperty(result, key, {
        value: own(from, key) ? applyFields(result[key], from[key], to[key]) : copy(to[key]),
        writable: true, enumerable: true, configurable: true,
      });
    }
  }
  return result;
}

// Keep current unrelated items in place. Insert restored items beside their
// target neighbours; only reorder existing items when the edit reordered them.
function applyOrder(currentKeys, fromKeys, toKeys, items) {
  const result = currentKeys.filter(key => items.has(key));
  const targetKeys = toKeys.filter(key => items.has(key));
  for (let i = 0; i < targetKeys.length; i++) {
    const key = targetKeys[i];
    if (result.includes(key)) continue;
    const next = targetKeys.slice(i + 1).find(candidate => result.includes(candidate));
    const previous = targetKeys.slice(0, i).reverse().find(candidate => result.includes(candidate));
    const index = next !== undefined ? result.indexOf(next) : previous !== undefined ? result.indexOf(previous) + 1 : result.length;
    result.splice(index, 0, key);
  }
  const shared = new Set(fromKeys.filter(key => toKeys.includes(key)));
  if (!equal(fromKeys.filter(key => shared.has(key)), toKeys.filter(key => shared.has(key)))) {
    const target = new Set(targetKeys);
    let index = 0;
    return result.map(key => target.has(key) ? targetKeys[index++] : key);
  }
  return result;
}

const wireKey = wire => JSON.stringify([wire.a, wire.b].sort());
const partId = endpoint => typeof endpoint === 'string' ? endpoint.slice(0, endpoint.indexOf(':')) : '';

export function applyHistoryState(current, from, to) {
  const beforeParts = new Map(from.parts.map(part => [part.id, part]));
  const afterParts = new Map(to.parts.map(part => [part.id, part]));
  const parts = new Map(current.parts.map(part => [part.id, copy(part)]));
  for (const [id, part] of beforeParts) {
    if (!afterParts.has(id)) parts.delete(id);
    else if (parts.has(id)) parts.set(id, applyFields(parts.get(id), part, afterParts.get(id)));
  }
  for (const [id, part] of afterParts) {
    if (!beforeParts.has(id) && !parts.has(id)) parts.set(id, copy(part));
  }
  const partOrder = applyOrder(current.parts.map(part => part.id), from.parts.map(part => part.id), to.parts.map(part => part.id), parts);

  const resultParts = partOrder.map(id => parts.get(id));
  const validWire = wire => parts.has(partId(wire.a)) && parts.has(partId(wire.b));
  if (equal(from.wires, to.wires)) {
    return {parts: resultParts, wires: current.wires.filter(validWire).map(copy)};
  }

  const beforeWires = new Map(from.wires.map(wire => [wireKey(wire), wire]));
  const afterWires = new Map(to.wires.map(wire => [wireKey(wire), wire]));
  const wires = new Map();
  for (const wire of current.wires) if (!wires.has(wireKey(wire))) wires.set(wireKey(wire), copy(wire));
  for (const [key, wire] of beforeWires) {
    if (!afterWires.has(key)) wires.delete(key);
    else if (wires.has(key)) wires.set(key, applyFields(wires.get(key), wire, afterWires.get(key)));
  }
  for (const [key, wire] of afterWires) {
    if (!beforeWires.has(key) && !wires.has(key)) wires.set(key, copy(wire));
  }
  // Removing a part also removes newer connections to it, never leaves a
  // dangling endpoint. The history entry still holds its original connections.
  for (const [key, wire] of wires) if (!validWire(wire)) wires.delete(key);
  const uniqueKeys = items => [...new Set(items.map(wireKey))];
  const wireOrder = applyOrder(uniqueKeys(current.wires), uniqueKeys(from.wires), uniqueKeys(to.wires), wires);
  return {parts: resultParts, wires: wireOrder.map(key => wires.get(key))};
}
