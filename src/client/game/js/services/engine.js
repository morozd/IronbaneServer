/*
    This file is part of Ironbane MMO.

    Ironbane MMO is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Ironbane MMO is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Ironbane MMO.  If not, see <http://www.gnu.org/licenses/>.
*/
angular.module('IronbaneGame')
    .constant('VECTOR_UNIT', new THREE.Vector3(1, 1, 1))
    .constant('VECTOR_UNITX', new THREE.Vector3(1, 0, 0))
    .constant('VECTOR_UNITY', new THREE.Vector3(0, 1, 0))
    .constant('VECTOR_UNITZ', new THREE.Vector3(0, 0, 1))
    // should this be elsewhere?
    .constant('PREVIEW', {
        position: new THREE.Vector3(0, 10, 0),
        distance: 15,
        height: 5,
        speed: 200
    })
    .factory('GameEngine', ['$log', '$window', 'World', 'DAY_TIME', 'PREVIEW', 'InputService', 'InputAction',
    function($log, $window, World, dayTime, PREVIEW, Input, InputAction) {
        var animate = function(game) {
            requestAnimationFrame(function() {
                animate(game);
            });

            game.tick();
            game.render();
        };

        var Engine = Class.extend({
            init: function() {

                // for now config some input here
                Input.addAction(new InputAction('walk', ['W', 'Up'], 'keyboard', 'walk forward'));
                Input.addAction(new InputAction('chat', 'Enter', 'keyboard', 'open chat to speak'));

            },
            start: function(el) {
                this.input = Input;

                this.scene = new THREE.Scene();

                this.octree = new THREE.Octree();

                this.camera = new THREE.PerspectiveCamera(75, $window.innerWidth / $window.innerHeight, 0.1, 100000);
                this.camera.position.set(0, 3, 0);

                this.scene.add(this.camera);

                this.clock = new THREE.Clock();

                this.projector = new THREE.Projector();

                this.renderer = new THREE.WebGLRenderer({
                    antialias: false,
                    maxLights: 20
                });
                this.renderer.setClearColor('#000');

                this.world = new World();
                this.world.addToScene(this.scene);

                this.renderer.setSize($window.innerWidth, $window.innerHeight);
                el.append(this.renderer.domElement);

                animate(this);
            },
            tick: function() {
                var dTime = this.clock.getDelta();

                // preview spin
                this.camera.position.x = PREVIEW.position.x + (Math.cos(Date.now() / 20000) * PREVIEW.distance) - 0;
                this.camera.position.y = PREVIEW.position.y + PREVIEW.height;
                this.camera.position.z = PREVIEW.position.z + (Math.sin(Date.now() / 20000) * PREVIEW.distance) - 0;
                this.camera.lookAt(PREVIEW.position);

                this.world.tick(dTime);
                this.input.tick(dTime);

                if(this.input.actionPressed('chat')) {
                    $log.log('chat pressed!');
                }

                if(this.input.actionPressed('walk')) {
                    $log.log('walk pressed!');
                }
            },
            render: function() {
                this.renderer.render(this.scene, this.camera);
            },
            getGameTime: function() {
                var time = Date.now();
                var tod = (((time / 1000.0)) * 3.6 * 100 / dayTime) % 360;

                return tod;
            }
        });

        return Engine;
    }
]);