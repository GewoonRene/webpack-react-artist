import React, { Component } from 'react';
import { WebGLRenderer, PerspectiveCamera, Scene, PCFSoftShadowMap, Fog } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import TerrainModel from '../../assets/models/terrain.gltf';
import EaselModel from '../../assets/models/easel.gltf';

import { LoadModel } from '../../components/scene-loader/SceneLoader';
import SceneRenderer from '../../components/scene-renderer/SceneRenderer';

import { Terrain, Cube } from '../../components/scene-subjects/SceneSubjects';
import { Light, Ambient } from '../../components/scene-lighting/SceneLights';


export default class SceneManager
extends Component {

    constructor(props) {
        super(props);
        this.state = {
            aspect: this.props.width / this.props.height,
            height: this.props.height,
            width: this.props.width
        };

        this.componentStartRender = this.componentStartRender.bind(this);
        this.componentAddSubjects = this.componentAddSubjects.bind(this);
        this.componentLoadSubjects = this.componentLoadSubjects.bind(this);
        this.componentOnResize = this.componentOnResize.bind(this);

        this.userMouseMoveHandler = this.componentOnResize.bind(this);
    }

    componentDidMount() {
        // Initialize Scene
        this.scene = new Scene();
        this.scene.fog = new Fog('#242424', 5, 15)

        // Initialize Camera
        this.camera = new PerspectiveCamera( 75, this.state.aspect, 1, 1000);
        this.camera.position.set(1,4.5,2.5); 
        this.camera.lookAt(this.scene.position);
        this.scene.add(this.camera);

        // Initialize Renderer
        this.renderer = new WebGLRenderer({ antialias: false }); // true on production
        this.renderer.setClearColor( '#242424' );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize(this.state.width, this.state.height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = PCFSoftShadowMap;
        
        // Initialize Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.minDistance = 5;
        this.controls.maxDistance = 6;
        this.controls.enablePan = false;

        // Start Renderer
        this.componentLoadSubjects();
        this.mount.appendChild(this.renderer.domElement);
        this.controls.update();

        this.componentStartRender();

        // Event Listeners
        window.addEventListener('resize', this.componentOnResize, false);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.componentOnResize, true);
    }

    componentAddSubjects() {
        const sceneSubjects = [

            // Objects
            new LoadModel( this.scene,
                EaselModel,
                { x: 0, y: 0, z: -1, r: 360 }
            ),

            // // Enviroment
            new LoadModel( this.scene,
                TerrainModel,
                { x: 0, y: 0, z: 0, r: 95 }
            ),
            
            new Light(this.scene),
            new Ambient(this.scene),
            new Terrain(this.scene),

            // Debugging
            // new Cube(this.scene),
        ];

        return sceneSubjects;   
    }

    componentLoadSubjects() {
        this.sceneSubjects = this.componentAddSubjects();
        // for ( let i = 0; i < this.sceneSubjects.length; i++ ) {
        //     this.sceneSubjects[i].update(this.scene);
        // }

        // Start Rendering
        this.renderer.render(this.scene, this.camera);
    }

    componentStartRender() {
        this.controls.update();
        requestAnimationFrame( this.componentStartRender );
        this.renderer.render(this.scene, this.camera);

    }

    componentOnResize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight, true);
        this.camera.updateProjectionMatrix();
        this.camera.aspect = window.innerWidth / window.innerHeight;
    }

    render() {
        return <SceneRenderer render={ (mount) => { this.mount = mount } } title="episode 1"></SceneRenderer>
    }

}