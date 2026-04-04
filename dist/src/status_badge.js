/**
 * StatusBadge — animated spinner / completion / error indicator.
 * @module ui/status_badge
 *
 * Used by async and streaming panels to show:
 *   ⠋ Loading…   (idle / loading)
 *   ⠋ Streaming… (streaming)
 *   ✓ Done       (done)
 *   ✗ <message>  (error)
 */
import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
const SPINNER_FRAMES = ['⠋', '⠙', '⠸', '⠴', '⠦', '⠇'];
export function StatusBadge({ status, errorMessage }) {
    const [frame, setFrame] = useState(0);
    useEffect(() => {
        if (status !== 'loading' && status !== 'streaming')
            return;
        const t = setInterval(() => setFrame((f) => (f + 1) % SPINNER_FRAMES.length), 100);
        return () => clearInterval(t);
    }, [status]);
    if (status === 'done') {
        return (React.createElement(Box, null,
            React.createElement(Text, { bold: true, color: "green" }, "\u2713 "),
            React.createElement(Text, null, "Done")));
    }
    if (status === 'error') {
        return (React.createElement(Box, null,
            React.createElement(Text, { bold: true, color: "red" }, "\u2717 "),
            React.createElement(Text, { color: "red" }, errorMessage ?? 'An error occurred.')));
    }
    if (status === 'loading' || status === 'streaming') {
        const label = status === 'streaming' ? 'Streaming…' : 'Loading…';
        return (React.createElement(Box, null,
            React.createElement(Text, { color: "yellow" },
                SPINNER_FRAMES[frame],
                " "),
            React.createElement(Text, { dimColor: true }, label)));
    }
    // 'idle' — render nothing
    return React.createElement(React.Fragment, null);
}
export default StatusBadge;
//# sourceMappingURL=status_badge.js.map