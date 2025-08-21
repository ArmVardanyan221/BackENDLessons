'use strict';
class Graph {
  constructor(options = {}) {
    this.directed = Boolean(options.directed);
    this.adjacency = new Map();
  }

  addEdge(u, v, w) {
    if (!Number.isFinite(w)) {
      throw new TypeError('Edge weight must be a finite number');
    }
    this.#ensureVertex(u);
    this.#ensureVertex(v);
    this.adjacency.get(u).push({ to: v, weight: w });
    if (!this.directed) {
      this.adjacency.get(v).push({ to: u, weight: w });
    }
  }

  hasCycle() {
    return this.directed ? this.#hasCycleDirected() : this.#hasCycleUndirected();
  }

  shortestPath(u, v) {
    if (!this.adjacency.has(u) || !this.adjacency.has(v)) {
      return Infinity;
    }

    if (this.#hasNegativeEdge()) {
      return this.#bellmanFordDistance(u, v);
    }

    const distance = new Map();
    const visited = new Set();
    for (const node of this.adjacency.keys()) {
      distance.set(node, Infinity);
    }
    distance.set(u, 0);

    while (visited.size < this.adjacency.size) {
      let current = null;
      let minDist = Infinity;
      for (const [node, d] of distance.entries()) {
        if (!visited.has(node) && d < minDist) {
          minDist = d;
          current = node;
        }
      }

      if (current === null || minDist === Infinity) {
        break;
      }
      if (current === v) {
        break;
      }

      visited.add(current);
      for (const { to, weight } of this.adjacency.get(current) || []) {
        if (visited.has(to)) continue;
        const alt = minDist + weight;
        if (alt < distance.get(to)) {
          distance.set(to, alt);
        }
      }
    }

    return distance.get(v) ?? Infinity;
  }

 // helpers
  #ensureVertex(x) {
    if (!this.adjacency.has(x)) {
      this.adjacency.set(x, []);
    }
  }

  #hasNegativeEdge() {
    for (const neighbors of this.adjacency.values()) {
      for (const { weight } of neighbors) {
        if (weight < 0) return true;
      }
    }
    return false;
  }

  #hasCycleDirected() {
    const visited = new Set();
    const inStack = new Set();

    const dfs = (node) => {
      if (inStack.has(node)) return true;
      if (visited.has(node)) return false;
      visited.add(node);
      inStack.add(node);
      for (const { to } of this.adjacency.get(node) || []) {
        if (dfs(to)) return true;
      }
      inStack.delete(node);
      return false;
    };

    for (const node of this.adjacency.keys()) {
      if (dfs(node)) return true;
    }
    return false;
  }

  #hasCycleUndirected() {
    const visited = new Set();

    const dfs = (node, parent) => {
      visited.add(node);
      for (const { to } of this.adjacency.get(node) || []) {
        if (!visited.has(to)) {
          if (dfs(to, node)) return true;
        } else if (to !== parent) {
          return true;
        }
      }
      return false;
    };

    for (const node of this.adjacency.keys()) {
      if (!visited.has(node)) {
        if (dfs(node, null)) return true;
      }
    }
    return false;
  }

  #bellmanFordDistance(source, target) {
    const vertices = Array.from(this.adjacency.keys());
    const edges = [];
    for (const [from, neighbors] of this.adjacency.entries()) {
      for (const { to, weight } of neighbors) {
        edges.push([from, to, weight]);
      }
    }

    const distance = new Map(vertices.map((n) => [n, Infinity]));
    distance.set(source, 0);

    for (let i = 0; i < vertices.length - 1; i++) {
      let updated = false;
      for (const [a, b, w] of edges) {
        const da = distance.get(a);
        const db = distance.get(b);
        if (da !== Infinity && da + w < db) {
          distance.set(b, da + w);
          updated = true;
        }
      }
      if (!updated) break;
    }

    for (const [a, b, w] of edges) {
      const da = distance.get(a);
      const db = distance.get(b);
      if (da !== Infinity && da + w < db) {
        return -Infinity;
      }
    }

    return distance.get(target) ?? Infinity;
  }
}

module.exports = { Graph };
