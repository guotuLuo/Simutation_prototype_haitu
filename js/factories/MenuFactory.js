class MenuFactory {
    static createMenu(type, map) {
        switch (type.toLowerCase()) {
            case "airplane":
                return new AirplaneContextMenu(map);
            case "radar":
                return new RadarContextMenu(map);
            case "reconnaissance":
                return new ReconnaissanceContextMenu(map);
            case "jamming":
                return new JammingContextMenu(map);
            default:
                throw new Error("Unknown menu type: ${type}");
        }
    }
}