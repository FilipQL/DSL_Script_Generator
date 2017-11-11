class DSL {
    /**
     * Create a new DSL instance.
     *
     * @param {object} data
     */
    constructor(data) {
        this.nodes = data.nodes;
        this.edges = data.edges;
    }



    /* ------------------ HOSTS ------------------ */

    /**
     * Fetch all host nodes.
     *
     * @returns {*}
     */
    getHostNodes() {
        return this.nodes.get({
            filter: item => item.group == 'host'
        });
    }


    /**
     * Generate the script for the host ports.
     *
     * @param host
     * @returns {*}
     */
    generateHostPortsScript(host) {
        let ports_script = ``;

        _.forEach(host.ports, function(value, key) {
            ports_script += `
        port { id = "${key}" }`
        });

        return ports_script;
    }


    /**
     * Generate the Hosts Script.
     *
     * @returns {string}
     */
    generateHostsScript() {
        let hosts = this.getHostNodes();
        let hosts_script = `\n`;

        hosts.forEach(host => {
            let ports_script = this.generateHostPortsScript(host);
            hosts_script +=
                `
    host {
        id = "${host.dsl_id}"
        location = "${host.location}"
        imageId = "${host.image}"
        flavorId = "${host.flavor}"${ports_script}
    }\n\t`
        });

        if (!hosts_script.trim()) {
            return '';
        }

        return hosts_script.substring(0, hosts_script.length - 2); // remove last \n\n\t
    }

    /* ------------------ /HOSTS ------------------ */



    /* ------------------ VSIs ------------------ */

    /**
     * Fetch all VSI nodes.
     *
     * @returns {*}
     */
    getVsiNodes() {
        return this.nodes.get({
            filter: item => item.group == 'vsi'
        });
    }


    /**
     * Generate the script for the VSI ports.
     *
     * @param vsi
     * @returns {*}
     */
    generateVSIPortsScript(vsi) {
        let logicalPart = ``;
        let modePart = ``;

        _.forEach(vsi.ports, function(value, key) {
            if (Object.keys(value)[0] == "logicalPort") {
                logicalPart +=
                    `
        port {
            id = "${key}"
            ${Object.keys(value)[0]} = ${value[Object.keys(value)[0]]}
        }`
            } else {
                modePart +=
                    `
        port {
            id = "${key}"
            ${Object.keys(value)[0]} = ${value[Object.keys(value)[0]]}
        }`
            }
        });

        return logicalPart + modePart;
    }


    /**
     * Generate the VSIs Script.
     *
     * @returns {string}
     */
    generateVSIScript() {
        let vsi_nodes = this.getVsiNodes();
        let vsi_script = `\n`;

        vsi_nodes.forEach(vsi => {
            let ports_script = this.generateVSIPortsScript(vsi);
            vsi_script +=
                `
    vsi {
        id = "${vsi.dsl_id}"
        location = "${vsi.location}"
        switchIPv4Addr = "${vsi.switchIPv4Addr}"
        switchIPv4Mask = "${vsi.switchIPv4Mask}"
        switchMode = "${vsi.switchMode}"

        controller {
            ipv4 = "${vsi.controller.ipv4}"
            port = "${vsi.controller.port}"
        }${ports_script}
    }\n\t`
        });

        if (!vsi_script.trim()) {
            return '';
        }

        return vsi_script.substring(0, vsi_script.length - 2); // remove last \n\t
    }

    /* ------------------ /VSIs  ------------------ */



    /* ------------------ Bare Metal Servers ------------------ */

    /**
     * Fetch all BMS nodes.
     *
     * @returns {*}
     */
    getBMSNodes() {
        return this.nodes.get({
            filter: item => item.group == 'bms'
        });
    }


    /**
     * Generate the script for the BMS ports.
     *
     * @param bms
     * @returns {*}
     */
    generateBMSPortsScript(bms) {
        let ports_script = ``;

        _.forEach(bms.ports, function(value, key) {
            ports_script += `
        port { id = "${key}" }`
        });

        return ports_script;
    }


    /**
     * Generate the Bare Metal Servers script.
     *
     * @returns {string}
     */
    generateBMSScript() {
        let bms_nodes = this.getBMSNodes();
        let bms_script = `\n`;

        bms_nodes.forEach(bms => {
            let ports_script = this.generateBMSPortsScript(bms);
            bms_script +=
                `
    baremetalserver {
        id = "${bms.dsl_id}"
        location = "${bms.location}"
        image = "${bms.image}"${ports_script}
    }\n\t`
        });

        if (!bms_script.trim()) {
            return '';
        }

        return bms_script.substring(0, bms_script.length - 2); // remove last \n\n\t
    }

    /* ------------------ /Bare Metal Servers ------------------ */



    /* ------------------ LINKS  ------------------ */

    /**
     * Generate the Links Script.
     *
     * @returns {string}
     */
    generateLinksScript() {
        let links_script = `\n`;
        this.edges.forEach(function(link) {
            links_script +=
                `
    link {
        id = "${link.name}"
        port { id = "src" }
        port { id = "dst" }${link.bandwidth ? `\n\t\tbandwidth = ${link.bandwidth}` : ``}
    }\n\t`
        });

        if (!links_script.trim()) {
            return '';
        }

        return links_script.substring(0, links_script.length - 2); // remove last \n\n\t
    }

    /* ------------------ /LINKS ------------------ */



    /* ------------------ ADJACENCY ------------------ */

    /**
     * Generate the Adjacency Script.
     *
     * @returns {string}
     */
    generateAdjacencyScript() {
        let adjacency_script = `\n`;

        this.edges.forEach(link => {
            adjacency_script += `
    adjacency ${this.nodes.get(link.from).dsl_id}.${link.from_port}, ${link.name}.src
    adjacency ${this.nodes.get(link.to).dsl_id}.${link.to_port}, ${link.name}.dst \n\t`
        });

        if (!adjacency_script.trim()) {
            return '';
        }

        return adjacency_script.substring(0, adjacency_script.length - 2); // remove last \n\n\t
    }

    /* ------------------ /ADJACENCY ------------------ */



    /**
     * Generate DSL for the node.
     * This method is used for generating the value of the node title (tooltip, popup)
     *
     * @param node
     * @returns {*}
     */
    static generateTooltipNodeScript(node) {
        let ports_script = DSL.generateTooltipNodePortsScript(node);

        if (node.group == 'host') {
            return `<pre class="tooltip-pre"><code>host {
    id = "${node.dsl_id}"
    location = "${node.location}"
    imageId = "${node.image}"
    flavorId = "${node.flavor}${ports_script}
}</code></pre>`
        }

        if (node.group == 'vsi') {
            return `<pre class="tooltip-pre"><code>vsi {
    id = "${node.dsl_id}"
    location = "${node.location}"
    switchIPv4Addr = "${node.switchIPv4Addr}"
    switchIPv4Mask = "${node.switchIPv4Mask}"
    switchMode = "${node.switchMode}"

    controller {
        ipv4 = "${node.controller.ipv4}"
        port = "${node.controller.port}"
    }${ports_script}
}</code></pre>`;
        }

        if (node.group == 'bms') {
            return `<pre class="tooltip-pre"><code>baremetalserver {
    id = "${node.dsl_id}"
    location = "${node.location}"
    image = "${node.image}"${ports_script}
}</code></pre>`
        }
    }


    /**
     * Generate DSL - the ports part for a node.
     *
     * @param node
     * @returns {*}
     */
    static generateTooltipNodePortsScript(node) {
        let ports_script = ``;

        if (node.group == 'host' || node.group == 'bms') {
            _.forEach(node.ports, function(value, key) {
                ports_script += `\n\tport { id = "${key}" }`
            });
        }

        if (node.group == 'vsi') {
            let logicalPart = ``;
            let modePart = ``;

            _.forEach(node.ports, function(value, key) {
                if (Object.keys(value)[0] == "logicalPort") {
                    logicalPart +=
                        `
    port {
        id = "${key}"
        ${Object.keys(value)[0]} = ${value[Object.keys(value)[0]]}
    }`
                } else {
                    modePart +=
                        `
    port {
        id = "${key}"
        ${Object.keys(value)[0]} = ${value[Object.keys(value)[0]]}
    }`
                }
            });

            ports_script = logicalPart + modePart;
        }

        return ports_script;
    }



    /**
     * Generate DSL for the edge.
     * This method is used for generating the value of the edge title (tooltip, popup)
     *
     * @param edge
     * @returns {*}
     */
    static generateTooltipEdgeScript(edge, nodes) {
        return `<pre class="tooltip-pre"><code>link {
    id = "${edge.name}"
    port { id = "src" }
    port { id = "dst" }${edge.bandwidth ? `\n\tbandwidth = ${edge.bandwidth}` : ``}
}
adjacency ${nodes.get(edge.from).dsl_id}.${edge.from_port}, ${edge.name}.src
adjacency ${nodes.get(edge.to).dsl_id}.${edge.to_port}, ${edge.name}.dst</code></pre>`;
    }
}

export default DSL;