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
class componentManager{
    initComponentManager() {
        // 用于存储每个 className 下的实例
        this.instances = new Map();
        // this.components, deletedIndexes, nextIndex 用于维护组件的名称，保证所有组件的名称按递增顺序自然增长
        this.components = [];
        this.deletedIndexes = [];  // 用于记录已删除组件的位置
        this.nextIndex = 1;  // 初始组件名称从1开始
        this.instanceNumber = 0;

        this.instances.set("radar", new Map());
        this.instances.set("object", new Map());
        this.instances.set("reconnoissance", new Map());
        this.instances.set("jamming", new Map());
    }

    // 添加类名，如果没有则创建一个空 Map
    addClassName(itemType, className) {
        if (!this.instances.get(itemType).has(className)) {
            this.instances.get(itemType).set(className, new Map());
        }
    }

    // 添加实例，按照 name 存储每个实例
    addInstance(itemType, className, name, instance) {
        // 如果 className 没有添加过，创建一个新的 Map
        if (!this.instances.get(itemType).has(className)) {
            this.instances.get(itemType).set(className, new Map());
        }
        // 将实例按 name 添加到 className 对应的 Map 中
        this.instances.get(itemType).get(className).set(name, instance);
        this.instanceNumber++;
    }



    // 获取指定类名和实例名称的实例
    getInstance(itemType, className, name) {
        if (this.instances.get(itemType).has(className)) {
            return this.instances.get(itemType).get(className).get(name);
        }else{
            return null;
        }
    }
  
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
    }

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
    }

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
    }

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
    }

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
    }

    // 删除指定itemType下所有className的实例和className自身
    deleteClassAndInstances(itemType, className) {
        if (this.instances.has(itemType)) {
            const itemTypeMap = this.instances.get(itemType);
            if (itemTypeMap.has(className)) {
                const classMap = itemTypeMap.get(className);
                classMap.forEach((instance, name) => {
                    instance.delete();
                    this.instanceNumber--;
                });
                itemTypeMap.delete(className);
                console.log(`Class ${className} in item type ${itemType} has been deleted.`);
            } else {
                console.log(`Class ${className} not found in item type ${itemType}`);
            }
        } else {
            console.log(`Item type ${itemType} not found`);
        }
    }

    // 删除指定类名和实例名称的实例, 但是这里只删除名称不删除实例
    deleteInstance(itemType, className, name) {
        const itemTypeMap = this.instances.get(itemType);
        if (itemTypeMap && itemTypeMap.has(className)) {
            const classNameMap = itemTypeMap.get(className);
            if (classNameMap) {
                // 主要逻辑，删除当前实例名称， 更新当前deleteIndex和components
                this.removeCurInstanceName(className, name);
                classNameMap.delete(name);
            } else {
                console.log(`Instance ${name} not found in class ${className}`);
            }
        } else {
            console.log(`Class ${className} not found in item type ${itemType}`);
        }
    }

    removeCurInstanceName(className, name){
        name = name.substring(className.length);
        const index = this.components.indexOf(name);
        if (index !== -1) {
            this.components.splice(index, 1);  // 删除指定组件
            this.deletedIndexes.push(String(name));  // 记录删除的位置
            console.log(`Component removed with name: ${name}`);
        }
    }

    deleteAllObjects(){
        this.instances.forEach(itemMap => {
            itemMap.forEach(classMap => {
                classMap.forEach(instance => {
                if (typeof instance.delete === 'function') {
                        instance.delete();
                        this.instanceNumber--;
                    }
                });
            });
        });
    }


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
    }




    // 重置 componentManager 所有属性的函数
    reset() {
        this.deleteAllObjects();
        this.instances.clear();
        this.instances.set("radar", new Map());
        this.instances.set("object", new Map());
        this.instances.set("reconnoissance", new Map());
        this.instances.set("jamming", new Map());

        this.components = [];
        this.deletedIndexes = [];
        this.nextIndex = 1;
    }

    // 重置索引状态
    resetIndex(components) {
        this.components = components;

        if (this.components.length === 0) {
            this.deletedIndexes = [];
            this.nextIndex = 1;
            return;
        }

        // 将字符串数组转换为数字数组并排序
        const sortedNumbers = this.components.map(Number).sort((a, b) => a - b);

        // 找出最小值和最大值
        const min = sortedNumbers[0];
        const max = sortedNumbers[sortedNumbers.length - 1];

        // 生成从最小值到最大值的完整数列
        const completeSequence = Array.from({ length: max - min + 1 }, (_, i) => min + i);

        // 找出缺失的数字
        this.deletedIndexes = completeSequence.filter(num => !sortedNumbers.includes(num));
        this.nextIndex = max + 1;
    }
}
