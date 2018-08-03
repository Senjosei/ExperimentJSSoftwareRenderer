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

    function Coordinate (Xaxis,Yaxis,Zaxis) {
        this.Xaxis = Xaxis;
        this.Yaxis = Yaxis;
        this.Zaxis = Zaxis;
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

        if(Math.abs(dx) > Math.abs(dy)){
            if(x2 > x1){
                for (var x = x1; x < x2 ; x++){
                    var y = Math.floor(y1 + dy * (x-x1) / dx);
                    if (x >= 0 && y >= 0){
                       Renderer.PutColor(x, y, tmp_color);
                    }
                }
            } else {
                for (var x = x2; x < x1 ; x++){
                    var y = Math.floor(y1 + dy * (x-x1) / dx);
                    if (x >= 0 && y >= 0){
                        Renderer.PutColor(x, y, tmp_color);
                    }
                }
            }
        } else {
            if(y2 > y1){
                for (var y = y1; y < y2 ; y++){
                    var x = Math.floor(x1 + dx * (y-y1) / dy);
                    if (x >= 0 && y >= 0){
                       Renderer.PutColor(x, y, tmp_color);
                    }
                }
            } else {
                for (var y = y2; y < y1 ; y++){
                    var x = Math.floor(x1 + dx * (y-y1) / dy);
                    if (x >= 0 && y >= 0){
                       Renderer.PutColor(x, y, tmp_color);
                    }
               }
            }
        }
    }

    Renderer.Draw = function(Model){
        for (var face of Model.Face){
            var Coor1 = new Coordinate;
            var Coor2 = new Coordinate;
            var Coor3 = new Coordinate;

            Coor1.Xaxis = (Model.Vertex[face.V1 - 1].X)*300 + 500;
            Coor1.Yaxis = (Model.Vertex[face.V1 - 1].Y)*300 + 300; 
            Coor1.Zaxis = (Model.Vertex[face.V1 - 1].Z)*300;

            Coor2.Xaxis = (Model.Vertex[face.V2 - 1].X)*300 + 500;
            Coor2.Yaxis = (Model.Vertex[face.V2 - 1].Y)*300 + 300; 
            Coor2.Zaxis = (Model.Vertex[face.V2 - 1].Z)*300;

            Coor3.Xaxis = (Model.Vertex[face.V3 - 1].X)*300 + 500;
            Coor3.Yaxis = (Model.Vertex[face.V3 - 1].Y)*300 + 300; 
            Coor3.Zaxis = (Model.Vertex[face.V3 - 1].Z)*300;

            Renderer.MakeLine(Coor1,Coor2);
            Renderer.MakeLine(Coor2,Coor3);
            Renderer.MakeLine(Coor1,Coor3);
        }
    };
    Renderer.Draw(Model);



    // for (var count = 200; count < 300; count++){
    //     var Coor1 = new Coordinate(10*count,200);
    //     var Coor2 = new Coordinate(10*count,500);
    //     Renderer.MakeLine(Coor1,Coor2);
    // }


    Renderer.Context.putImageData(Renderer.PixelBuffer,0,0)
}