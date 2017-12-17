let _ = require('lodash');
import app from './../config'
import data from './../data'


/**
 * Add a new link.
 *
 * @param edgeData
 * @param callback
 */
export function addEdge(edgeData, callback) {

    let saveButton =  document.getElementById('link-saveButton');
    saveButton.innerHTML = "Add Link";

    if (edgeData.from == edgeData.to) // selfie link
    {
        let newNode = data.nodes.get(edgeData.from);

        $("#vsi-port-settings-1, #vsi-port-settings-2").addClass("hidden");

        if (newNode.group != 'vsi')
        {
            /* ------------- 'Add Link' button click -------------  */
            saveButton.onclick = function() {
                // Update Nodes:
                newNode.ports_count++;
                let newNodePortFrom =  `p${newNode.ports_count}`;
                newNode.ports[newNodePortFrom] = newNodePortFrom;
                data.nodes.update(newNode);

                newNode = data.nodes.get(edgeData.to);
                newNode.ports_count++;
                let newNodePortTo =  `p${newNode.ports_count}`;
                newNode.ports[newNodePortTo] = newNodePortTo;

                data.nodes.update(newNode);


                // Set Edge (link) properties:
                setEdgeProperties(edgeData, newNode, newNode, newNodePortFrom, newNodePortTo, true);
                setBandwidth(edgeData);

                callback(edgeData); // Save edge (link) and add it to the graph
                $('#link-popUp').modal('hide'); // Hide Modal
            };
        }
        else
        {
            $("#vsi-port-settings-1, #vsi-port-settings-2").removeClass("hidden");

            document.getElementById("select-vsi-port-type-1").selectedIndex = 0;
            document.getElementById("select-vsi-port-type-2").selectedIndex = 0;
            document.getElementById("mode-1").disabled = true;
            document.getElementById("mode-2").disabled = true;

            document.getElementById('vsi-dsl_id-1').textContent = newNode.dsl_id;
            document.getElementById('non-vsi-dsl_id-1').textContent = newNode.dsl_id;

            document.getElementById('vsi-dsl_id-2').textContent = newNode.dsl_id;
            document.getElementById('non-vsi-dsl_id-2').textContent = newNode.dsl_id;


            /* ------------- Setup VSI port inputs (settings) ------------- */
            let vsiPortType = 'logicalPort';

            document.getElementById('input-vsi-port-type-1').value = newNode.ports_count + 1;
            document.getElementById('input-vsi-port-type-2').value = newNode.ports_count + 2;


            /* ------------- 'Add Link' button click -------------  */
            saveButton.onclick = function() {

                let vsiPortValue1 = document.getElementById('input-vsi-port-type-1').value;
                let vsiPort1 = setVsiPort(newNode, vsiPortType, vsiPortValue1, edgeData);

                let vsiPortValue2 = document.getElementById('input-vsi-port-type-2').value;
                let vsiPort2 = setVsiPort(newNode, vsiPortType, vsiPortValue2, edgeData);

                data.nodes.update(newNode);

                // Set Edge (link) properties:
                setEdgeProperties(edgeData, newNode, newNode, vsiPort1, vsiPort2, true);
                setBandwidth(edgeData);

                callback(edgeData); // Save edge (link) and add it to the graph
                $('#link-popUp').modal('hide'); // Hide Modal
            };
        }
    }
    else
    {
        let nodeOne = data.nodes.get(edgeData.from);
        let nodeTwo = data.nodes.get(edgeData.to);

        if (nodeOne.group != 'vsi' && nodeTwo.group != 'vsi') /* ---------- IF NONE OF THE NODES IS VSI ---------- */
        {
            $("#vsi-port-settings-1, #vsi-port-settings-2").addClass("hidden"); // Hide VSI Port Settings


            /* ------------- 'Add Link' button click -------------  */
            saveButton.onclick = function() {
                // Update Nodes:
                nodeOne.ports_count++;
                nodeTwo.ports_count++;

                let nodeOnePort =  `p${nodeOne.ports_count}`;
                let nodeTwoPort =  `p${nodeTwo.ports_count}`;

                nodeOne.ports[nodeOnePort] = nodeOnePort;
                nodeTwo.ports[nodeTwoPort] = nodeTwoPort;

                data.nodes.update(nodeOne);
                data.nodes.update(nodeTwo);


                // Set Edge (link) properties:
                setEdgeProperties(edgeData, nodeOne, nodeTwo, nodeOnePort, nodeTwoPort);
                setBandwidth(edgeData);

                callback(edgeData); // Save edge (link) and add it to the graph
                $('#link-popUp').modal('hide'); // Hide Modal
            };
        }
        else if (nodeOne.group == 'vsi' && nodeTwo.group == 'vsi') /* ---------- IF BOTH NODES ARE VSI ---------- */
        {
            $("#vsi-port-settings-1, #vsi-port-settings-2").removeClass("hidden");

            checkIfControllerPortExists(nodeOne);
            checkIfControllerPortExists(nodeTwo, 'mode-2');

            document.getElementById('vsi-dsl_id-1').textContent = nodeOne.dsl_id;
            document.getElementById('non-vsi-dsl_id-1').textContent = nodeTwo.dsl_id;

            document.getElementById('vsi-dsl_id-2').textContent = nodeTwo.dsl_id;
            document.getElementById('non-vsi-dsl_id-2').textContent = nodeOne.dsl_id;


            /* ------------- Setup VSI port inputs (settings) for the first VSI node (nodeOne = from) ------------- */
            let selectVsiPortType1 = $('#select-vsi-port-type-1');
            let vsiPortType1 = selectVsiPortType1.val();
            let inputVsiPortType1 = document.getElementById('input-vsi-port-type-1');

            prepareInputVsiPortType(nodeOne, vsiPortType1, inputVsiPortType1);

            selectVsiPortType1.change(() => {
                vsiPortType1 = selectVsiPortType1.val();
                prepareInputVsiPortType(nodeOne, vsiPortType1, inputVsiPortType1);
            });


            /* ------------- Setup VSI port inputs (settings) for the second VSI node (nodeTwo = to) ------------- */
            let selectVsiPortType2 = $('#select-vsi-port-type-2');
            let vsiPortType2 = selectVsiPortType2.val();
            let inputVsiPortType2 = document.getElementById('input-vsi-port-type-2');

            prepareInputVsiPortType(nodeTwo, vsiPortType2, inputVsiPortType2);

            selectVsiPortType2.change(() => {
                vsiPortType2 = selectVsiPortType2.val();
                prepareInputVsiPortType(nodeTwo, vsiPortType2, inputVsiPortType2);
            });


            /* ------------- 'Add Link' button click -------------  */
            saveButton.onclick = function() {
                // Update the first VSI node:
                let vsiPortValue1 = document.getElementById('input-vsi-port-type-1').value;
                let vsiPort1 = setVsiPort(nodeOne, vsiPortType1, vsiPortValue1, edgeData);

                // Update the second VSI node:
                let vsiPortValue2 = document.getElementById('input-vsi-port-type-2').value;
                let vsiPort2 = setVsiPort(nodeTwo, vsiPortType2, vsiPortValue2, edgeData);

                // Set Edge (link) properties:
                setEdgeProperties(edgeData, nodeOne, nodeTwo, vsiPort1, vsiPort2);
                setBandwidth(edgeData);

                callback(edgeData); // Save edge (link) and add it to the graph
                $('#link-popUp').modal('hide'); // Hide Modal
            };
        }
        else /* ------------------------------ IF JUST ONE NODE IS VSI ------------------------------ */
        {
            $("#vsi-port-settings-1").removeClass("hidden");
            $("#vsi-port-settings-2").addClass("hidden");

            let vsiNode, nonVsiNode;

            if (nodeOne.group == "vsi") {
                vsiNode = nodeOne;
                nonVsiNode = nodeTwo;
            } else {
                vsiNode = nodeTwo;
                nonVsiNode = nodeOne;
            }

            checkIfControllerPortExists(vsiNode);

            document.getElementById('vsi-dsl_id-1').textContent = vsiNode.dsl_id;
            document.getElementById('non-vsi-dsl_id-1').textContent = nonVsiNode.dsl_id;


            /* ------------- Setup VSI port inputs (settings) for the VSI node ------------- */
            let selectVsiPortType = $('#select-vsi-port-type-1');
            let inputVsiPortType = document.getElementById('input-vsi-port-type-1');
            let vsiPortType = selectVsiPortType.val();

            prepareInputVsiPortType(vsiNode, vsiPortType, inputVsiPortType);

            selectVsiPortType.change(() => {
                vsiPortType = selectVsiPortType.val();
                prepareInputVsiPortType(vsiNode, vsiPortType, inputVsiPortType);
            });


            /* ------------- 'Add Link' button click -------------  */
            saveButton.onclick = function() {
                // Update NON-VSI node:
                nonVsiNode.ports_count++;
                let nonVsiPort =  `p${nonVsiNode.ports_count}`;
                nonVsiNode.ports[nonVsiPort] = nonVsiPort;
                data.nodes.update(nonVsiNode);

                // Update VSI node:
                let vsiPortValue = document.getElementById('input-vsi-port-type-1').value;
                let vsiPort = setVsiPort(vsiNode, vsiPortType, vsiPortValue, edgeData);

                // Set Edge (link) properties:
                setEdgeProperties(edgeData, vsiNode, nonVsiNode, vsiPort, nonVsiPort);
                setBandwidth(edgeData);

                callback(edgeData); // Save edge (link) and add it to the graph
                $('#link-popUp').modal('hide'); // Hide Modal
            };
        }
    }

    $('#link-popUp').modal(); // Show Modal
}


