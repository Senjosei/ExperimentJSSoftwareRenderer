document.onreadystatechange = function(){
    var canvas = document.querySelector("#canvas");
    var context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;

    function Color(r,g,b,a){
        this.R = r;
        this.G = g;
        this.B = b;
        this.A = a;
    };

    Coordinate = {
        X : x,
        Y : y
    }

    Size = {
        Width : 1152,
        Height : 648 
    }
    
    window.Renderer = {
        Context : context,
        Width : Size.Width,
        Height : Size.Height,
        EmptyBuffer : new ImageData(Size.Width,Size.Height),
        PixelBuffer : new ImageData(Size.Width,Size.Height)
    };

    Renderer.GetPixel = function(x,y){
        var tmp  = y * (this.Width * 4 ) + x * 4;
        var r = this.PixelBuffer.data[tmp];
        var g = this.PixelBuffer.data[tmp + 1];
        var b = this.PixelBuffer.data[tmp + 2];
        var a = this.PixelBuffer.data[tmp + 3];
        return new Pixel(r,g,b,a)
    };
    
    Renderer.PutPixel = function(x,y,pixel){
        var tmp  = y * (this.Width * 4 ) + x * 4;
        this.PixelBuffer.data[tmp] = pixel.R;
        this.PixelBuffer.data[tmp + 1] = pixel.G;
        this.PixelBuffer.data[tmp + 2] = pixel.B;
        this.PixelBuffer.data[tmp + 3] = pixel.A;
    };

    for(var i = 0; i < Renderer.Width; i++){
        for(var j = 0; j < Renderer.Height; j++){
            var tmp_pixel = new Color; 
            tmp_pixel.R = Math.floor(Math.random() * 255);
            tmp_pixel.G = Math.floor(Math.random() * 255);
            tmp_pixel.B = Math.floor(Math.random() * 255);
            tmp_pixel.A = Math.floor(Math.random() * 255);
            Renderer.PutPixel(i,j,tmp_pixel);
        }
    }

    Renderer.Context.putImageData(Renderer.PixelBuffer,0,0)
}