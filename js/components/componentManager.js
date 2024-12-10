// componentManager.js
/**                  type           className:String          name:String          instance:Airplane(Component)
 * componentManager  airplane       -| airplaneDeliver     -| airplaneDeliver_00
 *                                                         -| airplaneDeliver_013a
 *
 *                                  -| airplaneFighter
 *                                  -| airplaneHelicopter
 *                   ***
 *                   -|
 *
 *
 * */
const componentManager = {
    init() {
        // 用于存储每个 className 下的实例
        this.instances = new Map();
        // this.components, deletedIndexes, nextIndex 用于维护组件的名称，保证所有组件的名称按递增顺序自然增长
        this.components = [];
        this.deletedIndexes = [];  // 用于记录已删除组件的位置
        this.nextIndex = 1;  // 初始组件名称从1开始


        this.instances.set("radar", new Map());
        this.instances.set("object", new Map());
        this.instances.set("reconnaissance", new Map());
        this.instances.set("jamming", new Map());
    },

    // 添加类名，如果没有则创建一个空 Map
    addClassName(itemType, className) {
        if (!this.instances.get(itemType).has(className)) {
            this.instances.get(itemType).set(className, new Map());
        }
    },

    // 添加实例，按照 name 存储每个实例
    addInstance(itemType, className, name, instance) {
        // 如果 className 没有添加过，创建一个新的 Map
        if (!this.instances.get(itemType).has(className)) {
            this.instances.get(itemType).set(className, new Map());
        }
        // 将实例按 name 添加到 className 对应的 Map 中
        this.instances.get(itemType).get(className).set(name, instance);
    },

    // 获取指定类名下所有实例（按顺序）
    getInstancesByClassName(itemType, className) {
        if (this.instances.get(itemType).has(className)) {
            // 返回一个按 name 排序的实例数组
            return Array.from(this.instances.get(itemType).get(className).entries())
                .map(([name, instance]) => ({ name, instance }));
        }
        return [];
    },

    // 获取指定类名和实例名称的实例
    getInstance(itemType, className, name) {
        if (this.instances.get(itemType).has(className)) {
            return this.instances.get(itemType).get(className).get(name);
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


    // 删除指定类名和实例名称的实例
    deleteInstance(itemType, className, name) {
        const itemTypeMap = this.instances.get(itemType);
        if (itemTypeMap && itemTypeMap.has(className)) {
            const classNameMap = itemTypeMap.get(className);
            if (classNameMap && classNameMap.has(name)) {
                classNameMap.delete(name);
                console.log(`Instance ${name} removed from class ${className} in ${itemType}`);
            } else {
                console.log(`Instance ${name} not found in class ${className}`);
            }
        } else {
            console.log(`Class ${className} not found in item type ${itemType}`);
        }
        this.removeCurInstanceName(itemType, name);
    },

    getNextInstanceName(){
        let name;
        if (this.deletedIndexes.length > 0) {
            // 如果有删除的组件位置，复用最早删除的位置
            name = this.deletedIndexes.shift();  // 获取最早删除的索引
        } else {
            // 如果没有删除的组件位置，则按递增顺序
            name = this.nextIndex;
            this.nextIndex++;  // 更新计数器
        }
        this.components.push(String(name));
        return name;
    },

    removeCurInstanceName(itemType, name){
        name = name.substring(itemType.length);
        console.log(name);
        const index = this.components.indexOf(name);
        if (index !== -1) {
            this.components.splice(index, 1);  // 删除指定组件
            this.deletedIndexes.push(String(name));  // 记录删除的位置
            console.log(`Component removed with name: ${name}`);
        }
    },

    // 打印所有实例，按 className 顺序
    deleteAllInstances() {
        this.instances.forEach((itemTypeItem) => {
            itemTypeItem.forEach((classNameItem) => {
                classNameItem.forEach((instanceItem) =>{
                    instanceItem.delete();
                })
            });
        });
    }
}
