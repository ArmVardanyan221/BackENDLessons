const { Graph } = require("./graph");

const graph = new Graph({ directed: true });

graph.addEdge("A", "B", 1);
graph.addEdge("B", "C", 2);
graph.addEdge("C", "D", 3);
graph.addEdge("D", "A", 4);
graph.addEdge("E", "K", 5);

console.log(graph.hasCycle());
console.log(graph.shortestPath("A", "D"));
console.log(graph.shortestPath("A", "K"));
