import app from './../config'
import data from './../data'
import {deleteNodePort} from './edge'
import {isValidId, isValidIPv4Address, isValidIPv4Mask, isValidPortNumber} from '../../utilities/validation'


/**
 * Add a new node (host, vsi or bms) to the Vis Network.
 *
 * @param nodeData
 * @param callback
 */
export function addNode(nodeData, callback) {
    initInputValues(); // Initialize "Add Node" modal inputs.

    let selected = $('#node-type').val(); // Selected node type
    toggleModalInputs(selected);

    $('#node-type').change(function() { // Show/hide input fields based on the selected node type
        selected = $('#node-type').val();
        toggleModalInputs(selected);
    });

    document.getElementById('saveButton').onclick = function() { // Save Button Click
        if (assignValues(nodeData, selected)) {
            callback(nodeData);
            $('#node-popUp').modal('hide');
        }

    };

    $('#node-popUp').modal(); // Show modal
}


/**
 * Edit (change) node properties.
 *
 * @param nodeData
 * @param callback
 */
export function editNode(nodeData, callback) {
    toggleModalInputs(nodeData.group); // Show/hide input fields based on the selected node type

    initInputValues(nodeData); // Initialize "Edit Node" modal inputs.

    document.getElementById('saveButton').onclick = function() { // Save Button Click
        if (assignValues(nodeData, nodeData.group, false)) {
            callback(nodeData);
            $('#node-popUp').modal('hide');
        }
    };

    $('#node-popUp').on('hide.bs.modal', function (e) { // If a user cancels editing
        callback(null);
    });

    $('#node-popUp').modal();
}


/**
 * Delete the selected node.
 *
 * @param deleteData
 * @param callback
 */
export function deleteNode(deleteData, callback) {
    // Delete Node Port property (of the "ports" property; e.g. ports: {p1: 'p1'} - see data.js).
    /*
      Check the edge.js first in order for this to make any sense.
      Two things we should keep in mind here:
       1) removing a node also removes its edges
       2) Vis doesn't trigger deleteEdge() for the edges in 1)
      This is used before the callback, which means we are applying it on both nodes even though only the one
      which is not deleted is actually going to be affected by it...
    */
    deleteData.edges.forEach(function(edgeId) {
        let edge = data.edges.get(edgeId);

        let nodeFrom = data.nodes.get(edge.from);
        deleteNodePort(nodeFrom, edge.from_port);

        let nodeTo = data.nodes.get(edge.to);
        deleteNodePort(nodeTo, edge.to_port);

    });

    callback(deleteData);
}


/**
 * Initialize "Add Node" or "Edit Node" modal inputs.
 */
function initInputValues(nodeData = null) {
    if (nodeData) {
        // Set the modal title and set the text on a button
        document.getElementById('operation').innerHTML = "Edit Node";
        document.getElementById('saveButton-text').innerHTML = " Save Changes";
        document.getElementById("node-type").value = nodeData.group;
        document.getElementById("node-type").disabled = true;

        if (nodeData.group == "host") {
            document.getElementById('host-id').value = nodeData.dsl_id;
            document.getElementById('host-id').readOnly = true;
            document.getElementById("host-location").value = nodeData.location;
            document.getElementById("host-image").value = nodeData.image;
            document.getElementById("host-flavor").value = nodeData.flavor;
        }

        if (nodeData.group == "vsi") {
            document.getElementById('vsi-id').value = nodeData.dsl_id;
            document.getElementById('vsi-id').readOnly = true;
            document.getElementById("vsi-location").value = nodeData.location;
            document.getElementById("vsi-switchIPv4Addr").value = nodeData.switchIPv4Addr;
            document.getElementById("vsi-switchIPv4Mask").value = nodeData.switchIPv4Mask;
            document.getElementById("vsi-switchMode").value = nodeData.switchMode;
            document.getElementById("vsi-controller-ipv4").value = nodeData.controller.ipv4;
            document.getElementById("vsi-controller-port").value = nodeData.controller.port;
        }

        if (nodeData.group == "bms") {
            document.getElementById('bms-id').value = nodeData.dsl_id;
            document.getElementById('bms-id').readOnly = true;
            document.getElementById("bms-location").value = nodeData.location;
            document.getElementById("bms-image").value = nodeData.image;
        }
    } else {
        // Set the modal title and set the text on a button
        document.getElementById('operation').innerHTML = "Add Node";
        document.getElementById('saveButton-text').innerHTML = " Add Node";
        document.getElementById("node-type").disabled = false;
        document.getElementById('host-id').readOnly = false;
        document.getElementById('vsi-id').readOnly = false;
        document.getElementById('bms-id').readOnly = false;

        // This will be used to prevent suggesting id that is already taken:
        let dsl_ids = [];
        data.nodes.get().forEach(function(dsl_node) {
            dsl_ids.push(dsl_node.dsl_id)
        });

        // Set host inputs
        //let host_count = data.nodes.get({
        //    filter: item => item.group == 'host'
        //}).length;
        let host_count = 0;

        // Prevent suggesting an id that is already in use:
        while (dsl_ids.includes(`${app.suggestions.host_id_prefix}${host_count + 1}`)) {
            host_count++;
        }

        document.getElementById('host-id').value = `${app.suggestions.host_id_prefix}${host_count + 1}`;

        // Set vsi Inputs
        //let vsi_count = data.nodes.get({
        //    filter: item => item.group == 'vsi'
        //}).length;
        let vsi_count = 0;

        // Prevent suggesting an id that is already in use:
        while (dsl_ids.includes(`${app.suggestions.vsi_id_prefix}${vsi_count + 1}`)) {
            vsi_count++;
        }

        document.getElementById('vsi-id').value = `${app.suggestions.vsi_id_prefix}${vsi_count + 1}`;
        document.getElementById('vsi-switchIPv4Addr').value = app.suggestions.suggested_switchIPv4Addr;
        document.getElementById('vsi-switchIPv4Mask').value = app.suggestions.suggested_switchIPv4Mask;
        document.getElementById('vsi-controller-ipv4').value = app.suggestions.suggested_controllerIPv4;
        document.getElementById('vsi-controller-port').value = app.suggestions.suggested_controllerPort;

        // Set bms inputs
        //let bms_count = data.nodes.get({
        //    filter: item => item.group == 'bms'
        //}).length;
        let bms_count = 0;

        // Prevent suggesting an id that is already in use:
        while (dsl_ids.includes(`${app.suggestions.bms_id_prefix}${bms_count + 1}`)) {
            bms_count++;
        }

        document.getElementById('bms-id').value = `${app.suggestions.bms_id_prefix}${bms_count + 1}`;
    }
}


