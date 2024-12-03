class ComponentFactory {
    static createComponent(type, map, position, icon, contextMenu) {
        switch (type.toLowerCase()) {
            case "airplane":
                return new Airplane(map, position, icon, contextMenu);
            case "radar":
                return new Radar(map, position, icon, contextMenu);
            case "reconnaissance":
                return new Reconnaissance(map, position, icon, contextMenu);
            case "jamming":
                return new Jamming(map, position, icon, contextMenu);
            default:
                throw new Error("Unknown airplane type: ${type}");
        }
    }
}
