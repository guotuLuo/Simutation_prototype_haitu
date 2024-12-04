class ComponentFactory {
    static createComponent(type, map, position, icon, contextMenu, className, instanceName) {
        switch (type.toLowerCase()) {
            case "object":
                return new Airplane(map, position, icon, contextMenu, className, instanceName);
            case "radar":
                return new Radar(map, position, icon, contextMenu, className, instanceName);
            case "reconnaissance":
                return new Reconnaissance(map, position, icon, contextMenu, className, instanceName);
            case "jamming":
                return new Jamming(map, position, icon, contextMenu, className, instanceName);
            default:
                throw new Error("Unknown airplane type: ${type}");
        }
    }
}
