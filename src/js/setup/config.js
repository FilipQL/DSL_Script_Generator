let _ = require('lodash');
import {isValidId, isValidIPv4Address, isValidIPv4Mask, isValidPortNumber} from '../utilities/validation'

/* ---------------------------------- Load sample data ---------------------------------- */

let loadSampleData = config.loadSampleData;


/* ---------------------------------- Hide/show "Import/Export Project" ---------------------------------- */

if (config.import_export) {
    $('#ie-tab').removeClass('hidden');
} else {
    $('#ie-tab').addClass('hidden');
}



/* ---------------------------------- Load Locations ---------------------------------- */

// Host Locations
let selectHostLocation = document.getElementById("host-location");

if (_.isArray(config.locations.host)) {
    config.locations.host.forEach(function(value) {
        selectHostLocation.options[selectHostLocation.options.length] = new Option(value, value); // Option(option TEXT, val="")
    })
} else if (_.isObject(config.locations.host)) {
    _.forEach(config.locations.host, function(value, key) {
        selectHostLocation.options[selectHostLocation.options.length] = new Option(value, key);
    })
}

// VSI Locations
let selectVsiLocation = document.getElementById("vsi-location");

if (_.isArray(config.locations.vsi)) {
    config.locations.vsi.forEach(function(value) {
        selectVsiLocation.options[selectVsiLocation.options.length] = new Option(value, value); // Option(option TEXT, val="")
    })
} else if (_.isObject(config.locations.vsi)) {
    _.forEach(config.locations.vsi, function(value, key) {
        selectVsiLocation.options[selectVsiLocation.options.length] = new Option(value, key);
    })
}

// BMS Locations
let selectBmsLocation = document.getElementById("bms-location");

if (_.isArray(config.locations.bms)) {
    config.locations.bms.forEach(function(value) {
        selectBmsLocation.options[selectBmsLocation.options.length] = new Option(value, value); // Option(TEXT, val="")
    })
} else if (_.isObject(config.locations.bms)) {
    _.forEach(config.locations.bms, function(value, key) {
        selectBmsLocation.options[selectBmsLocation.options.length] = new Option(value, key);
    })
}



/* ---------------------------------- Load VSI Switch Modes ---------------------------------- */

let selectSwitchMode = document.getElementById("vsi-switchMode");

if (_.isArray(config.switch_mode)) {
    config.switch_mode.forEach(function(value) {
        selectSwitchMode.options[selectSwitchMode.options.length] = new Option(value, value);
    })
} else if (_.isObject(config.switch_mode)) {
    _.forEach(config.switch_mode, function(value, key) {
        selectSwitchMode.options[selectSwitchMode.options.length] = new Option(value, key);
    })
}



/* ---------------------------------- Load Images ---------------------------------- */

// Host Images
let selectHostImage = document.getElementById("host-image");

if (_.isArray(config.images.host)) {
    config.images.host.forEach(function(value) {
        selectHostImage.options[selectHostImage.options.length] = new Option(value, value); // Option(option TEXT, val="")
    })
} else if (_.isObject(config.images.host)) {
    _.forEach(config.images.host, function(value, key) {
        selectHostImage.options[selectHostImage.options.length] = new Option(value, key);
    })
}

// BMS Images
let selectBmsImage = document.getElementById("bms-image");

if (_.isArray(config.images.bms)) {
    config.images.bms.forEach(function(value) {
        selectBmsImage.options[selectBmsImage.options.length] = new Option(value, value); // Option(TEXT, val="")
    })
} else if (_.isObject(config.images.bms)) {
    _.forEach(config.images.bms, function(value, key) {
        selectBmsImage.options[selectBmsImage.options.length] = new Option(value, key);
    })
}



/* ---------------------------------- Load Flavors ---------------------------------- */

// Host Flavors
let selectHostFlavor = document.getElementById("host-flavor");

if (_.isArray(config.flavors.host)) {
    config.flavors.host.forEach(function(value) {
        selectHostFlavor.options[selectHostFlavor.options.length] = new Option(value, value); // Option(option TEXT, val="")
    })
} else if (_.isObject(config.flavors.host)) {
    _.forEach(config.flavors.host, function(value, key) {
        selectHostFlavor.options[selectHostFlavor.options.length] = new Option(value, key);
    })
}

