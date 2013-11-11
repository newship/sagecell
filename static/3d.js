// Generated by CoffeeScript 1.5.0
(function() {
  var SalvusThreeJS, component_to_hex, defaults, required, rgb_to_hex, root, run_when_defined, to_json,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  to_json = function(x) {
    return JSON.stringify(x);
  };

  defaults = function(obj1, obj2) {
    var error, prop, r, val;
    if (obj1 == null) {
      obj1 = {};
    }
    error = function() {
      try {
        return "(obj1=" + (to_json(obj1)) + ", obj2=" + (to_json(obj2)) + ")";
      } catch (error) {
        return "";
      }
    };
    if (typeof obj1 !== 'object') {
      console.trace();
      throw "misc.defaults -- TypeError: function takes inputs as an object " + (error());
    }
    r = {};
    for (prop in obj2) {
      val = obj2[prop];
      if (obj1.hasOwnProperty(prop) && (obj1[prop] != null)) {
        if (obj2[prop] === defaults.required && (obj1[prop] == null)) {
          console.trace();
          throw "misc.defaults -- TypeError: property '" + prop + "' must be specified: " + (error());
        }
        r[prop] = obj1[prop];
      } else if (obj2[prop] != null) {
        if (obj2[prop] === defaults.required) {
          console.trace();
          throw "misc.defaults -- TypeError: property '" + prop + "' must be specified: " + (error());
        } else {
          r[prop] = obj2[prop];
        }
      }
    }
    for (prop in obj1) {
      val = obj1[prop];
      if (!obj2.hasOwnProperty(prop)) {
        console.trace();
        throw "misc.defaults -- TypeError: got an unexpected argument '" + prop + "' " + (error());
      }
    }
    return r;
  };

  required = defaults.required = "__!!!!!!this is a required property!!!!!!__";

  /* END misc.coffee includes
  */


  run_when_defined = function(opts) {
    var delay, f, total;
    opts = defaults(opts, {
      fn: required,
      start_delay: 100,
      max_time: 10000,
      exp_factor: 1.4,
      cb: required,
      err: required
    });
    delay = void 0;
    total = 0;
    f = function() {
      var result;
      result = opts.fn();
      if (result != null) {
        return opts.cb(result);
      } else {
        if (delay == null) {
          delay = opts.start_delay;
        } else {
          delay *= opts.exp_factor;
        }
        total += delay;
        if (total > opts.max_time) {
          return opts.err("failed to eval code within " + opts.max_time);
        } else {
          return setTimeout(f, delay);
        }
      }
    };
    return f();
  };

  component_to_hex = function(c) {
    var hex;
    hex = c.toString(16);
    if (hex.length === 1) {
      return "0" + hex;
    } else {
      return hex;
    }
  };

  rgb_to_hex = function(r, g, b) {
    return "#" + component_to_hex(r) + component_to_hex(g) + component_to_hex(b);
  };

  SalvusThreeJS = (function() {

    function SalvusThreeJS(opts) {
      this.render_scene = __bind(this.render_scene, this);
      this.controlChange = __bind(this.controlChange, this);
      this.animate = __bind(this.animate, this);
      this.add_3dgraphics_obj = __bind(this.add_3dgraphics_obj, this);
      this.set_frame = __bind(this.set_frame, this);
      this.add_obj = __bind(this.add_obj, this);
      this.add_point = __bind(this.add_point, this);
      this.add_line = __bind(this.add_line, this);
      this.add_text = __bind(this.add_text, this);
      this.set_light = __bind(this.set_light, this);
      this.add_camera = __bind(this.add_camera, this);
      this.set_trackball_controls = __bind(this.set_trackball_controls, this);
      this.data_url = __bind(this.data_url, this);
      var a, c, i, z;
      this.opts = defaults(opts, {
        element: required,
        width: void 0,
        height: void 0,
        renderer: void 0,
        trackball: true,
        light: true,
        background: void 0,
        foreground: void 0,
        camera_distance: 10
      });
      this.scene = new THREE.Scene();
      this.opts.width = opts.width != null ? opts.width : $(window).width() * .9;
      this.opts.height = opts.height != null ? opts.height : $(window).height() * .6;
      if (this.opts.renderer == null) {
        if (Detector.webgl) {
          this.opts.renderer = 'webgl';
        } else {
          this.opts.renderer = 'canvas2d';
        }
      }
      if (this.opts.renderer === 'webgl') {
        this.opts.element.find(".salvus-3d-viewer-renderer").text("webgl");
        this.renderer = new THREE.WebGLRenderer({
          antialias: true,
          preserveDrawingBuffer: true
        });
      } else {
        this.opts.element.find(".salvus-3d-viewer-renderer").text("canvas2d");
        this.renderer = new THREE.CanvasRenderer({
          antialias: true
        });
      }
      this.renderer.setSize(this.opts.width, this.opts.height);
      if (this.opts.background == null) {
        this.opts.background = "rgba(0,0,0,0)";
        if (this.opts.foreground == null) {
          this.opts.foreground = "#000000";
        }
      }
      this.opts.element.find(".salvus-3d-canvas").css({
        'background': this.opts.background
      }).append($(this.renderer.domElement));
      if (this.opts.foreground == null) {
        c = this.opts.element.find(".salvus-3d-canvas").css('background');
        i = c.indexOf(')');
        z = (function() {
          var _i, _len, _ref, _results;
          _ref = c.slice(4, i).split(',');
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            a = _ref[_i];
            _results.push(255 - parseInt(a));
          }
          return _results;
        })();
        this.opts.foreground = rgb_to_hex(z[0], z[1], z[2]);
      }
      this.add_camera({
        distance: this.opts.camera_distance
      });
      if (this.opts.light) {
        this.set_light();
      }
      if (this.opts.trackball) {
        this.set_trackball_controls();
      }
      this._animate = false;
      this._animation_frame = false;
    }

    SalvusThreeJS.prototype.data_url = function(type) {
      if (type == null) {
        type = 'png';
      }
      return this.renderer.domElement.toDataURL("image/" + type);
    };

    SalvusThreeJS.prototype.set_trackball_controls = function() {
      var _this = this;
      if (this.controls != null) {
        return;
      }
      this.controls = new THREE.TrackballControls(this.camera, this.renderer.domElement);
      this.controls.staticMoving = false;
      this.controls.dynamicDampingFactor = 0.3;
      this.controls.noRoll = true;
      if (this._center != null) {
        this.controls.target = this._center;
      }
      this.controls.addEventListener('change', this.controlChange);
      this.controls.addEventListener('start', (function() {
        _this._animate = true;
        return _this._animation_frame = requestAnimationFrame(_this.animate);
      }));
      return this.controls.addEventListener('end', (function() {
        return _this._animate = false;
      }));
    };

    SalvusThreeJS.prototype.add_camera = function(opts) {
      var aspect, far, near, view_angle;
      opts = defaults(opts, {
        distance: 10
      });
      view_angle = 45;
      aspect = this.opts.width / this.opts.height;
      near = 0.1;
      far = Math.max(20000, opts.distance * 2);
      this.camera = new THREE.PerspectiveCamera(view_angle, aspect, near, far);
      this.scene.add(this.camera);
      this.camera.position.set(opts.distance, opts.distance, opts.distance);
      this.camera.lookAt(this.scene.position);
      return this.camera.up = new THREE.Vector3(0, 0, 1);
    };

    SalvusThreeJS.prototype.set_light = function(color) {
      var ambient, directionalLight;
      if (color == null) {
        color = 0xffffff;
      }
      ambient = new THREE.AmbientLight();
      this.scene.add(ambient);
      directionalLight = new THREE.DirectionalLight(0xffffff);
      directionalLight.position.set(100, 100, 100).normalize();
      this.scene.add(directionalLight);
      directionalLight = new THREE.DirectionalLight(0xffffff);
      directionalLight.position.set(-100, -100, -100).normalize();
      this.scene.add(directionalLight);
      this.light = new THREE.PointLight(0xffffff);
      return this.light.position.set(0, 10, 0);
    };

    SalvusThreeJS.prototype.add_text = function(opts) {
      var canvas, context, o, p, sprite, spriteMaterial, texture;
      o = defaults(opts, {
        pos: [0, 0, 0],
        text: required,
        fontsize: 12,
        fontface: 'Arial',
        color: "#000000",
        border_thickness: 0,
        sprite_alignment: 'topLeft',
        constant_size: true
      });
      o.sprite_alignment = THREE.SpriteAlignment[o.sprite_alignment];
      canvas = document.createElement("canvas");
      context = canvas.getContext("2d");
      context.font = "Normal " + o.fontsize + "px " + o.fontface;
      context.fillStyle = o.color;
      context.fillText(o.text, o.border_thickness, o.fontsize + o.border_thickness);
      texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        useScreenCoordinates: false,
        alignment: o.sprite_alignment,
        sizeAttenuation: true
      });
      sprite = new THREE.Sprite(spriteMaterial);
      p = o.pos;
      sprite.position.set(p[0], p[1], p[2]);
      if (o.constant_size) {
        if (this._text == null) {
          this._text = [sprite];
        } else {
          this._text.push(sprite);
        }
      }
      this.scene.add(sprite);
      return sprite;
    };

    SalvusThreeJS.prototype.add_line = function(opts) {
      var a, geometry, line, o, _i, _len, _ref;
      o = defaults(opts, {
        points: required,
        thickness: 1,
        color: "#000000",
        arrow_head: false
      });
      geometry = new THREE.Geometry();
      _ref = o.points;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        a = _ref[_i];
        geometry.vertices.push(new THREE.Vector3(a[0], a[1], a[2]));
      }
      line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
        color: opts.color,
        linewidth: o.thickness
      }));
      return this.scene.add(line);
    };

    SalvusThreeJS.prototype.add_point = function(opts) {
      var geometry, material, o, p, particle, w;
      o = defaults(opts, {
        loc: [0, 0, 0],
        size: 1,
        color: "#000000",
        sizeAttenuation: false
      });
      material = new THREE.ParticleBasicMaterial({
        color: o.color,
        size: o.size,
        sizeAttenuation: o.sizeAttenuation
      });
      switch (this.opts.renderer) {
        case 'webgl':
          geometry = new THREE.Geometry();
          geometry.vertices.push(new THREE.Vector3(o.loc[0], o.loc[1], o.loc[2]));
          particle = new THREE.ParticleSystem(geometry, material);
          break;
        case 'canvas2d':
          particle = new THREE.Particle(material);
          particle.position.set(o.loc[0], o.loc[1], o.loc[2]);
          if (this._frame_params != null) {
            p = this._frame_params;
            w = Math.min(Math.min(p.xmax - p.xmin, p.ymax - p.ymin), p.zmax - p.zmin);
          } else {
            w = 5;
          }
          particle.scale.x = particle.scale.y = Math.max(50 / this.opts.width, o.size * 5 * w / this.opts.width);
      }
      return this.scene.add(particle);
    };

    SalvusThreeJS.prototype.add_obj = function(myobj, opts) {
      var c, color, face3, face4, face5, geometry, i, item, k, line_width, material, mesh, mk, multiMaterial, name, objects, vertices, wireframeMaterial, _i, _j, _k, _l, _m, _n, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _results;
      vertices = myobj.vertex_geometry;
      _results = [];
      for (objects = _i = 0, _ref = myobj.face_geometry.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; objects = 0 <= _ref ? ++_i : --_i) {
        face3 = myobj.face_geometry[objects].face3;
        face4 = myobj.face_geometry[objects].face4;
        face5 = myobj.face_geometry[objects].face5;
        geometry = new THREE.Geometry();
        for (i = _j = 0, _ref1 = vertices.length - 1; _j <= _ref1; i = _j += 3) {
          geometry.vertices.push(new THREE.Vector3(vertices[i], vertices[i + 1], vertices[i + 2]));
        }
        for (k = _k = 0, _ref2 = face3.length - 1; _k <= _ref2; k = _k += 3) {
          geometry.faces.push(new THREE.Face3(face3[k] - 1, face3[k + 1] - 1, face3[k + 2] - 1));
        }
        for (k = _l = 0, _ref3 = face4.length - 1; _l <= _ref3; k = _l += 4) {
          geometry.faces.push(new THREE.Face3(face4[k] - 1, face4[k + 1] - 1, face4[k + 2] - 1)) + geometry.faces.push(new THREE.Face3(face4[k] - 1, face4[k + 2] - 1, face4[k + 3] - 1));
        }
        for (k = _m = 0, _ref4 = face5.length - 1; _m <= _ref4; k = _m += 5) {
          geometry.faces.push(new THREE.Face3(face5[k] - 1, face5[k + 1] - 1, face5[k + 2] - 1)) + geometry.faces.push(new THREE.Face3(face5[k] - 1, face5[k + 2] - 1, face5[k + 3] - 1)) + geometry.faces.push(new THREE.Face3(face5[k] - 1, face5[k + 3] - 1, face5[k + 4] - 1));
        }
        geometry.mergeVertices();
        geometry.computeCentroids();
        geometry.computeFaceNormals();
        geometry.computeBoundingSphere();
        name = myobj.face_geometry[objects].material_name;
        mk = 0;
        for (item = _n = 0, _ref5 = myobj.material.length - 1; 0 <= _ref5 ? _n <= _ref5 : _n >= _ref5; item = 0 <= _ref5 ? ++_n : --_n) {
          if (name === myobj.material[item].name) {
            mk = item;
            break;
          }
        }
        if (opts.wireframe || myobj.wireframe) {
          if (myobj.color) {
            color = myobj.color;
          } else {
            c = myobj.material[mk].color;
            color = "rgb(" + (c[0] * 255) + "," + (c[1] * 255) + "," + (c[2] * 255) + ")";
          }
          if (typeof myobj.wireframe === 'number') {
            line_width = myobj.wireframe;
          } else if (typeof opts.wireframe === 'number') {
            line_width = opts.wireframe;
          } else {
            line_width = 1;
          }
          material = new THREE.MeshBasicMaterial({
            wireframe: true,
            color: color,
            wireframeLinewidth: line_width
          });
          mesh = new THREE.Mesh(geometry, material);
        } else if (myobj.material[mk] == null) {
          console.log("BUG -- couldn't get material for ", myobj);
          material = new THREE.MeshBasicMaterial({
            wireframe: false,
            color: "#000000",
            overdraw: true,
            polygonOffset: true,
            polygonOffsetFactor: 1,
            polygonOffsetUnits: 1
          });
          mesh = new THREE.Mesh(geometry, material);
        } else {
          material = new THREE.MeshPhongMaterial({
            ambient: 0x0ffff,
            wireframe: false,
            transparent: myobj.material[mk].opacity < 1,
            overdraw: true,
            polygonOffset: true,
            polygonOffsetFactor: 1,
            polygonOffsetUnits: 1
          });
          material.color.setRGB(myobj.material[mk].color[0], myobj.material[mk].color[1], myobj.material[mk].color[2]);
          material.ambient.setRGB(myobj.material[mk].ambient[mk], myobj.material[mk].ambient[1], myobj.material[0].ambient[2]);
          material.specular.setRGB(myobj.material[mk].specular[0], myobj.material[mk].specular[1], myobj.material[mk].specular[2]);
          material.opacity = myobj.material[mk].opacity;
          mesh = new THREE.Mesh(geometry, material);
          wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x222222,
            wireframe: true,
            transparent: true,
            opacity: .2
          });
          multiMaterial = [material, wireframeMaterial];
          mesh = THREE.SceneUtils.createMultiMaterialObject(geometry, multiMaterial);
        }
        mesh.position.set(0, 0, 0);
        _results.push(this.scene.add(mesh));
      }
      return _results;
    };

    SalvusThreeJS.prototype.set_frame = function(opts) {
      var e, eps, geometry, l, material, mx, my, mz, o, offset, txt, v, x, _i, _len, _ref, _ref1,
        _this = this;
      o = defaults(opts, {
        xmin: required,
        xmax: required,
        ymin: required,
        ymax: required,
        zmin: required,
        zmax: required,
        color: this.opts.foreground,
        thickness: .4,
        labels: true,
        fontsize: 14,
        draw: true
      });
      this._frame_params = o;
      eps = 0.1;
      if (Math.abs(o.xmax - o.xmin) < eps) {
        o.xmax += 1;
        o.xmin -= 1;
      }
      if (Math.abs(o.ymax - o.ymin) < eps) {
        o.ymax += 1;
        o.ymin -= 1;
      }
      if (Math.abs(o.zmax - o.zmin) < eps) {
        o.zmax += 1;
        o.zmin -= 1;
      }
      if (this.frame != null) {
        this.scene.remove(this.frame);
        this.frame = void 0;
      }
      if (o.draw) {
        geometry = new THREE.CubeGeometry(o.xmax - o.xmin, o.ymax - o.ymin, o.zmax - o.zmin);
        material = new THREE.MeshBasicMaterial({
          color: o.color,
          wireframe: true,
          wireframeLinewidth: o.thickness
        });
        this.frame = new THREE.BoxHelper(new THREE.Mesh(geometry, material));
        this.frame.position.set(o.xmin + (o.xmax - o.xmin) / 2, o.ymin + (o.ymax - o.ymin) / 2, o.zmin + (o.zmax - o.zmin) / 2);
        this.scene.add(this.frame);
      }
      if (o.labels) {
        if (this._frame_labels != null) {
          _ref = this._frame_labels;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            x = _ref[_i];
            this.scene.remove(x);
          }
        }
        this._frame_labels = [];
        l = function(a, b) {
          var z;
          if (b == null) {
            z = a;
          } else {
            z = (a + b) / 2;
          }
          z = z.toFixed(2);
          return (z * 1).toString();
        };
        txt = function(x, y, z, text) {
          return _this._frame_labels.push(_this.add_text({
            pos: [x, y, z],
            text: text,
            fontsize: o.fontsize,
            color: o.color,
            constant_size: false
          }));
        };
        offset = 0.075;
        mx = (o.xmin + o.xmax) / 2;
        my = (o.ymin + o.ymax) / 2;
        mz = (o.zmin + o.zmax) / 2;
        this._center = new THREE.Vector3(mx, my, mz);
        this.controls.target = this._center;
        if (o.draw) {
          e = (o.ymax - o.ymin) * offset;
          txt(o.xmax, o.ymin - e, o.zmin, l(o.zmin));
          txt(o.xmax, o.ymin - e, mz, "z=" + (l(o.zmin, o.zmax)));
          txt(o.xmax, o.ymin - e, o.zmax, l(o.zmax));
          e = (o.xmax - o.xmin) * offset;
          txt(o.xmax + e, o.ymin, o.zmin, l(o.ymin));
          txt(o.xmax + e, my, o.zmin, "y=" + (l(o.ymin, o.ymax)));
          txt(o.xmax + e, o.ymax, o.zmin, l(o.ymax));
          e = (o.ymax - o.ymin) * offset;
          txt(o.xmax, o.ymax + e, o.zmin, l(o.xmax));
          txt(mx, o.ymax + e, o.zmin, "x=" + (l(o.xmin, o.xmax)));
          txt(o.xmin, o.ymax + e, o.zmin, l(o.xmin));
        }
      }
      v = new THREE.Vector3(mx, my, mz);
      this.camera.lookAt(v);
      this.render_scene();
      return (_ref1 = this.controls) != null ? _ref1.handleResize() : void 0;
    };

    SalvusThreeJS.prototype.add_3dgraphics_obj = function(opts) {
      var o, _i, _len, _ref;
      opts = defaults(opts, {
        obj: required,
        wireframe: false
      });
      _ref = opts.obj;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        o = _ref[_i];
        switch (o.type) {
          case 'text':
            this.add_text({
              pos: o.pos,
              text: o.text,
              color: o.color,
              fontsize: o.fontsize,
              fontface: o.fontface,
              constant_size: o.constant_size
            });
            break;
          case 'index_face_set':
            this.add_obj(o, opts);
            if (o.mesh && !o.wireframe) {
              o.color = '#000000';
              o.wireframe = o.mesh;
              this.add_obj(o, opts);
            }
            break;
          case 'line':
            delete o.type;
            this.add_line(o);
            break;
          case 'point':
            delete o.type;
            this.add_point(o);
            break;
          default:
            console.log("ERROR: no renderer for model number = " + o.id);
            return;
        }
      }
      return this.render_scene(true);
    };

    SalvusThreeJS.prototype.animate = function() {
      var _ref;
      if (this._animate) {
        this._animation_frame = requestAnimationFrame(this.animate);
      } else {
        this._animation_frame = false;
      }
      return (_ref = this.controls) != null ? _ref.update() : void 0;
    };

    SalvusThreeJS.prototype.controlChange = function() {
      if (!this._animation_frame) {
        this._animation_frame = requestAnimationFrame(this.animate);
      }
      return this.render_scene();
    };

    SalvusThreeJS.prototype.render_scene = function() {
      return this.renderer.render(this.scene, this.camera);
    };

    return SalvusThreeJS;

  })();

  $.fn.salvus_threejs = function(opts) {
    if (opts == null) {
      opts = {};
    }
    return this.each(function() {
      var e, elt;
      elt = $(this);
      e = $(".salvus-3d-templates .salvus-3d-viewer").clone();
      elt.empty().append(e);
      opts.element = e;
      return elt.data('salvus-threejs', new SalvusThreeJS(opts));
    });
  };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.run_when_defined = run_when_defined;

}).call(this);
