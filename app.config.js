var config = {
    loadSampleData: true,

    import_export: true,

    locations: {
        host: {
            "ams": "Amsterdam (ams)",
            "bra": "Bratislava (bra)",
            "ham": "Hamburg (ham)",
            "lju": "Ljubljana (lju)",
            "lon": "London (lon)",
            "mil": "Milan (mil)",
            "par": "Paris (par)",
            "prg": "Prague (prg)"
        },

        vsi: {
            "ams": "Amsterdam (ams)",
            "bra": "Bratislava (bra)",
            "ham": "Hamburg (ham)",
            "lju": "Ljubljana (lju)",
            "lon": "London (lon)",
            "mil": "Milan (mil)",
            "par": "Paris (par)",
            "prg": "Prague (prg)"
        },

        bms: {
            "ams": "Amsterdam (ams)",
            "bra": "Bratislava (bra)",
            "ham": "Hamburg (ham)",
            "lju": "Ljubljana (lju)",
            "lon": "London (lon)",
            "mil": "Milan (mil)",
            "par": "Paris (par)",
            "prg": "Prague (prg)"
        }
    },

    images: {
        host: [
            "CentOS-6.8-x86_64-LiveDVD.iso",
            "CentOS-7-x86_64-Minimal-1503-01.iso",
            "Debian-8.6.0-amd64-DVD-1.iso",
            "Kali-linux-2016.2-amd64.iso"
        ],

        bms: [
            "CentOS-6.8-x86_64-LiveDVD.iso",
            "CentOS-7-x86_64-Minimal-1503-01.iso",
            "Debian-8.6.0-amd64-DVD-1.iso",
            "Kali-linux-2016.2-amd64.iso"
        ]
    },

    flavors: {
        host: [
            "tiny",
            "small",
            "medium",
            "large"
        ],

        bms: [
            //
        ]
    },

    switch_mode: [
        'hard',
        'soft'
    ],

    suggestions: {
        host_id_prefix: "host",

        vsi_id_prefix: "vsi",
        suggested_switchIPv4Addr: "10.10.100.1",
        suggested_switchIPv4Mask: "255.255.255.0",
        suggested_controllerIPv4:"10.10.100.100",
        suggested_controllerPort: "6633",

        bms_id_prefix: "bms"
    },

    link_suffix: "_",

    bandwidths: {
        unit: "Mbps",
        default: "",
        step: 100,
        ranges: [2001, 4001, 6001, 8001],
        tooltip: "This field should be left unspecified since bandwidth reservation is not supported in this version of GTS."
    },

    popover: false,

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

    sampleData: {"dsl_id":"WorkshopTestbed","dsl_description":"Two BareMetalServers connected on a VSI which is controlled with one controller.","nodes":[{"id":1,"label":"host1","group":"host","dsl_id":"host1","location":"lon","image":"CentOS-6.8-x86_64-LiveDVD.iso","flavor":"tiny","ports":{"p1":"p1"},"ports_count":1,"selfieRadiuses":[],"x":0,"y":-160},{"id":2,"label":"vsi1","group":"vsi","dsl_id":"vsi1","location":"ams","switchIPv4Addr":"10.10.100.1","switchIPv4Mask":"255.255.2555.0","switchMode":"hard","controller":{"ipv4":"10.10.100.100","port":"6633"},"ports":{"p1":{"logicalPort":1},"p2":{"logicalPort":2},"pC":{"mode":"\"CONTROL\""}},"ports_count":2,"selfieRadiuses":[],"x":0,"y":50},{"id":3,"label":"bms1","group":"bms","dsl_id":"bms1","location":"ams","image":"CentOS-6.8-x86_64-LiveDVD.iso","ports":{"p1":"p1"},"ports_count":1,"selfieRadiuses":[],"x":-265,"y":145},{"id":4,"label":"bms2","group":"bms","dsl_id":"bms2","location":"lon","image":"CentOS-6.8-x86_64-LiveDVD.iso","ports":{"p1":"p1"},"ports_count":1,"selfieRadiuses":[],"x":265,"y":145}],"edges":[{"from":1,"to":2,"from_port":"p1","to_port":"pC","name":"host1vsi1_1","color":{"color":"#f94d51","highlight":"#952e30","hover":"#952e30"},"selfieRadius":false,"bandwidth":null,"id":"8bccbb1f-1656-4f24-8aa9-003d1c935a4d"},{"from":3,"to":2,"from_port":"p1","to_port":"p1","name":"bms1vsi1_1","selfieRadius":false,"bandwidth":null,"id":"68886928-f8e3-4eaf-ad62-d0770f4e6fe2","title":null},{"from":4,"to":2,"from_port":"p1","to_port":"p2","name":"bms2vsi1_1","selfieRadius":false,"bandwidth":null,"id":"253e8b47-8bb0-472c-907c-9259cf1625b3"}]}
};