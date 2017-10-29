import data from './../lab_setup/data'
import network from './../lab_setup/vis_setup'
import app from './../lab_setup/config'
import { saveAs } from 'file-saver';


/**
 * Export project to a JSON file.
 */
export function exportToJSON() {
    let project = {};

    network.storePositions();

    project['dsl_id'] = document.getElementById('dsl_id').value.trim();
    project['dsl_description'] = document.getElementById('dsl_description').value.trim();

    project['nodes'] = data.nodes.get();
    project['edges'] = data.edges.get();

    let today = currentDate();

    saveAs(new Blob([JSON.stringify(project)], {type: "text/plain;charset=utf-8"}), `DSL_Generator ${today}.json`);
}


/**
 * Get the current date.
 *
 * @returns {Date}
 */
function currentDate() {
    let today = new Date();

    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();

    if (dd < 10) {
        dd='0' + dd
    }

    if(mm < 10) {
        mm='0' + mm
    }

    today = dd + '-' + mm + '-' + yyyy;

    return today;
}


document.getElementById('export').onclick = function() {
    exportToJSON();
};


/**
 * Import JSON project.
 */
export function importJSON(e) {
    let json_obj = null;
    let reader = new FileReader();

    if (e.target && e.target.files[0]) {
        reader.onload = (evt) => {
            try {
                json_obj = JSON.parse(evt.target.result);
                loadProject(json_obj);
            } catch (ex) {
                alert('Error: ' + ex);
            }
        };

        reader.readAsText(e.target.files[0]);
    }
}

document.getElementById('project-file').onchange = importJSON;


/**
 * Load (setup) imported JSON project.
 *
 * @param json_obj
 */
function loadProject(json_obj) {
    document.getElementById('dsl_id').value = json_obj.dsl_id;
    document.getElementById('dsl_description').value = json_obj.dsl_description;

    data.nodes.clear();
    data.edges.clear();

    data.nodes.add(json_obj.nodes);
    data.edges.add(json_obj.edges);
}