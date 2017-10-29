import data from '../lab_setup/data'

/**
 * Check if the entered DSL ID is unique.
 *
 * @param adding
 * @param dsl_id
 * @param errors
 */
export function isValidId(adding, dsl_id, errors)
{
    if (adding) {
        let existing_ids = [];

        data.nodes.get().forEach(function(dsl_node) {
            existing_ids.push(dsl_node.dsl_id.toLowerCase())
        });

        data.edges.get().forEach(function(dsl_edge) {
            existing_ids.push(dsl_edge.name.toLowerCase())
        });

        if (existing_ids.includes(dsl_id.toLowerCase())) {
            errors.push(`Entered <strong>ID</strong> has already been taken.`);
        }
    }

    if (!(new RegExp("^([a-zA-Z$][a-zA-Z0-9]*)$")).test(dsl_id))
    {
        errors.push(`Illegal format for the value in the <strong>ID</strong> field.`);
    }
}



/**
 * Validate IPv4 address.
 *
 * @param value
 * @returns {boolean}
 */
export function isValidIPv4Address(value)
{
    // Decimal byte pattern - dbp
    var dbp = "(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])";
    var finalRegex = "^" + dbp + "\\." + dbp + "\\." + dbp + "\\." + dbp + "$";

    return (new RegExp(finalRegex)).test(value);
}


/**
 * Validate IPv4 Subnet Mask.
 *
 * @param value
 * @returns {boolean}
 */
export function isValidIPv4Mask(value)
{
    var validMasks = [
        "128.0.0.0",
        "192.0.0.0",
        "224.0.0.0",
        "240.0.0.0",
        "248.0.0.0",
        "252.0.0.0",
        "254.0.0.0",
        "255.0.0.0",
        "255.128.0.0",
        "255.192.0.0",
        "255.224.0.0",
        "255.240.0.0",
        "255.248.0.0",
        "255.252.0.0",
        "255.254.0.0",
        "255.255.0.0",
        "255.255.128.0",
        "255.255.192.0",
        "255.255.224.0",
        "255.255.240.0",
        "255.255.248.0",
        "255.255.252.0",
        "255.255.254.0",
        "255.255.255.0",
        "255.255.255.128",
        "255.255.255.192",
        "255.255.255.224",
        "255.255.255.240",
        "255.255.255.248",
        "255.255.255.252"
    ];

    return (validMasks.indexOf(value) > -1);
}


/**
 * Validate Port number.
 *
 * @param value
 * @returns {boolean}
 */
export function isValidPortNumber(value)
{
    return (!isNaN(value) && value >= 0 && value <= 65535);
}