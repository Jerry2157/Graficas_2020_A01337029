console.log("init morph_tarjet.js");
var renderer = null, 
scene = null,raycaster,
camera = null,
root = null,
robot_idle = null,
group = null,
orbitControls = null;
var game = false;
var mouse = new THREE.Vector2(), INTERSECTED, CLICKED;
var counter = 0;
var actualTime = 0;
var high_score = 0;
var animator = null;
var duration1 = 1;
var loopAnimation = false;
var robots = [];
var score = 0;
var duration = 20000; // ms
var currentTime = Date.now();
var x_max = 50;
var x_min =-50;
var max_num_robots = 25;
var animation = "idle";


function initAnimations() 
{
    animator = new KF.KeyFrameAnimator;
    animator.init({ 
        interps:
            [
                { 
                    keys:[0, .30, .60, 1], 
                    values:[
                            { x: Math.PI, y : Math.PI, z : 0 },
                            { x:Math.PI/6, y : -Math.PI/7, z : 0 },
                            { x:Math.PI/6 * 2, y : -Math.PI/7 *2, z : 0},
                            { x:Math.PI/6 * 3, y : -Math.PI/7 *3, z : 0 },
                            ],
                },
            ],
        loop: loopAnimation,
        duration1:duration,
    });
}

function playAnimations()
{
    animator.start();
}

function startGame()
{

    if(high_score<score)
    {
         high_score = score;
    }
        
    document.getElementById("high_score").innerHTML = "mejor puntaje: " + high_score + ".";
    minutes_left = 0
    gameStarted = Date.now();
    actualTime = Date.now();
    actualTime2 = Date.now();
    score = 0;
    names = 0;
    robotsSpawned = 0;
    document.getElementById("time").innerHTML = 60 + " seg.";
    document.getElementById("score").innerHTML = "puntaje: " + score + ".";
    document.getElementById("startButton").style.display="none";
    document.getElementById("startButton").disabled = true;
    

    game = true;
    
}
function changeAnimation(animation_text)
{
    animation = animation_text;

    if(animation =="dead")
    {
    }
    else
    {
        robot_idle.rotation.x = Math.PI;
    }
}


function loadFBX()
{
    mixer = new THREE.AnimationMixer( scene );

    var loader = new THREE.FBXLoader();
    loader.load( 'models/Robot/robot_walk.fbx', function ( object )
    {
        object.mixer = new THREE.AnimationMixer( scene );
        var action = object.mixer.clipAction( object.animations[ 0 ], object );
        object.scale.set(0.02, 0.02, 0.02);
        object.rotation.set(Math.PI,Math.PI,0);
        object.position.set(Math.random() * (x_max - x_min) + x_min, -100, -300);
        action.play();
        object.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        } );
        robot = object;
        robots.push(robot);
        scene.add( object );
        createDeadAnimation();

    } );
}
function clone (name)
{
    var newRobot = cloneFbx(robot);
    newRobot.position.set(Math.random() * (x_max - x_min) + x_min, -4, -100);
    newRobot.rotation.set(Math.PI,Math.PI,0);
    newRobot.mixer =  new THREE.AnimationMixer(scene);
    var action = newRobot.mixer.clipAction( newRobot.animations[ 0 ], newRobot );
    action.play();
    newRobot.name = name;
    newRobot.living = 1;
    newRobot.dead = 0;
    robots.push(newRobot);
    scene.add(newRobot);
}