/**
 * Delete the selected link.
 *
 * @param deleteData
 * @param callback
 */
export function deleteEdge(deleteData, callback) {

    let connected_nodes = []; // used for updating link names

    deleteData.edges.forEach(function(edgeId) {
        let edge = data.edges.get(edgeId);

        let nodeFrom = data.nodes.get(edge.from);
        deleteNodePort(nodeFrom, edge.from_port);

        let nodeTo = data.nodes.get(edge.to);
        deleteNodePort(nodeTo, edge.to_port);

        connected_nodes.push([nodeFrom, nodeTo]); // update link names

        if (nodeFrom.id == nodeTo.id) // if we are deleting selfie link - update node's selfieRadiuses property
        {
            let index = nodeFrom.selfieRadiuses.indexOf(edge.selfReferenceSize);

            if (index > -1)
            {
                nodeFrom.selfieRadiuses.splice(index, 1);
                data.nodes.update(nodeFrom);
            }
        }

    });

    callback(deleteData);
    
    fixLinksNames(connected_nodes);
}


/**
 * Delete Node Port property (of the "ports" property; e.g. ports: {p1: 'p1'} - see data.js).
 *
 *
 * @param node
 * @param port
 */
export function deleteNodePort(node, port) {
    if (_.has(node.ports, port)) {
        delete node.ports[port];
        data.nodes.update(node);
    }
}


