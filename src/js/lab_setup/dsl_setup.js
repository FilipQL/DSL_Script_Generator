import data from './../lab_setup/data'
import DSL from './../utilities/DSL'



/* ------------------ Validate ID of DSL Script ------------------ */

$('a[href="#dsl"], #ie-tab').on('show.bs.tab', function (e) {

    let id = document.getElementById('dsl_id').value.trim();

    //let existing_ids = [];
    //
    //data.nodes.get().forEach(function(dsl_node) {
    //    existing_ids.push(dsl_node.dsl_id)
    //});
    //
    //data.edges.get().forEach(function(dsl_edge) {
    //    existing_ids.push(dsl_edge.name)
    //});

    if (!(new RegExp("^([a-zA-Z$][a-zA-Z0-9]*)$")).test(id)) {
        alert('Illegal format for the value in the ID field.\nThe ID should start with a letter followed\nby an optional number of letters and digits.');
        return false;
    }
});



/* ------------------ Generate and show DSL ------------------ */

$('a[href="#dsl"]').on('shown.bs.tab', function (e) {
    let dsl = new DSL(data);

    let id = document.getElementById('dsl_id').value.trim();
    let description = document.getElementById('dsl_description').value.trim();

    let hosts_script = dsl.generateHostsScript();
    let vsi_script = dsl.generateVSIScript();
    let bms_script = dsl.generateBMSScript();
    let links_script = dsl.generateLinksScript();
    let adjacency_script = dsl.generateAdjacencyScript();

    document.getElementById('dsl-script').innerHTML =`${id} {

    description = "${description}"
    id = "${id}"${hosts_script}${vsi_script}${bms_script}${links_script}${adjacency_script}

}`;
});



// Set the height of the <pre> <code>DSL</code> </pre>:
$("pre").css({
    height: Math.round($(window).height() * config.dsl_height) + 'px'
});