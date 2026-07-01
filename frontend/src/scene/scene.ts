import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { LoadingTracker } from "./loading-tracker.ts";

// Three.js scene setup for the avatar
function setupScene() {
    // Creates a tracker instance
    const tracker = new LoadingTracker();

    // Setsup the body type variables to null for now
    const bodyTypeMeshes = {
        BodyTypeBoth: null as any,
        BodyType1: null as any,
        BodyType2: null as any,
    }

    // Stores loaded equipment mesh references so other setup functions can use them
    const equipmentMeshes = {
        helmetElvenTypeBoth: null as any,
        helmetElvenType1: null as any,
        helmetElvenType2: null as any,
        helmetGladiatorTypeBoth: null as any,
        helmetGladiatorType1: null as any,
        helmetGladiatorType2: null as any,
    }

    // Registers all models that need to be loaded
    tracker.register('bodyTypeBoth');
    tracker.register('bodyType1');
    tracker.register('bodyType2');
    tracker.register('helmetElvenTypeBoth');
    tracker.register('helmetElvenType1');
    tracker.register('helmetElvenType2');
    tracker.register('helmetGladiatorTypeBoth');
    tracker.register('helmetGladiatorType1');
    tracker.register('helmetGladiatorType2');


    // Creates a scene, camera, and renderer
    const scene = new THREE.Scene();

    // Adds background color and fog to the scene
    scene.background = new THREE.Color(0x2a2a2a);
    scene.fog = new THREE.Fog(0x1a1a1a, 10, 50);

    // Adds soft ambient lighting to illuminate the entire scene evenly
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Creates the main key light with shadow casting and fine-tuned shadow parameters for primary illumination
    const keyLight = new THREE.DirectionalLight(0xfff4e6, 1.2);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 50;
    keyLight.shadow.bias = -0.0001;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    // Adds a cooler fill light from the side to soften shadows and add depth to the avatar
    const fillLight = new THREE.DirectionalLight(0xe6f0ff, 0.5);
    fillLight.position.set(-5, 3, -2);
    scene.add(fillLight);

    // Adds a rim light from behind to create edge highlights and separation from the background
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
    rimLight.position.set(0, 5, -5);
    scene.add(rimLight);

    // Creates a transparent ground plane to receive shadows beneath the avatar
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.3 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    // Creates a perspective camera with a 75-degree field of view matching the window aspect ratio
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Creates a WebGL renderer with antialiasing and transparency enabled for smoother visuals
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });

    // Configures the renderer with filmic tone mapping and soft shadow mapping for improved realism
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    // Selects the avatar container element from the DOM
    const avatarDiv = document.querySelector('.avatar');

    // Sets the renderer size to match the container and appends the canvas to the DOM
    if (avatarDiv) {
        renderer.setSize(avatarDiv.clientWidth, avatarDiv.clientHeight);
        avatarDiv.appendChild(renderer.domElement);
    }

    // Creates orbit controls to allow camera rotation and zoom around the avatar
    const controls = new OrbitControls(camera, renderer.domElement);

    // Sets the camera focus point and enables smooth damping for fluid camera movement
    controls.target.set(0, 2, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Creates a GLTF loader to load 3D models into the scene
    const loader = new GLTFLoader();

    // Loads the combined avatar model from the file path
    loader.load(
        // Credit to:
        // "PLANAR HUMAN BASE RIGS" by dacancino
        // https://skfb.ly/6rG8x
        // Licensed under Creative Commons Attribution (CC BY 4.0)
        '/assets/models/avatars/body-type-both.glb',
        (gltf: { scene: any; }) => {
            // Adds the loaded combined avatar model to the scene
            bodyTypeMeshes.BodyTypeBoth = gltf.scene;

            // Enables shadow casting and receiving for all mesh children in the loaded combined avatar model
            bodyTypeMeshes.BodyTypeBoth.traverse((child: any) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            // Adds the shadow-enabled combined avatar model to the scene and marks it as loaded
            scene.add(bodyTypeMeshes.BodyTypeBoth);
            tracker.markAsLoaded('bodyTypeBoth');
        }
    );

    // Loads the body type 1 avatar model from the file path
    loader.load(
        // Credit to:
        // "PLANAR HUMAN BASE RIGS" by dacancino
        // https://skfb.ly/6rG8x
        // Licensed under Creative Commons Attribution (CC BY 4.0)
        '/assets/models/avatars/body-type-1.glb',
        (gltf: { scene: any; }) => {
            // Adds the loaded body type 1 avatar model to the scene
            bodyTypeMeshes.BodyType1 = gltf.scene;

            // Enables shadow casting and receiving for all mesh children in the loaded body type 1 avatar model
            bodyTypeMeshes.BodyType1.traverse((child: any) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            // Makes the body type 1 avatar model invisible initially
            bodyTypeMeshes.BodyType1.visible = false

            // Adds the shadow-enabled body type 1 avatar model to the scene and marks it as loaded
            scene.add(bodyTypeMeshes.BodyType1);
            tracker.markAsLoaded('bodyType1');
        }
    );

    // Loads the body type 2 avatar model from the file path
    loader.load(
        // Credit to:
        // "PLANAR HUMAN BASE RIGS" by dacancino
        // https://skfb.ly/6rG8x
        // Licensed under Creative Commons Attribution (CC BY 4.0)
        '/assets/models/avatars/body-type-2.glb',
        (gltf: { scene: any; }) => {
            // Adds the loaded body type 2 avatar model to the scene
            bodyTypeMeshes.BodyType2 = gltf.scene;

            // Enables shadow casting and receiving for all mesh children in the loaded body type 2 avatar model
            bodyTypeMeshes.BodyType2.traverse((child: any) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            // Makes the body type 2 avatar model invisible initially
            bodyTypeMeshes.BodyType2.visible = false

            // Adds the shadow-enabled body type 2 avatar model to the scene and marks it as loaded
            scene.add(bodyTypeMeshes.BodyType2);
            tracker.markAsLoaded('bodyType2');
        }
    );

    // Loads the helmet elven type both model from the file path
    loader.load(
        // Credit to:
        // "Elven Helmet for games" by Mads.Stenberg
        // https://skfb.ly/6XsNs
        // Licensed under Creative Commons Attribution (CC BY 4.0).
        '/assets/models/arelith/helmet/helmet-elven-type-both.glb',
        (gltf: { scene: any; }) => {
            // Assigns the main loaded helmet mesh
            equipmentMeshes.helmetElvenTypeBoth = gltf.scene;

            // Enables shadow casting and receiving for all mesh children in the loaded combined avatar model
            equipmentMeshes.helmetElvenTypeBoth.traverse((child: any) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            // Makes the helmets invisible
            equipmentMeshes.helmetElvenTypeBoth.visible = false;

            // Inserts the tracking helmet instance directly into the active root scene
            scene.add(equipmentMeshes.helmetElvenTypeBoth);

            // Finalizes the load cycle tracking process for the helmet assets component group
            tracker.markAsLoaded('helmetElvenTypeBoth');
        }
    )

    // Loads the helmet elven type 1 from the file path
    loader.load(
        // Credit to:
        // "Elven Helmet" by Sylvain Delandre
        // https://skfb.ly/pGZxF
        // Licensed under Creative Commons Attribution (CC BY 4.0).
        '/assets/models/arelith/helmet/helmet-elven-type-1.glb',
        (gltf: { scene: any; }) => {
            // Assigns the main loaded helmet mesh
            equipmentMeshes.helmetElvenType1 = gltf.scene;

            // Enables shadow casting and receiving for all mesh children in the loaded helmet elven type 1 avatar model
            equipmentMeshes.helmetElvenType1.traverse((child: any) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            // Makes the helmets invisible
            equipmentMeshes.helmetElvenType1.visible = false;

            // Inserts the tracking helmet instance directly into the active root scene
            scene.add(equipmentMeshes.helmetElvenType1);

            // Finalizes the load cycle tracking process for the helmet assets component group
            tracker.markAsLoaded('helmetElvenType1');
        }
    )

    // Loads the helmet elven type 2 from the file path
    loader.load(
        // Credit to:
        // "Elven Helmet for games" by Mads.Stenberg
        // https://skfb.ly/6XsNs
        // Licensed under Creative Commons Attribution (CC BY 4.0).
        '/assets/models/arelith/helmet/helmet-elven-type-2.glb',
        (gltf: { scene: any; }) => {
            // Assigns the main loaded helmet mesh
            equipmentMeshes.helmetElvenType2 = gltf.scene;

            // Enables shadow casting and receiving for all mesh children in the loaded helmet elven type 2 avatar model
            equipmentMeshes.helmetElvenType2.traverse((child: any) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            // Makes the helmets invisible
            equipmentMeshes.helmetElvenType2.visible = false;

            // Inserts the tracking helmet instance directly into the active root scene
            scene.add(equipmentMeshes.helmetElvenType2);

            // Finalizes the load cycle tracking process for the helmet assets component group
            tracker.markAsLoaded('helmetElvenType2');
        }
    )

    // Loads the helmet gladiator type both model from the file path
    loader.load(
        // Credit to:
        // "Gladiator Helmet" by Sylvain Delandre
        // https://skfb.ly/pGZxF
        // Licensed under Creative Commons Attribution (CC BY 4.0).
        '/assets/models/arelith/helmet/helmet-gladiator-type-both.glb',
        (gltf: { scene: any; }) => {
            // Assigns the main loaded helmet mesh
            equipmentMeshes.helmetGladiatorTypeBoth = gltf.scene;

            // Enables shadow casting and receiving for all mesh children in the loaded combined avatar model
            equipmentMeshes.helmetGladiatorTypeBoth.traverse((child: any) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            // Makes the helmets invisible
            equipmentMeshes.helmetGladiatorTypeBoth.visible = false;

            // Inserts the tracking helmet instance directly into the active root scene
            scene.add(equipmentMeshes.helmetGladiatorTypeBoth);

            // Finalizes the load cycle tracking process for the helmet assets component group
            tracker.markAsLoaded('helmetGladiatorTypeBoth');
        }
    )

    // Loads the helmet gladiator type 1 from the file path
    loader.load(
        // Credit to:
        // "Gladiator Helmet" by Sylvain Delandre
        // https://skfb.ly/pGZxF
        // Licensed under Creative Commons Attribution (CC BY 4.0).
        '/assets/models/arelith/helmet/helmet-gladiator-type-1.glb',
        (gltf: { scene: any; }) => {
            // Assigns the main loaded helmet mesh
            equipmentMeshes.helmetGladiatorType1 = gltf.scene;

            // Enables shadow casting and receiving for all mesh children in the loaded helmet gladiator type 1 avatar model
            equipmentMeshes.helmetGladiatorType1.traverse((child: any) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            // Makes the helmets invisible
            equipmentMeshes.helmetGladiatorType1.visible = false;

            // Inserts the tracking helmet instance directly into the active root scene
            scene.add(equipmentMeshes.helmetGladiatorType1);

            // Finalizes the load cycle tracking process for the helmet assets component group
            tracker.markAsLoaded('helmetGladiatorType1');
        }
    )

    // Loads the helmet gladiator type 2 from the file path
    loader.load(
        // Credit to:
        // "Gladiator Helmet" by Sylvain Delandre
        // https://skfb.ly/pGZxF
        // Licensed under Creative Commons Attribution (CC BY 4.0).
        '/assets/models/arelith/helmet/helmet-gladiator-type-2.glb',
        (gltf: { scene: any; }) => {
            // Assigns the main loaded helmet mesh
            equipmentMeshes.helmetGladiatorType2 = gltf.scene;

            // Enables shadow casting and receiving for all mesh children in the loaded helmet gladiator type 2 avatar model
            equipmentMeshes.helmetGladiatorType2.traverse((child: any) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            // Makes the helmets invisible
            equipmentMeshes.helmetGladiatorType2.visible = false;

            // Inserts the tracking helmet instance directly into the active root scene
            scene.add(equipmentMeshes.helmetGladiatorType2);

            // Finalizes the load cycle tracking process for the helmet assets component group
            tracker.markAsLoaded('helmetGladiatorType2');
        }
    )

    // Moves the camera back a bit
    camera.position.z = 5;

    // Positions the camera at an offset and angles it to focus on the avatar's upper body
    camera.position.set (0, 3, 5);
    camera.lookAt(1.2, 2, 0);

    // Orbit controls are updated and then renders the scene
    function animate() {
        controls.update();
        renderer.render(scene, camera);
    }

    // Animates the scene
    renderer.setAnimationLoop(animate);

    // Returns the scene, camera, renderer, and tracker so main.ts can use them
    return { scene, camera, renderer, tracker, bodyTypeMeshes, equipmentMeshes };
}

export { setupScene }