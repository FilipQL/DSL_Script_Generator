let vis = require('vis/index-network');
require('vis/dist/vis-network.min.css');
import data from './data'
import options from './options'
import {addNode, editNode, deleteNode} from './vis_setup/node'
import {addEdge, deleteEdge} from './vis_setup/edge'
import DSL from '../utilities/DSL'

let container = document.getElementById('mynetwork');

options.manipulation = {
    enabled: true,
    initiallyActive: true,
    addNode,
    editNode,
    deleteNode,
    addEdge,
    editEdge: false,
    deleteEdge
};

let network = new vis.Network(container, data, options);



/* ----------- Popovers (tooltips - Vis Node & Edge titles) ----------- */
network.on("hoverNode", function (params) {
    network.storePositions();
    let node = data.nodes.get(params.node);

    if(document.getElementById('lab-popover-checkbox').checked) { // if popovers are enabled
        node.title = DSL.generateTooltipNodeScript(node);
    } else {
        node.title = null;
    }

    
    data.nodes.update(node);
});

network.on("hoverEdge", function (params) {
    let edge = data.edges.get(params.edge);

    if(document.getElementById('lab-popover-checkbox').checked) { // if popovers are enabled
        edge.title = DSL.generateTooltipEdgeScript(edge, data.nodes);
    } else {
        edge.title = null;
    }

    data.edges.update(edge);
});

network.on("showPopup", function (id) {
    $("div.vis-tooltip").css({ // Style Vis popovers (Vis tooltips/titles):
        padding: 0,
        margin: 0,
        background: 'transparent',
        border: 'none'
    });
});



/* ----------- Enable Bootstrap Tooltips (used on "Configure Suggestions" modal inputs) ----------- */
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});



export default network;