/**
 * Show/hide modal inputs based on the selected type of node (host, vsi, bms).
 *
 * @param selected
 */
function toggleModalInputs(selected)
{
    $("#error_alert").addClass("hidden");

    if (selected == "host")
    {
        $("#host-inputs").last().removeClass("hidden");
        $("#vsi-inputs").last().addClass("hidden");
        $("#bms-inputs").last().addClass("hidden");
    }
    else if (selected == "vsi")
    {
        $("#vsi-inputs").last().removeClass("hidden");
        $("#host-inputs").last().addClass("hidden");
        $("#bms-inputs").last().addClass("hidden");
    }
    else if (selected == "bms")
    {
        $("#bms-inputs").last().removeClass("hidden");
        $("#vsi-inputs").last().addClass("hidden");
        $("#host-inputs").last().addClass("hidden");
    }
}


/**
 * Assign new properties to the nodeData object (to the newly added node or to the node that is being edited)
 * with the values entered in the popup form.
 *
 * @param nodeData
 * @param selected
 * @param adding
 */
function assignValues(nodeData, selected, adding = true)
{
    let errors = [];

    if (selected == "host")
    {
        nodeData.group = 'host';

        let host_id = document.getElementById('host-id').value.trim();

        isValidId(adding, host_id, errors);

        nodeData.dsl_id = host_id;
        nodeData.label = nodeData.dsl_id;
        nodeData.location = $('#host-location').val();
        nodeData.image = $('#host-image').val();
        nodeData.flavor = $('#host-flavor').val();
    }

    if (selected == "vsi")
    {
        nodeData.group = 'vsi';

        let vsi_id = document.getElementById('vsi-id').value.trim();

        isValidId(adding, vsi_id, errors);

        nodeData.dsl_id = vsi_id;
        nodeData.label = nodeData.dsl_id;
        nodeData.location = $('#vsi-location').val();

        let switchIPv4Addr = document.getElementById('vsi-switchIPv4Addr').value.trim();
        if (!isValidIPv4Address(switchIPv4Addr))
        {
            errors.push(`Invalid <strong>Switch IPv4 Address</strong>.`);
        }
        nodeData.switchIPv4Addr = switchIPv4Addr;


        let switchIPv4Mask = document.getElementById('vsi-switchIPv4Mask').value.trim();
        if (!isValidIPv4Mask(switchIPv4Mask))
        {
            errors.push(`Invalid <strong>Switch IPv4 Mask</strong>.`);
        }
        nodeData.switchIPv4Mask = switchIPv4Mask;

        nodeData.switchMode = $('#vsi-switchMode').val();

        let controllerIPv4 = document.getElementById('vsi-controller-ipv4').value.trim();
        if (!isValidIPv4Address(controllerIPv4))
        {
            errors.push(`Invalid <strong>Controller IPv4</strong> address.`);
        }

        let controllerPort = parseInt(document.getElementById('vsi-controller-port').value.trim());
        if (!isValidPortNumber(controllerPort))
        {
            errors.push(`Invalid <strong>Controller port</strong> number.`);
        }

        nodeData.controller = {
            ipv4: controllerIPv4,
            port: controllerPort
        };
    }

    if (selected == "bms")
    {
        nodeData.group = 'bms';

        let bms_id = document.getElementById('bms-id').value.trim();

        isValidId(adding, bms_id, errors);

        nodeData.dsl_id = bms_id;
        nodeData.location = $('#bms-location').val();
        nodeData.label = `${nodeData.dsl_id}`;

        nodeData.image = $('#bms-image').val();

    }

    if (adding) // if it's adding a new node (instead of editing the exiting one)
    {
        nodeData.ports = {};
        nodeData.ports_count = 0;
        nodeData.selfieRadiuses = [];
    }

    if (errors.length > 0)
    {
        let error_message = `<ul style="padding-left: 20px;">`;
        errors.forEach(function(error) {
            error_message += `<li>${error}</li>`;
        });
        error_message += '</ul>';
        //alert(error_message);

        $('#errors_box').html(error_message);
        $('#error_alert').removeClass('hidden');

        return false;
    }

    return true;
}


