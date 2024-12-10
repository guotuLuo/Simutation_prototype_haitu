class ComponentFactory {
    static createComponent(map, position, icon, contextMenu, itemType, className, instanceName) {
        switch (itemType.toLowerCase()) {
            case "object":
                return new Airplane(map, position, icon, contextMenu, itemType, className, instanceName);
            case "radar":
                return new Radar(map, position, icon, contextMenu, itemType, className, instanceName);
            case "reconnaissance":
                return new Reconnaissance(map, position, icon, contextMenu, itemType, className, instanceName);
            case "jamming":
                return new Jamming(map, position, icon, contextMenu, itemType, className, instanceName);
            default:
                throw new Error("Unknown airplane type: ${type}");
        }
    }
}
