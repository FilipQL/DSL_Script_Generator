/**
 * Initial DataSets for the Vis Graph (Initial Lab Setup)
 */

let vis = require('vis/index-network');
import app from './config'

let nodes = new vis.DataSet();
let edges = new vis.DataSet();

if (app.loadSampleData) {
    let json_obj = config.sampleData;

    document.getElementById('dsl_id').value = json_obj.dsl_id;
    document.getElementById('dsl_description').value = json_obj.dsl_description;

    nodes.clear();
    edges.clear();

    nodes.add(json_obj.nodes);
    edges.add(json_obj.edges);
}

export default {
    nodes,
    edges
};