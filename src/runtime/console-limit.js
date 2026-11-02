// Keep accidental logging loops from filling the main-thread message queue.
// This is a usability bound, not an adversarial worker security boundary.
module.exports = function createConsoleLimiter(send, printable, now = Date.now) {
  let windowStart = now(), count = 0;
  return (level, args) => {
    const time = now();
    if (time - windowStart >= 1000) { windowStart = time; count = 0; }
    if (++count > 100) {
      if (count === 101) send({type:'console',level:'warn',args:['Console output limited to 100 messages per second.']});
      return;
    }
    let remaining = 6000;
    const output = [];
    for (const value of args.slice(0, 20)) {
      const text = String(printable(value)).slice(0, remaining);
      output.push(text); remaining -= text.length;
      if (!remaining) break;
    }
    send({type:'console',level,args:output});
  };
};
