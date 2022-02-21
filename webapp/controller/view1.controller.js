// jQuery.sap.registerModulePath('SignaturePad', 'SignaturePad');
sap.ui.define(
    ["sap/ui/core/mvc/Controller"],
    function (oController, signaturePad) {
        return oController.extend("digitalsign.controller.view1", {
            onInit: function () {
                this.byId("idHtml").setContent("<canvas id='signature-pad' width='400' height='100' class='signature-pad'/>");
                this.byId("idBtn2").setVisible(false);
                this.byId("idBtn3").setVisible(false);
            },
            onSign: function () {
                var canvas = document.getElementById("signature-pad");
                var context = canvas.getContext("2d");
                canvas.height = 150;
                canvas.width = 350;
                canvas.fillStyle = "#fff";
                canvas.strokeStyle = "#444";
                context.lineWidth = 1.5;
                context.lineCap = "round";
                context.fillStyle = "lightyellow";
                context.fillRect(0, 0, canvas.width, canvas.height);
                var disableSave = true;
                var pixels = [];
                var cpixels = [];
                var xyLast = {};
                var xyAddLast = {};
                var calculate = false;
                { 	//functions
                    function remove_event_listeners() {
                        canvas.removeEventListener('mousemove', on_mousemove, false);
                        canvas.removeEventListener('mouseup', on_mouseup, false);
                        canvas.removeEventListener('touchmove', on_mousemove, false);
                        canvas.removeEventListener('touchend', on_mouseup, false);

                        document.body.removeEventListener('mouseup', on_mouseup, false);
                        document.body.removeEventListener('touchend', on_mouseup, false);
                    }
                    function get_coords(e) {
                        var x, y;

                        if (e.changedTouches && e.changedTouches[0]) {
                            var canvasArea = canvas.getBoundingClientRect();
                            var offsety = canvasArea.top || 0;
                            var offsetx = canvasArea.left || 0;
                            // var offsety = canvas.offsetTop || 0;
                            // var offsetx = canvas.offsetLeft || 0;

                            x = e.changedTouches[0].pageX - offsetx;
                            y = e.changedTouches[0].pageY - offsety;
                        } else if (e.layerX || 0 == e.layerX) {
                            x = e.layerX;
                            y = e.layerY;
                        } else if (e.offsetX || 0 == e.offsetX) {
                            x = e.offsetX;
                            y = e.offsetY;
                        }

                        return {
                            x: x, y: y
                        };
                    };
                    function on_mousedown(e) {
                        e.preventDefault();
                        e.stopPropagation();

                        canvas.addEventListener('mouseup', on_mouseup, false);
                        canvas.addEventListener('mousemove', on_mousemove, false);
                        canvas.addEventListener('touchend', on_mouseup, false);
                        canvas.addEventListener('touchmove', on_mousemove, false);
                        document.body.addEventListener('mouseup', on_mouseup, false);
                        document.body.addEventListener('touchend', on_mouseup, false);

                        empty = false;
                        var xy = get_coords(e);
                        context.beginPath();
                        pixels.push('moveStart');
                        context.moveTo(xy.x, xy.y);
                        pixels.push(xy.x, xy.y);
                        xyLast = xy;
                    };
                    function on_mousemove(e, finish) {
                        e.preventDefault();
                        e.stopPropagation();

                        var xy = get_coords(e);
                        var xyAdd = {
                            x: (xyLast.x + xy.x) / 2,
                            y: (xyLast.y + xy.y) / 2
                        };

                        if (calculate) {
                            var xLast = (xyAddLast.x + xyLast.x + xyAdd.x) / 3;
                            var yLast = (xyAddLast.y + xyLast.y + xyAdd.y) / 3;
                            pixels.push(xLast, yLast);
                        } else {
                            calculate = true;
                        }

                        context.quadraticCurveTo(xyLast.x, xyLast.y, xyAdd.x, xyAdd.y);
                        pixels.push(xyAdd.x, xyAdd.y);
                        context.stroke();
                        context.beginPath();
                        context.moveTo(xyAdd.x, xyAdd.y);
                        xyAddLast = xyAdd;
                        xyLast = xy;
                    };
                    function on_mouseup(e) {
                        remove_event_listeners();
                        disableSave = false;
                        context.stroke();
                        pixels.push('e');
                        calculate = false;
                    };
                }
                canvas.addEventListener('touchstart', on_mousedown, false);
                canvas.addEventListener('mousedown', on_mousedown, false);
                this.byId("idBtn1").setVisible(false);
                this.byId("idBtn2").setVisible(true);
                this.byId("idBtn3").setVisible(true);
            },
            onSave: function () {
                var canvas = document.getElementById("signature-pad");
                var link = document.createElement('a');
                link.href = canvas.toDataURL('image/jpeg');
                link.download = 'sign.jpeg';
                link.click();
                var context = canvas.getContext("2d");
                context.clearRect(0, 0, canvas.width, canvas.height);
                this.byId("idBtn1").setVisible(true);
                this.byId("idBtn2").setVisible(false);
                this.byId("idBtn3").setVisible(false);
            },
            onClear: function () {
                var canvas = document.getElementById("signature-pad");
                var context = canvas.getContext("2d");
                context.clearRect(0, 0, canvas.width, canvas.height);
                this.onSign();
            }
        })
    }
);