/**
 * Update the names of the links so that their names start from 1...
 * This ensures that link names are unique for any given pair of nodes
 * (for example, after deleting and adding of new links between the same two nodes).
 *
 * @param connected_nodes
 */
function fixLinksNames(connected_nodes) {
    connected_nodes.forEach(function(couple) {
        let connected_edges = data.edges.get({
            filter: function (item) {
                return (_.includes([couple[0].id, couple[1].id], item.from) && _.includes([couple[0].id, couple[1].id], item.to));
            }
        });

        connected_edges.forEach(function(edge, index) {
            edge.name = `${couple[0].dsl_id}${couple[1].dsl_id}${app.link_suffix}${index + 1}`;
            data.edges.update(edge);
        })
    });
}


/**
 * Check if VSI already has the controller port ("pC") and if it has, hide the "mode" option because it can only have one of these.
 *
 * @param vsiNode
 * @param optionId
 */
function checkIfControllerPortExists(vsiNode, optionId = 'mode-1') {
    document.getElementById("select-vsi-port-type-1").selectedIndex = 0;
    document.getElementById("select-vsi-port-type-2").selectedIndex = 0;
    document.getElementById(optionId).disabled = !!vsiNode.ports.hasOwnProperty('pC');
}

/**
 * Prepare VSI port input value (depending on whether 'logicalPort' or 'mode' is selected).
 *
 * @param vsiNode
 * @param vsiPortType
 * @param inputVsiPortType
 */
function prepareInputVsiPortType(vsiNode, vsiPortType, inputVsiPortType) {
    if (vsiPortType == "logicalPort")
    {
        inputVsiPortType.value = vsiNode.ports_count + 1;
    }
    else if (vsiPortType == "mode")
    {
        inputVsiPortType.value = "CONTROL"
    }
}


/**
 * Set VSI port.
 *
 * @param node
 * @param vsiPortType
 * @param vsiPortValue
 * @param edgeData
 * @returns {*}
 */
function setVsiPort(node, vsiPortType, vsiPortValue, edgeData) {
    let vsiPort;

    if (vsiPortType == 'logicalPort')
    {
        node.ports_count++;
        vsiPort = `p${node.ports_count}`;
        node.ports[vsiPort] = {
            logicalPort: vsiPortValue
        };

    }
    else if (vsiPortType == 'mode')
    {
        vsiPort = `pC`;
        node.ports[vsiPort] = {
            mode: `\"${vsiPortValue}\"`
        };

        edgeData.color = {
            color: '#f94d51',
            highlight: '#952e30',
            hover: '#952e30'
        }
    }

    data.nodes.update(node);

    return vsiPort;
}


