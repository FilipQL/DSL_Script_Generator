var config = {
    loadSampleData: true,

    import_export: true,

    locations: {
        host: {
            "ams": "Amsterdam (ams)",
            "bra": "Bratislava (bra)",
            "ham": "Hamburg (ham)",
            "lon": "London (lon)",
            "mad": "Madrid (mad)",
            "mil": "Milan (mil)",
            "par": "Paris (par)" //,
            //"prg": "Prague (prg)"
        },

        vsi: {
            "ams": "Amsterdam (ams)",
            "bra": "Bratislava (bra)",
            "ham": "Hamburg (ham)",
            "lon": "London (lon)",
            "mad": "Madrid (mad)",
            "mil": "Milan (mil)",
            "par": "Paris (par)" //,
            //"prg": "Prague (prg)"
        },

        bms: {
            "ams": "Amsterdam (ams)",
            "bra": "Bratislava (bra)",
            "ham": "Hamburg (ham)",
            "lon": "London (lon)",
            "mad": "Madrid (mad)",
            "mil": "Milan (mil)",
            "par": "Paris (par)" //,
            //"prg": "Prague (prg)"
        }
    },

    images: {
        host: [
            "Ubuntu-14.04.qcow2",
            "ONOS-1.7.1.qcow2"
        ],

        bms: [
            "ubuntu-14.04-desktop.iso",
            "ubuntu-14.04-server.iso",
            "ubuntu-16.04-desktop.iso",
            "ubuntu-16.04-server.iso",
            "CentOS-6.x-LiveDVD.iso",
            "CentOS-6.x-minimal.iso",
            "CentOS-7-x86_64-DVD.iso",
            "debian-live-x.y-amd64-gnome.iso",
            "pclinuxos64-kde5.iso"
        ]
    },

    flavors: {
        host: [
            "c1r1h10",
            "c2r2h10",
            "c2r2h20",
            "c3r3h30"
        ],

        bms: [
            //
        ]
    },

    switch_mode: [
        'hard',
       // 'soft'
    ],

    suggestions: {
        host_id_prefix: "myVM",

        vsi_id_prefix: "myVSI",
        suggested_switchIPv4Addr: "10.10.100.1",
        suggested_switchIPv4Mask: "255.255.255.0",
        suggested_controllerIPv4:"10.10.100.100",
        suggested_controllerPort: "6633",

        bms_id_prefix: "myBMS"
    },

    link_suffix: "num",

    bandwidths: {
        unit: "Mbps",
        default: "",
        step: 100,
        ranges: [2001, 4001, 6001, 8001],
        tooltip: "This field should be left unspecified since bandwidth reservation is not supported in this version of GTS."
    },

    popover: true,

    vis_height: 0.7594,
    dsl_height: 0.706,

    locales: {
        edit: 'Edit',
        del: 'Delete selected',
        back: 'Back',
        addNode: 'Add Node',
        addEdge: 'Add Link',
        editNode: 'Edit Node',
        editEdge: 'Edit Link',
        addDescription: 'Click in an empty space to place a new node.',
        edgeDescription: 'Click on a node and drag the edge to another node to connect them.',
        editEdgeDescription: 'Click on the control points and drag them to a node to connect to it.',
        createEdgeError: 'Cannot link edges to a cluster.',
        deleteClusterError: 'Clusters cannot be deleted.',
        editClusterError: 'Clusters cannot be edited.'
    },

    sampleData:﻿{"dsl_id":"ExampleTestbed","dsl_description":"Two VMs and a link between them","nodes":[{"id":"2956013f-6956-4577-85ec-0df2b466fcfe","x":-240,"y":-37,"label":"Client","group":"host","dsl_id":"Client","location":"lon","image":"Ubuntu-14.04.qcow2","flavor":"c1r1h10","ports":{"p1":"p1"},"ports_count":1,"selfieRadiuses":[],"title":"<pre class=\"tooltip-pre\"><code>host {\n    id = \"Client\"\n    location = \"lon\"\n    imageId = \"Ubuntu-14.04.qcow2\"\n    flavorId = \"c1r1h10\n\tport { id = \"p1\" }\n}</code></pre>"},{"id":"8cde2bf2-afa6-4ace-89bc-03f2070bf973","x":150,"y":-37,"label":"Server","group":"host","dsl_id":"Server","location":"par","image":"Ubuntu-14.04.qcow2","flavor":"c1r1h10","ports":{"p1":"p1"},"ports_count":1,"selfieRadiuses":[],"title":"<pre class=\"tooltip-pre\"><code>host {\n    id = \"Server\"\n    location = \"par\"\n    imageId = \"Ubuntu-14.04.qcow2\"\n    flavorId = \"c1r1h10\n\tport { id = \"p1\" }\n}</code></pre>"}],"edges":[{"from":"2956013f-6956-4577-85ec-0df2b466fcfe","to":"8cde2bf2-afa6-4ace-89bc-03f2070bf973","name":"ClientServernum1","from_port":"p1","to_port":"p1","selfie":false,"id":"bc465025-9486-42a9-ab96-0d5d287aab56","title":"<pre class=\"tooltip-pre\"><code>link {\n    id = \"ClientServernum1\"\n    port { id = \"src\" }\n    port { id = \"dst\" }\n}\nadjacency Client.p1, ClientServernum1.src\nadjacency Server.p1, ClientServernum1.dst</code></pre>"}]}
};