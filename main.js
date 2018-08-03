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

    function Coordinate (Xaxis,Yaxis) {
        this.Xaxis = Xaxis;
        this.Yaxis = Yaxis;
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

    Renderer.GetColor = function(x,y){
        var tmp  = y * (this.Width * 4 ) + x * 4;
        var r = this.PixelBuffer.data[tmp];
        var g = this.PixelBuffer.data[tmp + 1];
        var b = this.PixelBuffer.data[tmp + 2];
        var a = this.PixelBuffer.data[tmp + 3];
        return new Color(r,g,b,a)
    };
    
    Renderer.PutColor = function(x,y,pixel){
        var tmp  = y * (this.Width * 4 ) + x * 4;
        this.PixelBuffer.data[tmp] = pixel.R;
        this.PixelBuffer.data[tmp + 1] = pixel.G;
        this.PixelBuffer.data[tmp + 2] = pixel.B;
        this.PixelBuffer.data[tmp + 3] = pixel.A;
    };

    // for(var i = 0; i < Renderer.Width; i++){
    //     for(var j = 0; j < Renderer.Height; j++){
    //         var tmp_pixel = new Color; 
    //         tmp_pixel.R = i % 255;
    //         tmp_pixel.G = i % j % 255;
    //         tmp_pixel.B = j % 255;
    //         tmp_pixel.A = 255;
    //         Renderer.PutColor(i,j,tmp_pixel);
    //     }
    // }

    Renderer.MakeLine = function(Coor1,Coor2){
        var x1 = Math.floor(Coor1.Xaxis);
        var x2 = Math.floor(Coor2.Xaxis);
        var y1 = Math.floor(Coor1.Yaxis);
        var y2 = Math.floor(Coor2.Yaxis);
        var dx = x2-x1;
        var dy = y2-y1;
        var tmp_color = new Color;
        tmp_color.R = 0;
        tmp_color.G = 0;
        tmp_color.B = 0;
        tmp_color.A = 255;

        if(x2 < x1){
            var temp = x1;
            x1 = x2;
            x2 = temp;
        }

        
        if(y2 < y1){
            var temp = y1;
            y1 = y2;
            y2 = temp;
        }

        if (Math.abs(x2-x1) > Math.abs(y2-y1)){
            for (var x = x1; x < x2 ; x++){
                var y = Math.floor(y1 + dy * (x-x1) / dx);
                if (x >= 0){
                    Renderer.PutColor(x, y, tmp_color);
                }
            }
        } else {
            for (var y = y1; y < y2 ; y++){
                var x = Math.floor(x1 + dx * (y-y1) / dy);
                if (y >= 0){
                    Renderer.PutColor(x, y, tmp_color);
                }
            }
        }
    }

    for (var count = 0; count < 15; count++){
        var Coor1 = new Coordinate(Math.floor(Math.random()*1152),Math.floor(Math.random()*648));
        var Coor2 = new Coordinate(Math.floor(Math.random()*1152),Math.floor(Math.random()*648));
        Renderer.MakeLine(Coor1,Coor2);
    }
    Renderer.Context.putImageData(Renderer.PixelBuffer,0,0)
}