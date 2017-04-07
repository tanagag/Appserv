//百度地图
    var mp = new BMap.Map("allmap", {minZoom:4,maxZoom:12});                        // 创建Map实例
    mp.centerAndZoom(new BMap.Point(105.000, 38.000), 5);     // 初始化地图,设置中心点坐标和地图级别
  //  mp.enableScrollWheelZoom(); //启用滚轮放大缩小
   // map.disableDragging();
	  // 添加带有定位的导航控件
	  var navigationControl = new BMap.NavigationControl({
	    // 靠左上角位置
	    anchor: BMAP_ANCHOR_TOP_LEFT,
	    // LARGE类型
	    type: BMAP_NAVIGATION_CONTROL_LARGE,
	    // 启用显示定位
	    enableGeolocation: true
	  });
	  mp.addControl(navigationControl);
	// 复杂的自定义覆盖物
    function ComplexCustomOverlay(point, text, mouseoverText){
      this._point = point;
      this._text = text;
      this._overText = mouseoverText;
    }

    ComplexCustomOverlay.prototype = new BMap.Overlay();

    ComplexCustomOverlay.prototype.initialize = function(map){
      this._map = map;
      var div = this._div = document.createElement("div");
      div.style.position = "absolute";
      div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
      div.style.backgroundColor = "#EE5D5B";
      div.style.border = "1px solid #BC3B3A";
      div.style.color = "white";
      div.style.height = "18px";
      div.style.padding = "2px";
      div.style.lineHeight = "18px";
      div.style.whiteSpace = "nowrap";
      div.style.MozUserSelect = "none";
      div.style.fontSize = "12px";
      div.style.borderRadius = "5px";

	 // div.style.cssText="font-size:18px";
      var span = this._span = document.createElement("span");
      div.appendChild(span);
      span.appendChild(document.createTextNode(this._text));      
      var that = this;

      var arrow = this._arrow = document.createElement("div");
     
      arrow.style.position = "absolute";
      arrow.style.width = "11px";
      arrow.style.height = "10px";
      arrow.style.top = "22px";
      arrow.style.left = "10px";
      arrow.style.borderRadius = "5px";
      arrow.style.overflow = "hidden";
      div.appendChild(arrow);
     
      div.onmouseover = function(){
      	this.style.zIndex = "99999999999";
        this.style.backgroundColor = "#6BADCA";
        this.style.borderColor = "#6BADCA";
        this.style.borderRadius = "3px";
        this.getElementsByTagName("span")[0].innerHTML = that._overText;
        arrow.style.backgroundPosition = "0px -20px";
      }

      div.onmouseout = function(){
      	this.style.zIndex = "auto";
        this.style.backgroundColor = "#EE5D5B";
        this.style.borderColor = "#BC3B3A";
        this.getElementsByTagName("span")[0].innerHTML = that._text;
        arrow.style.backgroundPosition = "0px 0px";
      }

      mp.getPanes().labelPane.appendChild(div);
      
      return div;
    }
    ComplexCustomOverlay.prototype.draw = function(){
      var map = this._map;
      var pixel = map.pointToOverlayPixel(this._point);
      this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + "px";
      this._div.style.top  = pixel.y - 30 + "px";
    }
    
    //所有省级单位视频个数
    $.ajax({
		type:"post",
		dataType:"jsonp", 
		url:url+"coord/getAllVidios.json",
		data:{},
		success:function(data){
			$.each(data.distareas,function(idx,el){
				var txt = el.city+el.vidioCount+"个";
				var myCompOverlay = new ComplexCustomOverlay(new BMap.Point(el.longitude,el.latitude),txt,txt);
				mp.addOverlay(myCompOverlay);
			});
			
			//所有上传视屏所在地（添加海量点数据）
			if (document.createElement('canvas').getContext) {  // 判断当前浏览器是否支持绘制海量点
		        var points = [];  // 添加海量点数据
			     $.each(data.distareas,function(idx,el){
			     	var point = new BMap.Point(el.longitude,el.latitude);
			     	point.index=el.vidioId;
					points.push(point);
				}); 
			        
		        var options = {
		            size: BMAP_POINT_SIZE_SMALL,
		            shape: BMAP_POINT_SHAPE_STAR,
		            color: 'blue'
		        }
		        var pointCollection = new BMap.PointCollection(points, options);  // 初始化PointCollection
		        pointCollection.addEventListener('click', function (e) {
					window.location.href=e.point.index;
		        });
		        mp.addOverlay(pointCollection);  // 添加Overlay
		    } else {
		        alert('请在chrome、safari、IE8+以上浏览器查看本示例');
		    }
		}
	});