/**
 * Set the 'name', 'from_port', 'to_port' & properties for the newly added edge (link).
 *
 * Link names are formed in the following order:
 *     - if we are connecting BMS and host or BMS and VSI:
 *        BMS id + other node id + suffix + number;
 *        the "from" port belongs to BMS
 *     - if we are connection host and VSI:
 *       host id + VSI id + suffix + number;
 *       the "from" port belongs to host
 *     - if we are connection the nodes of the same type:
 *       "smaller" id + "bigger" id + suffix + number;
 *       the "from" port belongs to the node with "smaller" id
 * This helps DSL look more consistent and makes it easier to read (especially its adjacency part)
 *
 * @param edgeData
 * @param nodeOne
 * @param nodeTwo
 * @param nodeOnePort
 * @param nodeTwoPort
 * @param selfie
 */
function setEdgeProperties(edgeData, nodeOne, nodeTwo, nodeOnePort, nodeTwoPort, selfie = false) {
    /* ------------------ Set Edge (link) name ------------------ */
    let connected_edges = data.edges.get({ // Edges (links) that are already connecting these two nodes
        filter: function (item) {
            return (_.includes([edgeData.from, edgeData.to], item.from) && _.includes([edgeData.from, edgeData.to], item.to));
        }
    });

    if ((nodeOne.group != nodeTwo.group))
    {
        if (_.includes([nodeOne.group, nodeTwo.group], "bms")) // BMS connected to a non-BMS node
        {
            if (nodeOne.group == "bms")
            {
                edgeData.name = `${nodeOne.dsl_id}${nodeTwo.dsl_id}${app.link_suffix}${connected_edges.length + 1}`;
                edgeData.from_port = nodeOnePort;
                edgeData.to_port = nodeTwoPort;
            }
            else
            {
                edgeData.name = `${nodeTwo.dsl_id}${nodeOne.dsl_id}${app.link_suffix}${connected_edges.length + 1}`;

                edgeData.from_port = nodeTwoPort;
                edgeData.to_port = nodeOnePort;

                // Makes the adjacency part of the DSL easier to read.
                edgeData.from = nodeTwo.id;
                edgeData.to = nodeOne.id;
            }
        }
        else // Host connected to a VSI
        {
            if (nodeOne.group == "host")
            {
                edgeData.name = `${nodeOne.dsl_id}${nodeTwo.dsl_id}${app.link_suffix}${connected_edges.length + 1}`;

                edgeData.from_port = nodeOnePort;
                edgeData.to_port = nodeTwoPort;
            }
            else
            {
                edgeData.name = `${nodeTwo.dsl_id}${nodeOne.dsl_id}${app.link_suffix}${connected_edges.length + 1}`;

                edgeData.from_port = nodeTwoPort;
                edgeData.to_port = nodeOnePort;

                edgeData.from = nodeTwo.id;
                edgeData.to = nodeOne.id;
            }
        }
    }
    else
    {
        if (nodeOne.dsl_id.localeCompare(nodeTwo.dsl_id) == 1)
        {
            edgeData.name = `${nodeTwo.dsl_id}${nodeOne.dsl_id}${app.link_suffix}${connected_edges.length + 1}`;

            edgeData.from_port = nodeTwoPort;
            edgeData.to_port = nodeOnePort;

            edgeData.from = nodeTwo.id;
            edgeData.to = nodeOne.id;
        }
        else
        {
            edgeData.name = `${nodeOne.dsl_id}${nodeTwo.dsl_id}${app.link_suffix}${connected_edges.length + 1}`;

            edgeData.from_port = nodeOnePort;
            edgeData.to_port = nodeTwoPort;
        }

        edgeData.selfie = selfie;

        if (selfie) {
            let radius = 20;
            let radiusMultiplier = 1;

            while (nodeTwo.selfieRadiuses.includes(radius * radiusMultiplier)) {
                radiusMultiplier++;
            }

            edgeData.selfReferenceSize = radius * radiusMultiplier;

            nodeTwo.selfieRadiuses.push(radius * radiusMultiplier);
            data.nodes.update(nodeTwo);
        }
    }
}


/**
 * Set the bandwidth property and label.
 *
 * @param edgeData
 */
function setBandwidth(edgeData) {
    let bandwidth = parseInt(document.getElementById('bandwidth').value.trim());

    if (isNaN(bandwidth)) {
        bandwidth = null;
        edgeData.label = undefined;
    } else {
        edgeData.bandwidth = bandwidth;
        edgeData.label = `${bandwidth} ${app.bandwidths.unit}`;
        edgeData.font = {
            align: 'top'
        };

        app.bandwidths.ranges.push(Infinity);
        for (let i = 0; i < app.bandwidths.ranges.length; i++) {
            if (bandwidth < app.bandwidths.ranges[i]) {
                edgeData.width = i + 2;
                break;
            }
        }
        app.bandwidths.ranges.pop();
    }
}