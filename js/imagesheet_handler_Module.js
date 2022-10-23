// Module definition
const imagesheet_handler_Module = new function() {
//

const __DEBUG = false; // For debugging locally



function canvas_cropImg(imgURI, width, height, posX, posY) {
    return new Promise(function(resolve, rejected) {
        var transform_canvas = document.createElement("canvas")
        var img_src = new Image()

        img_src.src = imgURI;
        
        if (__DEBUG) {
            img_src.crossOrigin = "anonymous"
        }

        img_src.onload = function() {
            transform_canvas.width = width
            transform_canvas.height = height

            var canvas2D = transform_canvas.getContext("2d")
            canvas2D.drawImage(img_src, posX, posY, width, height, 0, 0, width, height)

            if (canvas2D && transform_canvas) {
                resolve(transform_canvas)
            }
        }
    })
}

function cropImage(imgURI, width, height, posX, posY) {
    return new Promise(function(resolve, rejected) {
        canvas_cropImg(imgURI, width, height, posX, posY).then(function(res) {
            resolve(res.toDataURL("image/png").toString())
        })
    })
}


// export for module
this.cropImage = cropImage


} // end of module