// BMS Flavors - FEATURE REQUEST
//let selectBmsFlavor = document.getElementById("bms-flavor");
//
//if (_.isArray(config.flavors.bms)) {
//    config.flavors.bms.forEach(function(value) {
//        selectBmsFlavor.options[selectBmsFlavor.options.length] = new Option(value, value); // Option(TEXT, val="")
//    })
//} else if (_.isObject(config.flavors.bms)) {
//    _.forEach(config.flavors.bms, function(value, key) {
//        selectBmsFlavor.options[selectBmsFlavor.options.length] = new Option(value, key);
//    })
//}



/* ---------------------------------- Suggested Values ---------------------------------- */

let suggestions = config.suggestions;


// Initialize "Configure Suggestions" modal inputs.
$('#settings-popUp').on('show.bs.modal', function (e) {
    $('#error_alert2').addClass('hidden');

    document.getElementById('host_id_prefix').value = suggestions.host_id_prefix;

    document.getElementById('vsi_id_prefix').value = suggestions.vsi_id_prefix;
    document.getElementById('suggested_switchIPv4Addr').value = suggestions.suggested_switchIPv4Addr;
    document.getElementById('suggested_switchIPv4Mask').value = suggestions.suggested_switchIPv4Mask;
    document.getElementById('suggested_controllerIPv4').value = suggestions.suggested_controllerIPv4;
    document.getElementById('suggested_controllerPort').value = suggestions.suggested_controllerPort;

    document.getElementById('bms_id_prefix').value = suggestions.bms_id_prefix;
});


// Update the values of the suggestions.
$('#settings-popUp').on('hide.bs.modal', function (e) {

    let errors = [];

    let host_id_prefix = document.getElementById('host_id_prefix').value.trim();
    isValidId(false, host_id_prefix, errors);

    let vsi_id_prefix = document.getElementById('vsi_id_prefix').value.trim();
    isValidId(false, vsi_id_prefix, errors);

    let suggested_switchIPv4Addr = document.getElementById('suggested_switchIPv4Addr').value.trim();
    if (!isValidIPv4Address(suggested_switchIPv4Addr))
    {
        errors.push(`Invalid <strong>Switch IPv4 Address</strong>.`);
    }

    let suggested_switchIPv4Mask = document.getElementById('suggested_switchIPv4Mask').value.trim();
    if (!isValidIPv4Mask(suggested_switchIPv4Mask))
    {
        errors.push(`Invalid <strong>Switch IPv4 Mask</strong>.`);
    }

    let suggested_controllerIPv4 = document.getElementById('suggested_controllerIPv4').value.trim();
    if (!isValidIPv4Address(suggested_controllerIPv4))
    {
        errors.push(`Invalid <strong>Controller IPv4</strong> address.`);
    }

    let suggested_controllerPort = document.getElementById('suggested_controllerPort').value.trim();
    if (!isValidPortNumber(suggested_controllerPort))
    {
        errors.push(`Invalid <strong>Controller port</strong> number.`);
    }

    let bms_id_prefix = document.getElementById('bms_id_prefix').value.trim();
    isValidId(false, bms_id_prefix, errors);


    if (errors.length > 0)
    {
        let error_message = `<ul style="padding-left: 20px;">`;
        errors.forEach(function(error) {
            error_message += `<li>${error}</li>`;
        });
        error_message += '</ul>';

        $('#errors_box2').html(error_message);
        $('#error_alert2').removeClass('hidden');

        return false;
    }


    suggestions.host_id_prefix = host_id_prefix;

    suggestions.vsi_id_prefix = vsi_id_prefix;
    suggestions.suggested_switchIPv4Addr = suggested_switchIPv4Addr;
    suggestions.suggested_switchIPv4Mask = suggested_switchIPv4Mask;
    suggestions.suggested_controllerIPv4 = suggested_controllerIPv4;
    suggestions.suggested_controllerPort = suggested_controllerPort;

    suggestions.bms_id_prefix = bms_id_prefix;
});



/* ---------------------------------- Link Suffix ---------------------------------- */

let link_suffix = config.link_suffix;



/* ---------------------------------- Bandwidths Setup ---------------------------------- */

let bandwidths = config.bandwidths;

document.getElementById('bandwidth').value = bandwidths.default;
document.getElementById('bandwidth').setAttribute("step", bandwidths.step);
document.getElementById('bandwidth').setAttribute("title", bandwidths.tooltip);
document.getElementById('bandwidth-unit').textContent = bandwidths.unit;


/* ---------------------------------- Popover ---------------------------------- */

document.getElementById('lab-popover-checkbox').checked = config.popover;



let app = {
    loadSampleData,
    suggestions,
    link_suffix,
    bandwidths
};

export default app;