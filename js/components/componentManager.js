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
// 全局管理所有component
const componentManager = {
    instances: new Map(),

    addInstance: function(className, name, instance) {
        if(!this.instances.has(className)){
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

    getInstanceList(itemType, className){
        if(this.instances.has(itemType)){
            console.log("hello");
            return this.instances.get(itemType).get(className);
        }else{
            return null;
        }
    },

    // 获取某个类名下的实例
    getInstance: function(itemType, className, name) {
        if(this.instances.has(itemType)){
            if (this.instances.get(itemType).has(className)) {
                return this.instances.get(itemType).get(className).get(name);
            }
        }
        return null;
    },
  
    startAllObjects() {
        this.instances.forEach(itemMap => {
            itemMap.forEach(classMap => {
                classMap.forEach(instance => {
                  // 检查实例是否有 startFlight 函数
                  if (typeof instance.startFlight === 'function') {
                    instance.startFlight();  // 调用 startFlight 函数
                  }
                });
            });
        });
    },

    startAllRadars(){
        this.instances.forEach(itemMap => {
            itemMap.forEach(classMap => {
                classMap.forEach(instance => {
                if (typeof instance.startScan === 'function') {
                  instance.startScan();  
                  }
                });
            });
        });
    },
    stopAllObjects() {
        this.instances.forEach(itemMap => {
            itemMap.forEach(classMap => {
                classMap.forEach(instance => {
                if (typeof instance.stopFlight === 'function') {
                  instance.stopFlight();
                }
            });
        });
    });
},
    stopAllRadars(){
        this.instances.forEach(itemMap => {
            itemMap.forEach(classMap => {
                classMap.forEach(instance => {
                if (typeof instance.stopScan === 'function') {
                  instance.stopScan();
                }
            });
        });
    });
},
    returnAllObjects(){
        this.instances.forEach(itemMap => {
            itemMap.forEach(classMap => {
                classMap.forEach(instance => {
                if (typeof instance.backToStart === 'function') {
                  instance.backToStart();
                }
            });
        });
    });
},
};