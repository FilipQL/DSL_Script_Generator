/**
 * Vis Network Options - http://visjs.org/docs/network/#options
 */

let locales = {
    en: {
        edit: config.locales.edit,
        del: config.locales.del,
        back: config.locales.back,
        addNode: config.locales.addNode,
        addEdge: config.locales.addEdge,
        editNode: config.locales.editNode,
        editEdge: config.locales.editEdge,
        addDescription: config.locales.addDescription,
        edgeDescription: config.locales.edgeDescription,
        editEdgeDescription: config.locales.editEdgeDescription,
        createEdgeError: config.locales.createEdgeError,
        deleteClusterError: config.locales.deleteClusterError,
        editClusterError: config.locales.editClusterError
    }
};

export default {
    height: Math.round($(window).height() * config.vis_height) + 'px',

    locale: 'en',
    locales: locales,

    edges: {
        color: {
            color: '#2B7CE9',
            highlight: '#194a8b',
            hover: '#194a8b'
        },
        width: 2,
        shadow:true
    },

    nodes: {
        physics: false,
        shape: 'dot',
        size: 30,
        font: {
            size: 28,
            vadjust: -10
        },
        borderWidth: 2,
        shadow:true
    },

    groups: {
        host: {
            shape: 'triangle',
            color: {
                border: '#C37F00',
                background: '#FFA807',
                highlight: {
                    border: '#C37F00',
                    background: '#ffd484'
                },
                hover: {
                    border: '#C37F00',
                    background: '#ffd484'
                }
            }

        },
        vsi: {
            shape: 'dot',
            color: {
                border: '#41A906',
                background: '#7BE141',
                highlight: {
                    border: '#41A906',
                    background: '#b3ef91'
                },
                hover: {
                    border: '#41A906',
                    background: '#b3ef91'
                }
            }
        },
        bms: {
            shape: 'square'
        }
    },

    interaction: {
        hover: true,
        keyboard: {
            enabled: true,
            speed: {x: 3, y: 3, zoom: 0.02},
            bindToWindow: false
        },
        multiselect: true,
        navigationButtons: true
    }
};