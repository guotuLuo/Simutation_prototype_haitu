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
        this.instances.set("Radar", new Map());
        this.instances.set("Object", new Map());
        this.instances.set("Reconnaissance", new Map());
        this.instances.set("Jamming", new Map());
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

    // 打印所有实例，按 className 顺序
    printAllInstances() {
        this.instances.forEach((instancesMap, className) => {
            console.log(`Class: ${className}`);
            instancesMap.forEach((instance, name) => {
                console.log(`  Instance: ${name}`, instance);
            });
        });
    }
}
