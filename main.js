document.onreadystatechange = function(){
    var canvas = document.querySelector("#canvas");
    var context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;

    function Pixel(r,g,b,a){
        this.R = r;
        this.G = g;
        this.B = b;
        this.A = a;
    };

    Size = {
        Width : 1280,
        Height : 720 
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

    Renderer.MakeLine = function(x1, x2, y1, y2){
    	x1 = Math.floor(x1);
    	x2 = Math.floor(x2);
    	y1 = Math.floor(y1);
    	y2 = Math.floor(y2);




    	var color = new Pixel;
    	color.R = 0;
    	color.G = 0;
    	color.B = 0;
    	color.A = 255;

    	// if (x2 < x1){
    	// 	var tempx = x1;
    	// 	x1 = x2;
    	// 	x2 = tempx;
    	// }

    	// if (y2 < y1){
    	// 	var tempy = y1;
    	//  	y1 = y2;
    	// 	y2 = tempy;
    	// }

    	var dx = (x2 - x1);
    	var dy = (y2 - y1);

    	if (Math.abs(dx) > Math.abs(dy)){
    		if(x2 > x1)
    		for (var x = x1; x < x2; x++){
    			var y = y1 + dy * (x - x1) / dx;
    			y = Math.floor(y);
    			if (x >= 0 && y >= 0){
    				Renderer.PutPixel(x, y, color);
    			}
    		}
    		else
    		for (var x = x2; x < x1; x++){
    			var y = y1 + dy * (x - x1) / dx;
    			y = Math.floor(y);
    			if (x >= 0 && y >= 0){
    				Renderer.PutPixel(x, y, color);
    			}
    		}
    	}
    	else{
    		if(y2 > y1)
    		for(var y = y1; y < y2; y++){
    			var x = x1 + dx * (y - y1) / dy;
    			x = Math.floor(x);
    			if (x >= 0 && y >= 0){
    				Renderer.PutPixel(x, y, color);
    			}
    		}
    		else
    		for(var y = y2; y < y1; y++){
    			var x = x1 + dx * (y - y1) / dy;
    			x = Math.floor(x);
    			if (x >= 0 && y >= 0){
    				Renderer.PutPixel(x, y, color);
    			}
    		}
    	}

    }


	for(var i of Model.Face){
		var index1 = i.V1 - 1;
		var index2 = i.V2 - 1;
		var index3 = i.V3 - 1;

		var v1 = Model.Vertex[index1];
		var v2 = Model.Vertex[index2];
		var v3 = Model.Vertex[index3];

		Renderer.MakeLine(v1.X * 350 + 640, v2.X * 350 + 640, v1.Y * 350 + 350,
						  v2.Y * 350 + 350);
		Renderer.MakeLine(v2.X * 350 + 640, v3.X * 350 + 640, v2.Y * 350 + 350,
						  v3.Y * 350 + 350);
		Renderer.MakeLine(v3.X * 350 + 640, v1.X * 350 + 640, v3.Y * 350 + 350,
		 				  v1.Y * 350 + 350);


	}    
    //  for (i = 0; i < 10; i++){
    // 	var x1 = Math.floor(Math.random()*1280);
    // 	var x2 = Math.floor(Math.random()*1280);
    // 	var y1 = Math.floor(Math.random()*720);
    // 	var y2 = Math.floor(Math.random()*720);
    // 	Renderer.MakeLine(x1, x2, y1, y2);
    // 	console.log(x1,x2,y1,y2)
    // }
    

    // for (var height = 0; height < Renderer.Height; height++){
    // 	for (var width = 0; width < Renderer.Width; width++){
    // 		var color = new Pixel;
    // 		color.R = Math.floor(Math.random()*255);
    // 		color.G = Math.floor(Math.random()*255);
    // 		color.B = Math.floor(Math.random()*255);
    // 		color.A = 255;
    // 		Renderer.PutPixel(width, height, color);
    // 	}

    // }




    Renderer.Context.putImageData(Renderer.PixelBuffer,0,0)
}