// Simple BFS pathfinder for NPC movement on the tile grid

export function findPath(tilemap, startCol, startRow, endCol, endRow) {
    const sc = Math.round(startCol);
    const sr = Math.round(startRow);
    const ec = Math.round(endCol);
    const er = Math.round(endRow);

    if (sc === ec && sr === er) return [];
    if (!tilemap.isWalkable(ec, er)) return null;

    const key = (c, r) => `${c},${r}`;
    const visited = new Set();
    const parent = new Map();
    const queue = [{ col: sc, row: sr }];
    visited.add(key(sc, sr));

    const dirs = [
        { dc: 0, dr: -1 }, // up
        { dc: 0, dr: 1 },  // down
        { dc: -1, dr: 0 }, // left
        { dc: 1, dr: 0 },  // right
    ];

    while (queue.length > 0) {
        const curr = queue.shift();

        if (curr.col === ec && curr.row === er) {
            // Reconstruct path
            const path = [];
            let node = curr;
            while (node.col !== sc || node.row !== sr) {
                path.unshift({ col: node.col, row: node.row });
                node = parent.get(key(node.col, node.row));
            }
            return path;
        }

        for (const dir of dirs) {
            const nc = curr.col + dir.dc;
            const nr = curr.row + dir.dr;
            const k = key(nc, nr);

            if (!visited.has(k) && tilemap.isWalkable(nc, nr)) {
                visited.add(k);
                parent.set(k, curr);
                queue.push({ col: nc, row: nr });
            }
        }
    }

    return null; // No path found
}
