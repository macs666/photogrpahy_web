'use strict';

module.exports = function(Albums) {
    var albumFuncs = require('../models/albumCreate')
    albumFuncs.createAlbum(Albums)
    albumFuncs.uploadImage(Albums)
};
