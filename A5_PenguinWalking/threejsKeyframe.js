var renderer = null, 
scene = null, 
camera = null,
root = null,
group = null,
penguin = null,
snow = null,
directionalLight = null;
var objLoader = null;

var duration = 10;
loopAnimation = true;

var snow_tex = "snow_texture.jpg";

function run()
{
    requestAnimationFrame(function() { run(); });
    
        // Render the scene
        renderer.render( scene, camera );

        // Update the animations
        KF.update();

        // Update the camera controller
        orbitControls.update();
}


function loadObj()
{
    if(!objLoader)
        objLoader = new THREE.OBJLoader();
    
    objLoader.load(
        'Penguin_obj/PenguinBaseMesh.obj',

        function(object)
        {
            var texture = new THREE.TextureLoader().load('Penguin_obj/Penguin_Diffuse_Color.png');

            object.traverse( function ( child ) 
            {
                if ( child instanceof THREE.Mesh ) 
                {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material.map = texture;
                }
            } );
                    
            pivot = object;
            pivot.scale.set(5,5,5);
            pivot.rotation.set(0,.15,0);
            pivot.position.z = 0;
            pivot.position.x = 1;
            pivot.position.y = -1.7;
            
            penguin.add(pivot);
            scene.add(penguin);
        },
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    
        },
        // called when loading has errors
        function ( error ) {
    
            console.log( 'An error happened' );
    
        });
}

function createScene(canvas) 
{
    
    const { width, height } = getWidthAndHeight();
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    canvas.height=height;
    renderer.setSize(width, height);
    
    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, width /height, 1, 4000 );
    camera.position.set(0, 2, 20);
    scene.add(camera);
    
    // Create a group to hold all the objects
    root = new THREE.Object3D;
    
    // Add a directional light to show off the object
    directionalLight = new THREE.DirectionalLight( 0xffffff, 1);

    // Create and add all the lights
    directionalLight.position.set(0, 1, 2);
    root.add(directionalLight);

    ambientLight = new THREE.AmbientLight ( 0x888888 );
    root.add(ambientLight);
    
    // Create a group to hold the objects
    group = new THREE.Object3D;
    penguin= new THREE.Object3D;
    root.add(group);

    // Create a texture map
    var snowMap = new THREE.TextureLoader().load(snow_tex);
    snowMap.wrapS = snowMap.wrapT = THREE.RepeatWrapping;
    snowMap.repeat.set(10, 10);

    var color = 0xffffff;
    var ambient = 0x888888;
    
    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    snow = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:snowMap, side:THREE.DoubleSide}));
    snow.receiveShadow = true;
    snow.rotation.x = -Math.PI / 2;
    snow.position.y = 0;
    
    // Add the snow to our group
    root.add( snow );

    
    // Now add the group to our scene
    scene.add( root );

    loadObj();
    // Create a group to hold the objects
    group = new THREE.Object3D;
    root.add(group);

}

function playAnimations()
{


    penguinAnimator = new KF.KeyFrameAnimator;
    penguinAnimator.init({ 
            interps:
                [
                    { 
                        keys:[0,.05,.10,.20,.25,.3,.35,.40,.5,.55,.6,.65,.70,.80,.85,.90,.95,1],
                        values:[
                                { x : 0, y:1.7, z: 0 },
                                { x : 1, y:1.8, z: 1 },
                                { x : 2, y:1.7, z: 2 },
                                { x : 1, y:1.8, z: 3 },
                                { x : 0, y:1.7, z: 4 },
                                { x : -1, y:1.8, z: 3 },
                                { x : -2, y:1.7, z: 2 },
                                { x : -1, y:1.8, z: 1 },
                                { x : 0, y:1.7, z: 0 },
                                { x : 1, y:1.8, z: -1 },
                                { x : 2, y:1.7, z: -2 },
                                { x : 1, y:1.8, z: -3 },
                                { x : 0, y:1.7, z: -4 },
                                { x : -1, y:1.8, z: -3 },
                                { x : -2, y:1.7, z: -2 },
                                { x : -1, y:1.8, z: -1 },
                                { x : 0, y:1.7, z: -0 }


                                ],
                        target:penguin.position
                    },
                    {
                        keys:[0,.05,.10,.20,.25,.3,.35,.40,.5,.55,.6,.65,.70,.80,.85,.90,.95,1], 
                        values:[
                                { y: Math.PI*8 / 2, z: .1 },
                                { y: Math.PI*8 / 2, z:-.1 },
                                { y: Math.PI*8 / 2, z: .1 },
                                { y: Math.PI*7 / 2, z:-.1 },
                                { y: Math.PI*7 / 2, z: .1 },
                                { y: Math.PI*6 / 2, z:-.1 },
                                { y: Math.PI*6 / 2, z: .1 },
                                { y: Math.PI*6 / 2, z:-.1 },
                                { y: Math.PI*6 / 2, z: .1 }, //half
                                { y: Math.PI*6 / 2, z:-.1 },
                                { y: Math.PI*6 / 2, z: .1 },
                                { y: Math.PI*7 / 2, z:-.1 },
                                { y: Math.PI*7 / 2, z: .1 },
                                { y: Math.PI*7 / 2, z:-.1 },
                                { y: Math.PI*8 / 2, z: .1 },
                                { y: Math.PI*8 / 2, z:-.1 },
                                { y: Math.PI*8 / 2, z: .1 }
                                ],
                        target:penguin.rotation
                    },
                ],
            loop: loopAnimation,
            duration:duration * 1000
        });
        penguinAnimator.start();

    directionalLight.color.setRGB(1, 1, 1);

    lightAnimator = new KF.KeyFrameAnimator;
    lightAnimator.init({ 
        interps:
            [
                { 
                    keys:[0, .4, .6, .7, .8, 1], 
                    values:[
                        { r: 1, g : 1, b: 1 },
                        { r: 0.66, g : 0.66, b: 0.66 },
                        { r: .333, g : .333, b: .333 },
                        { r: 0, g : 0, b: 0 },
                        { r: .667, g : .667, b: .667 },
                        { r: 1, g : 1, b: 1 },
                        ],
                    target:directionalLight.color
                },
            ],
        loop: loopAnimation,
        duration:duration * 1000,
    });
    lightAnimator.start();
}


function getWidthAndHeight() {
    const width = $(window).width();
    const height = $(window).height();
    return { width, height };
  }
  