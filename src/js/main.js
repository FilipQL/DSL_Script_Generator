require('./setup/vis_setup');
require('./setup/dsl_setup');
import Clipboard from 'clipboard';
import { saveAs } from 'file-saver';
require('./utilities/ei');

new Clipboard('.clipboard-btn');

document.getElementById('download-dsl').onclick = function() {
    saveAs(new Blob(
        [document.getElementById('dsl-script').innerHTML],
        {type: "text/html;charset=utf-8"}),
        "dsl.txt"
    );
};