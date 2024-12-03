// componentManager.js
/**                     className:String          name:String          instance:Airplane(Component)
 * componentManager  -| airplaneDeliver     -| airplaneDeliver_00
 *                                          -| airplaneDeliver_01
 *
 *                   -| airplaneFighter
 *                   -| airplaneHelicopter
 *                   ***
 *                   -|
 *
 *
 * */

const componentManager = {
    instances: new Map(),

    addInstance: function(className, name, instance) {
        if(this.instances.get(className) === null){
            this.instances.set(className, new Map);
        }
        this.instances.get(className).set(name, instance);
    },

    clearAllInstances: function() {
        this.instances.forEach((classMap, className) => {
            // 对于每个类名，遍历其对应的实例
            classMap.forEach((instance, name) => {
                if (typeof instance.delete === 'function') {
                    instance.delete();  // 如果实例有 delete 方法，调用它
                }
            });
            // 清空该类的所有实例
            classMap.clear();
        });
        // 清空所有类名映射
        this.instances.clear();
    },

    // 获取某个类名下的实例
    getInstance: function(className, name) {
        if (this.instances.has(className)) {
            return this.instances.get(className).get(name);
        }
        return null;
    }
};