function animate() {

    var now = Date.now();
    var deltat = now - currentTime;
    var finish = now - gameStarted;
    currentTime = now;
   
    var seconds = (now - actualTime)/1000


    if (seconds >= 0.5 )
    {
        if ( counter < max_num_robots) 
        {
                counter += 1;
                clone(counter);
                actualTime = now; 
                console.log(robots.length)   
        }
    }

    if ( robots.length > 0) 
    {
        for(robot_i of robots)
        {
            if(robot_i.living==1)
            {
                robot_i.lookAt(camera.position);
                robot_i.translateZ(.1);
                robot_i.position.y = -4 ;   
                robot_i.mixer.update( ( deltat ) * 0.001 );
                robot_i.rotation.x = Math.PI;
                robot_i.rotation.y = Math.PI;

            } 
            else if (robot_i.living==0) 
            {
                var seconds2 = (now - robot_i.dead)/1000
                if (seconds2 >= 1 )
                {
                    score ++;
                    document.getElementById("score").innerHTML = "puntaje: " +score;
                    robot_i.position.set(Math.random() * (x_max - x_min) + x_min, -4, -100);
                    
                    robot_i.mixer.update( ( deltat ) * 0.001 ); 
                    robot_i.living=1; 
                }
                
            }
            if(robot_i.position.z >= camera.position.z-5)
            {  
                    score --;
                    robot_i.position.set(Math.random() * 100 - 10, -4, -100); 
                    robot_i.mixer.update( ( deltat ) * 0.001 ); 
                    document.getElementById("score").innerHTML = "score: " +score;
                
            }
        }
    
    }
    if(finish>1000)
    {
        gameStarted = now;
        minutes_left+=1;
        document.getElementById("time").innerHTML = 60-minutes_left+ " seg";
        if(minutes_left==60)
        {
            document.getElementById("startButton").style.display="block";
            document.getElementById("startButton").disabled = false;
            game=false;
            for(robot_i of robots)
            {
                scene.remove(robot_i); 

            }
            robots.splice(1, robots.length-1)
            counter = 0;
            
        }
    }
    
    if(animation =="dead")
    {
        KF.update();
    }
}
function run() 
{
    requestAnimationFrame(function() { run(); });
        // Render the scene
        renderer.render( scene, camera );

        if(game)
        {
            animate();
            KF.update();
        }
}

var directionalLight = null;
var spotLight = null;
var ambientLight = null;
var mapUrl = "models/floor.jpg";

var SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;

function createScene(canvas) {
    
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Turn on shadows
    renderer.shadowMap.enabled = true;
    // Options are THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    // camera.position.set(0, 150, 180);
    camera.position.set(0, 3, 95);

    //camera.rotation.set(0,0,0);
    scene.add(camera);

        
    // Create a group to hold all the objects
    root = new THREE.Object3D;
    
    // Add a directional light to show off the object
    directionalLight = new THREE.DirectionalLight( 0xffffff, 1);

    // Create and add all the lights
    directionalLight.position.set(-15, 0, -10);
    directionalLight.castShadow = true;
    directionalLight.rotation.x = Math.PI/2;
    directionalLight.rotation.z = 90 * Math.PI / 180;
    
    root.add(directionalLight);

    ambientLight = new THREE.AmbientLight ( 0xffffff, 0.8);
    root.add(ambientLight);
    loadFBX();

    // Create a group to hold the objects
    group = new THREE.Object3D;
    root.add(group);

    // Create a texture map
    var map = new THREE.TextureLoader().load(mapUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(8, 8);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));

    mesh.rotation.x = Math.PI / 2;
    mesh.position.y = -7.02;
    
    // Add the mesh to our group
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    group.add( mesh );
    // Now add the group to our scene
    scene.add( root );

    raycaster = new THREE.Raycaster();
        
    // document.addEventListener( 'mousemove', onDocumentMouseMove );
    document.addEventListener('mousedown', onDocumentMouseDown);
    
    window.addEventListener( 'resize', onWindowResize);
    initAnimations();
}

function onWindowResize() 
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
function onDocumentMouseDown(event)
{
    event.preventDefault();

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );

    var intersects = raycaster.intersectObjects( robots, true );

    if ( intersects.length > 0 ) 
    {
        CLICKED = intersects[ 0 ].object;
        if(!animator.running)
        {
            for(var i = 0; i<= animator.interps.length -1; i++)
            {
                console.log("rotation", robots[CLICKED.parent.name].rotation);
                animator.interps[i].target = robots[CLICKED.parent.name].rotation;
                robots[CLICKED.parent.name].living = 0;
                robots[CLICKED.parent.name].dead = Date.now();
            
            }
            
            playAnimations();
        }
    } 
    else 
    {
        if ( CLICKED ) 
            CLICKED.material.emissive.setHex( CLICKED.currentHex );

        CLICKED = null;
    }
}
