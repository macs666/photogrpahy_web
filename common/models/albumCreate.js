
function createAlbum(Albums) {
    Albums.createAlbum = function(name, cb) {
        try {
            const {name: storageName, root: storageRoot} = Albums.app.dataSources.storage.settings;
      
            if (storageName === 'storage') {
              const path = `${storageRoot}${BUCKET}/`;
      
              if (!fs.existsSync(path)) {
                fs.mkdirSync(path);
              }
            }
          } catch (error) {
      
          }

          const Container = Albums.app.models.Attatchment
          Container.createContainer({name: name}, function(err, container){
            if (err != undefined || err != null) {
                cb(err,null)
            }
            else {
                Albums.create({name : container.name}, function (err, obj) {
                    cb(err,obj)
                })
            }
          })
    }

    Albums.remoteMethod(
        'createAlbum', {
            http: { path: '/createAlbum', verb: 'post'},
            accepts: [
                {arg: 'name', type: 'string', required: true}
            ],
            returns: {
                arg: 'album',
                type: 'object',
            },
            description: "Generate token" 
        }
    );
}

function uploadImage(Albums) {
    Albums.uploadImage = function(id,req, res, body, cb) {
        
        Albums.findById(id, function (err, instance) {
            if (err != undefined || err != null) {
                cb(err,null)
            }
            try {
                const {name: storageName, root: storageRoot} = Albums.app.dataSources.storage.settings;
          
                if (storageName === 'storage') {
                  const path = `${storageRoot}${BUCKET}/`;
          
                  if (!fs.existsSync(path)) {
                    fs.mkdirSync(path);
                  }
                }
              } catch (error) {
          
              }
    
              const Container = Albums.app.models.Attatchment
              Container.upload(instance.name,req,res,function(err, fileObj){
                if (err != undefined || err != null) {
                    cb(err,null)
                }
                else {
                    
                    var images = instance.images
                    images.push(fileObj.files.file[0].container+"/"+fileObj.files.file[0].name)
                    var updateField = {
                        images:images
                    }
                    instance.updateAttributes(updateField,function(err,obj){
                        console.log(images)
                        cb(err,obj) 
                    })
                }
              })
        });
    } 

    Albums.remoteMethod('uploadImage', {
        description: 'Uploads a file',
        accepts: [
            {arg: 'id', type: 'string', required: true},
            {arg: 'req', type: 'object', http: {source: 'req'}},
            {arg: 'res', type: 'object', http: {source: 'res'}},
            {arg: 'body', type: 'object', http: {source: 'body'}}
        ],
        returns: {
          arg: 'fileObject',
          type: 'object',
          root: true
        },
        http: {path: '/:id/uploadImage', verb: 'post'}
      });
}

module.exports = {
    createAlbum : createAlbum,
    uploadImage : uploadImage
}